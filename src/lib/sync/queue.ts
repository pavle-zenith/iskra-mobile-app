/**
 * Write-queue decision logic. Pure: no database, no network, no clock of its own.
 * The driver (src/data/sync.ts) owns SQLite and Supabase and asks this file what to do.
 *
 * The contract the whole app rests on: every write lands in SQLite and returns immediately;
 * this queue pushes it to Supabase later. Rows carry a client-generated uuid, so a retried
 * push is an idempotent upsert and can never duplicate.
 */

export type SyncTable = 'profiles' | 'cravings' | 'checkins' | 'slips' | 'milestones';

export type OutboxOp =
  /** Full-row upsert. Last write wins: there is no multi-device editing in v1. */
  | 'upsert'
  /** Create if missing, never overwrite. Used once, for the profiles row at first sign-in. */
  | 'insert_ignore';

export type OutboxEntry = {
  id: number;
  table: SyncTable;
  rowId: string;
  op: OutboxOp;
  /** Row snapshot WITHOUT the owner column; the owner is stamped at push time. */
  payload: Record<string, unknown>;
  /** Bumped every time the row is re-enqueued, so an in-flight push of an older snapshot
   *  cannot delete the entry for a newer one. */
  version: number;
  attempts: number;
  nextAttemptAt: number;
  deadAt: number | null;
  lastError: string | null;
};

/**
 * Every other table's `user_id` is a foreign key to `profiles.id`, so the profile goes first.
 */
export const TABLE_PRIORITY: Record<SyncTable, number> = {
  profiles: 0,
  cravings: 1,
  checkins: 1,
  slips: 1,
  milestones: 1,
};

/** Entries to push now: alive, due, profiles first, then oldest first. */
export function selectDue(entries: readonly OutboxEntry[], now: number, limit = 50): OutboxEntry[] {
  return entries
    .filter((entry) => entry.deadAt === null && entry.nextAttemptAt <= now)
    .sort((a, b) => TABLE_PRIORITY[a.table] - TABLE_PRIORITY[b.table] || a.id - b.id)
    .slice(0, limit);
}

export const BACKOFF_BASE_MS = 2_000;
export const BACKOFF_CAP_MS = 5 * 60_000;

/**
 * Exponential backoff with jitter: 2s, 4s, 8s ... capped at 5 minutes, then scaled to
 * 50–100% so a fleet of phones coming off a tunnel does not retry in lockstep.
 */
export function backoffDelayMs(attempts: number, random: () => number = Math.random): number {
  const exponential = BACKOFF_BASE_MS * 2 ** Math.max(0, attempts - 1);
  const capped = Math.min(BACKOFF_CAP_MS, exponential);
  return Math.round(capped * (0.5 + random() * 0.5));
}

export type PushFailure =
  | { kind: 'network'; message?: string }
  | { kind: 'http'; status: number; code?: string; message?: string };

/**
 * - `retry`: transient. Try again after backoff, forever. A craving must eventually land.
 * - `reauth`: the session is missing or expired. Refresh it, then retry.
 * - `dead`: the server will never accept this row as it is. Park it; do not hammer.
 */
export type FailureVerdict = 'retry' | 'reauth' | 'dead';

// Postgres error codes, as surfaced by PostgREST.
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PERMANENT_PG_CODES = new Set([
  '23514', // check_violation: a value outside the vocabulary
  '23502', // not_null_violation
  '22P02', // invalid_text_representation
  '22001', // string_data_right_truncation
  '42501', // insufficient_privilege: RLS refused the row
  '42703', // undefined_column: app and schema disagree
]);
const REAUTH_CODES = new Set(['PGRST301', 'PGRST302', 'PGRST303']);

export function classifyFailure(failure: PushFailure): FailureVerdict {
  if (failure.kind === 'network') return 'retry';

  const { status, code } = failure;
  if (status === 401 || (code && REAUTH_CODES.has(code))) return 'reauth';
  // The profile row has not reached the server yet; it is queued ahead of this one.
  if (code === PG_FOREIGN_KEY_VIOLATION) return 'retry';
  if (code && PERMANENT_PG_CODES.has(code)) return 'dead';
  if (status === 408 || status === 429 || status >= 500 || status === 0) return 'retry';
  if (status >= 400) return 'dead';
  return 'retry';
}

export type FailureUpdate = Pick<
  OutboxEntry,
  'attempts' | 'nextAttemptAt' | 'deadAt' | 'lastError'
>;

export function afterFailure(
  entry: Pick<OutboxEntry, 'attempts'>,
  failure: PushFailure,
  now: number,
  random: () => number = Math.random,
): FailureUpdate {
  const verdict = classifyFailure(failure);
  const attempts = entry.attempts + 1;
  const lastError =
    failure.kind === 'network'
      ? `network${failure.message ? `: ${failure.message}` : ''}`
      : `${failure.status}${failure.code ? ` ${failure.code}` : ''}${failure.message ? `: ${failure.message}` : ''}`;

  if (verdict === 'dead') {
    return { attempts, nextAttemptAt: now, deadAt: now, lastError };
  }
  return {
    attempts,
    nextAttemptAt: now + backoffDelayMs(attempts, random),
    deadAt: null,
    lastError,
  };
}

/** The owner column of each table: `profiles` keys on `id`, everything else on `user_id`. */
export const OWNER_COLUMN: Record<SyncTable, 'id' | 'user_id'> = {
  profiles: 'id',
  cravings: 'user_id',
  checkins: 'user_id',
  slips: 'user_id',
  milestones: 'user_id',
};

/**
 * The row as Supabase should receive it: the local snapshot, stamped with the signed-in
 * user as owner. Local rows are written before sign-in may have happened (first launch on a
 * bus with no signal), so ownership is decided at push time, not at write time.
 */
export function toRemoteRow(entry: Pick<OutboxEntry, 'table' | 'payload'>, userId: string) {
  return { ...entry.payload, [OWNER_COLUMN[entry.table]]: userId };
}

/**
 * Re-enqueueing a row that is already waiting. There is one outbox entry per row, holding
 * the newest snapshot: an `upsert` always wins, and an `insert_ignore` never overwrites a
 * pending `upsert` (it would send an emptier row than the one the user already wrote).
 */
export function mergeEnqueue(
  existing: Pick<OutboxEntry, 'op' | 'payload'> | null,
  incoming: Pick<OutboxEntry, 'op' | 'payload'>,
): Pick<OutboxEntry, 'op' | 'payload'> {
  if (!existing) return incoming;
  if (incoming.op === 'insert_ignore' && existing.op === 'upsert') return existing;
  return incoming;
}
