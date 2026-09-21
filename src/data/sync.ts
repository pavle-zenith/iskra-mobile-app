import * as Network from 'expo-network';
import { AppState } from 'react-native';

import {
  afterFailure,
  classifyFailure,
  selectDue,
  toRemoteRow,
  type OutboxEntry,
  type OutboxOp,
  type PushFailure,
  type SyncTable,
} from '@/lib/sync/queue';

import { ensureSignedIn } from './auth';
import { getDb, kvGet, kvSet, serialiseWrite } from './db';
import { supabase } from './supabase';
import { onSyncRequested } from './syncSignal';

/**
 * The sync engine: drains the outbox to Supabase. It is the only code that writes to the
 * network, and nothing a person sees ever waits for it.
 *
 * Drains on start, on every local write, when connectivity returns, when the app comes to the
 * foreground, and when the earliest backoff expires. One drain at a time; a request that arrives
 * mid-drain runs one more pass after it.
 */

const SIMULATED_OFFLINE_KEY = 'dev.simulated_offline';

type OutboxRow = {
  id: number;
  table_name: SyncTable;
  row_id: string;
  op: OutboxOp;
  payload: string;
  version: number;
  attempts: number;
  next_attempt_at: number;
  dead_at: number | null;
  last_error: string | null;
};

export type SyncSnapshot = {
  pending: number;
  dead: number;
  lastDrainAt: number | null;
  lastError: string | null;
  simulatedOffline: boolean;
};

let draining: Promise<void> | null = null;
let rerun = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let lastDrainAt: number | null = null;
let lastError: string | null = null;
const watchers = new Set<() => void>();

function notify() {
  for (const watcher of watchers) watcher();
}

/** For the dev harness: re-render when the queue changes. */
export function watchSync(watcher: () => void): () => void {
  watchers.add(watcher);
  return () => watchers.delete(watcher);
}

export async function getSyncSnapshot(): Promise<SyncSnapshot> {
  const counts = await getDb().getFirstAsync<{ pending: number; dead: number }>(
    `SELECT COUNT(*) FILTER (WHERE dead_at IS NULL) AS pending,
            COUNT(*) FILTER (WHERE dead_at IS NOT NULL) AS dead
     FROM outbox`,
  );
  return {
    pending: counts?.pending ?? 0,
    dead: counts?.dead ?? 0,
    lastDrainAt,
    lastError,
    simulatedOffline: (await kvGet(SIMULATED_OFFLINE_KEY)) === '1',
  };
}

/**
 * Dev only: behave as if there were no signal, persisted across restarts, so the offline
 * acceptance test can run on a simulator whose network cannot be switched off.
 */
export async function setSimulatedOffline(offline: boolean): Promise<void> {
  if (!__DEV__) return;
  await kvSet(SIMULATED_OFFLINE_KEY, offline ? '1' : null);
  notify();
  if (!offline) void drain();
}

async function isOnline(): Promise<boolean> {
  if ((await kvGet(SIMULATED_OFFLINE_KEY)) === '1') return false;
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected !== false && state.isInternetReachable !== false;
  } catch {
    // If the platform cannot tell, try: a failed push is just a scheduled retry.
    return true;
  }
}

function toEntry(row: OutboxRow): OutboxEntry {
  return {
    id: row.id,
    table: row.table_name,
    rowId: row.row_id,
    op: row.op,
    payload: JSON.parse(row.payload) as Record<string, unknown>,
    version: row.version,
    attempts: row.attempts,
    nextAttemptAt: row.next_attempt_at,
    deadAt: row.dead_at,
    lastError: row.last_error,
  };
}

type PushResult = { ok: true } | { ok: false; failure: PushFailure };

type UpsertBuilder = {
  upsert: (
    row: Record<string, unknown>,
    options: { onConflict: string; ignoreDuplicates?: boolean },
  ) => PromiseLike<{ error: { code?: string; message: string } | null; status: number }>;
};

async function push(entry: OutboxEntry, userId: string): Promise<PushResult> {
  try {
    const table = supabase.from(entry.table) as unknown as UpsertBuilder;
    const { error, status } = await table.upsert(toRemoteRow(entry, userId), {
      onConflict: 'id',
      // Idempotent either way: the id is the client's uuid, so a retry updates, never duplicates.
      ignoreDuplicates: entry.op === 'insert_ignore',
    });
    if (!error) return { ok: true };
    if (!status) return { ok: false, failure: { kind: 'network', message: error.message } };
    return {
      ok: false,
      failure: { kind: 'http', status, code: error.code, message: error.message },
    };
  } catch (cause) {
    return { ok: false, failure: { kind: 'network', message: String(cause) } };
  }
}

async function drainOnce(): Promise<void> {
  if (!(await isOnline())) return;

  const userId = await ensureSignedIn();
  if (!userId) return;

  const db = getDb();
  const rows = await db.getAllAsync<OutboxRow>('SELECT * FROM outbox WHERE dead_at IS NULL');
  const due = selectDue(rows.map(toEntry), Date.now());

  for (const entry of due) {
    const result = await push(entry, userId);

    if (result.ok) {
      // Only if nobody re-enqueued a newer snapshot while this one was in flight.
      await serialiseWrite(() =>
        db.runAsync('DELETE FROM outbox WHERE id = ? AND version = ?', entry.id, entry.version),
      );
      continue;
    }

    const update = afterFailure(entry, result.failure, Date.now());
    await serialiseWrite(() =>
      db.runAsync(
        `UPDATE outbox SET attempts = ?, next_attempt_at = ?, dead_at = ?, last_error = ?
         WHERE id = ? AND version = ?`,
        update.attempts,
        update.nextAttemptAt,
        update.deadAt,
        update.lastError,
        entry.id,
        entry.version,
      ),
    );
    lastError = `${entry.table}: ${update.lastError}`;

    const verdict = classifyFailure(result.failure);
    if (verdict === 'dead') {
      if (__DEV__) console.warn(`[sync] parked ${entry.table}/${entry.rowId}: ${update.lastError}`);
      continue;
    }
    if (verdict === 'reauth') await supabase.auth.refreshSession();
    // No signal, a busy server, or a parent row still on its way: stop this pass and let the
    // backoff timer bring us back.
    return;
  }
  lastError = null;
}

/** Run a drain now, or once more after the one in progress. Never awaited by a screen. */
export function drain(): Promise<void> {
  if (draining) {
    rerun = true;
    return draining;
  }
  draining = (async () => {
    try {
      do {
        rerun = false;
        await drainOnce();
      } while (rerun);
      lastDrainAt = Date.now();
    } catch (cause) {
      lastError = String(cause);
    } finally {
      draining = null;
      await scheduleNextAttempt();
      notify();
    }
  })();
  return draining;
}

async function scheduleNextAttempt() {
  if (timer) clearTimeout(timer);
  timer = null;
  const next = await getDb().getFirstAsync<{ at: number | null }>(
    'SELECT MIN(next_attempt_at) AS at FROM outbox WHERE dead_at IS NULL',
  );
  if (next?.at == null) return;
  const delay = Math.max(1_000, next.at - Date.now());
  timer = setTimeout(() => void drain(), Math.min(delay, 5 * 60_000));
}

/** Starts listening for every reason to drain. Returns the stop function. */
export function startSyncEngine(): () => void {
  const stopSignal = onSyncRequested(() => void drain());
  const network = Network.addNetworkStateListener((state) => {
    if (state.isConnected && state.isInternetReachable !== false) void drain();
  });
  const appState = AppState.addEventListener('change', (state) => {
    if (state === 'active') void drain();
  });
  void drain();

  return () => {
    stopSignal();
    network.remove();
    appState.remove();
    if (timer) clearTimeout(timer);
    timer = null;
  };
}
