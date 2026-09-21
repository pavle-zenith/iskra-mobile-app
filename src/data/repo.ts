import { randomUUID } from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import { mergeEnqueue, type OutboxOp, type SyncTable } from '@/lib/sync/queue';
import {
  isCravingOutcome,
  isStrength,
  isToolKey,
  isTriggerKey,
  type CravingOutcome,
  type ToolKey,
  type TriggerKey,
} from '@/lib/vocab';

import { getDb } from './db';
import { requestSync } from './syncSignal';

/**
 * The only way the app writes data. Every function here:
 *   1. writes SQLite and the outbox in one transaction,
 *   2. returns as soon as that local write lands,
 *   3. nudges the sync engine without awaiting it.
 * Nothing here touches the network. A screen that awaits one of these is awaiting the phone's
 * own disk, never a signal.
 */

type Tx = Pick<SQLiteDatabase, 'runAsync' | 'getFirstAsync'>;

export type CravingRow = {
  id: string;
  strength: number | null;
  trigger: TriggerKey | null;
  tool_used: ToolKey | null;
  duration_seconds: number | null;
  outcome: CravingOutcome | null;
  created_at: string;
};

export type SlipRow = {
  id: string;
  trigger: TriggerKey | null;
  notes: string | null;
  created_at: string;
};
export type CheckinRow = { id: string; date: string; clean: boolean; created_at: string };
export type MilestoneRow = {
  id: string;
  key: string;
  category: string;
  unlocked_at: string;
  shared: boolean;
};

/** A row plus whether it is still waiting in the outbox. */
export type Synced<T> = T & { pending: boolean };

async function enqueue(tx: Tx, table: SyncTable, rowId: string, op: OutboxOp, payload: object) {
  const existing = await tx.getFirstAsync<{ op: OutboxOp; payload: string }>(
    'SELECT op, payload FROM outbox WHERE table_name = ? AND row_id = ?',
    table,
    rowId,
  );
  const merged = mergeEnqueue(
    existing ? { op: existing.op, payload: JSON.parse(existing.payload) } : null,
    { op, payload: payload as Record<string, unknown> },
  );
  await tx.runAsync(
    `INSERT INTO outbox (table_name, row_id, op, payload, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(table_name, row_id) DO UPDATE SET
       op = excluded.op,
       payload = excluded.payload,
       version = outbox.version + 1,
       attempts = 0,
       next_attempt_at = 0,
       dead_at = NULL,
       last_error = NULL`,
    table,
    rowId,
    merged.op,
    JSON.stringify(merged.payload),
    Date.now(),
  );
}

async function write(task: (tx: Tx) => Promise<void>) {
  await getDb().withExclusiveTransactionAsync(task);
  requestSync('local-write');
}

function assertVocab(ok: boolean, what: string, value: unknown) {
  // A seventh tool string must never reach SQLite, let alone Supabase.
  if (!ok)
    throw new TypeError(`${what} outside the vocabulary in src/lib/vocab.ts: ${String(value)}`);
}

// --- cravings --------------------------------------------------------------

export type CravingInput = {
  strength?: number | null;
  trigger?: TriggerKey | null;
  toolUsed?: ToolKey | null;
  durationSeconds?: number | null;
  outcome?: CravingOutcome | null;
};

function validateCraving(input: CravingInput) {
  if (input.strength != null) assertVocab(isStrength(input.strength), 'strength', input.strength);
  if (input.trigger != null) assertVocab(isTriggerKey(input.trigger), 'trigger', input.trigger);
  if (input.toolUsed != null) assertVocab(isToolKey(input.toolUsed), 'tool_used', input.toolUsed);
  if (input.outcome != null) assertVocab(isCravingOutcome(input.outcome), 'outcome', input.outcome);
}

function cravingPayload(row: CravingRow) {
  const { id, strength, trigger, tool_used, duration_seconds, outcome, created_at } = row;
  return { id, strength, trigger, tool_used, duration_seconds, outcome, created_at };
}

/** Starts a craving record. Poriv mod calls this the moment the user taps "Imam poriv". */
export async function logCraving(input: CravingInput = {}): Promise<CravingRow> {
  validateCraving(input);
  const row: CravingRow = {
    id: randomUUID(),
    strength: input.strength ?? null,
    trigger: input.trigger ?? null,
    tool_used: input.toolUsed ?? null,
    duration_seconds: input.durationSeconds ?? null,
    outcome: input.outcome ?? null,
    created_at: new Date().toISOString(),
  };
  await write(async (tx) => {
    await tx.runAsync(
      `INSERT INTO cravings (id, strength, trigger, tool_used, duration_seconds, outcome, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      row.id,
      row.strength,
      row.trigger,
      row.tool_used,
      row.duration_seconds,
      row.outcome,
      row.created_at,
    );
    await enqueue(tx, 'cravings', row.id, 'upsert', cravingPayload(row));
  });
  return row;
}

/** Completes a craving record: the tool used, how long it took, how it ended. */
export async function updateCraving(id: string, input: CravingInput): Promise<CravingRow | null> {
  validateCraving(input);
  let updated: CravingRow | null = null;
  await write(async (tx) => {
    const current = await tx.getFirstAsync<CravingRow>('SELECT * FROM cravings WHERE id = ?', id);
    if (!current) return;
    updated = {
      ...current,
      strength: input.strength !== undefined ? input.strength : current.strength,
      trigger: input.trigger !== undefined ? input.trigger : current.trigger,
      tool_used: input.toolUsed !== undefined ? input.toolUsed : current.tool_used,
      duration_seconds:
        input.durationSeconds !== undefined ? input.durationSeconds : current.duration_seconds,
      outcome: input.outcome !== undefined ? input.outcome : current.outcome,
    };
    await tx.runAsync(
      `UPDATE cravings SET strength = ?, trigger = ?, tool_used = ?, duration_seconds = ?, outcome = ?
       WHERE id = ?`,
      updated.strength,
      updated.trigger,
      updated.tool_used,
      updated.duration_seconds,
      updated.outcome,
      id,
    );
    await enqueue(tx, 'cravings', id, 'upsert', cravingPayload(updated));
  });
  return updated;
}

export async function listCravings(): Promise<Synced<CravingRow>[]> {
  const rows = await getDb().getAllAsync<CravingRow & { pending: number }>(
    `SELECT c.id, c.strength, c.trigger, c.tool_used, c.duration_seconds, c.outcome, c.created_at,
            EXISTS (SELECT 1 FROM outbox o WHERE o.table_name = 'cravings' AND o.row_id = c.id) AS pending
     FROM cravings c ORDER BY c.created_at DESC`,
  );
  return rows.map((row) => ({ ...row, pending: row.pending === 1 }));
}

// --- slips -----------------------------------------------------------------

/**
 * Logs a slip. It never touches `quit_date` or any counter: the total smoke-free time does
 * not reset (PRODUCT.md). That is why slips are their own table.
 */
export async function logSlip(input: { trigger?: TriggerKey | null; notes?: string | null }) {
  if (input.trigger != null) assertVocab(isTriggerKey(input.trigger), 'trigger', input.trigger);
  const row: SlipRow = {
    id: randomUUID(),
    trigger: input.trigger ?? null,
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
  };
  await write(async (tx) => {
    await tx.runAsync(
      'INSERT INTO slips (id, trigger, notes, created_at) VALUES (?, ?, ?, ?)',
      row.id,
      row.trigger,
      row.notes,
      row.created_at,
    );
    await enqueue(tx, 'slips', row.id, 'upsert', row);
  });
  return row;
}

export async function listSlips(): Promise<SlipRow[]> {
  return getDb().getAllAsync<SlipRow>(
    'SELECT id, trigger, notes, created_at FROM slips ORDER BY created_at DESC',
  );
}

// --- checkins --------------------------------------------------------------

/**
 * One check-in per calendar day (`date` is YYYY-MM-DD, the user's local date). Checking in
 * twice the same day updates the same row and the same server id.
 */
export async function recordCheckin(date: string, clean: boolean): Promise<CheckinRow> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new TypeError(`checkin date must be YYYY-MM-DD: ${date}`);
  let row: CheckinRow | null = null;
  await write(async (tx) => {
    const existing = await tx.getFirstAsync<{ id: string; created_at: string }>(
      'SELECT id, created_at FROM checkins WHERE date = ?',
      date,
    );
    row = {
      id: existing?.id ?? randomUUID(),
      date,
      clean,
      created_at: existing?.created_at ?? new Date().toISOString(),
    };
    await tx.runAsync(
      `INSERT INTO checkins (id, date, clean, created_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET clean = excluded.clean`,
      row.id,
      row.date,
      row.clean ? 1 : 0,
      row.created_at,
    );
    await enqueue(tx, 'checkins', row.id, 'upsert', row);
  });
  return row as unknown as CheckinRow;
}

// --- milestones ------------------------------------------------------------

/** Unlocks a milestone once. Unlocking it again returns the original row untouched. */
export async function unlockMilestone(key: string, category: string): Promise<MilestoneRow> {
  let row: MilestoneRow | null = null;
  await write(async (tx) => {
    const existing = await tx.getFirstAsync<Omit<MilestoneRow, 'shared'> & { shared: number }>(
      'SELECT id, key, category, unlocked_at, shared FROM milestones WHERE key = ?',
      key,
    );
    if (existing) {
      row = { ...existing, shared: existing.shared === 1 };
      return;
    }
    row = { id: randomUUID(), key, category, unlocked_at: new Date().toISOString(), shared: false };
    await tx.runAsync(
      'INSERT INTO milestones (id, key, category, unlocked_at, shared) VALUES (?, ?, ?, ?, 0)',
      row.id,
      row.key,
      row.category,
      row.unlocked_at,
    );
    await enqueue(tx, 'milestones', row.id, 'upsert', row);
  });
  return row as unknown as MilestoneRow;
}

// --- profile ---------------------------------------------------------------

const PROFILE_ID = 'me';

/** Ensures the single local profile row exists. Server defaults, mirrored. */
export async function ensureLocalProfile(tx: Tx = getDb()): Promise<void> {
  const now = new Date().toISOString();
  await tx.runAsync(
    'INSERT OR IGNORE INTO profiles (id, created_at, updated_at) VALUES (?, ?, ?)',
    PROFILE_ID,
    now,
    now,
  );
}

/**
 * Called once per auth identity: records the server id locally and queues the creation of the
 * `profiles` row. `profiles.id` has no default and mirrors `auth.users.id`, so it must be
 * written explicitly, and nothing else can sync until it exists (every `user_id` references it).
 */
export async function bindProfileToUser(userId: string): Promise<void> {
  await write(async (tx) => {
    await ensureLocalProfile(tx);
    await tx.runAsync('UPDATE profiles SET remote_id = ? WHERE id = ?', userId, PROFILE_ID);
    await enqueue(tx, 'profiles', PROFILE_ID, 'insert_ignore', {});
  });
}
