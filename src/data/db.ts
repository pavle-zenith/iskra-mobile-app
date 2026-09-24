import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

/**
 * The local database. Reads ALWAYS come from here; Supabase is a backup and a sync target,
 * never a source a screen waits on.
 *
 * Mirrors the five Supabase tables column for column, with two deliberate differences:
 * - `profiles` has one local row, id 'me'. The server id is the auth user id, which may not
 *   exist yet (first launch with no signal), so it is stamped at push time.
 * - `user_id` is nullable everywhere for the same reason.
 * Arrays are stored as JSON text, booleans as 0/1, timestamps as ISO 8601 text.
 *
 * Migrations are append-only. Never edit a shipped entry; add a new one.
 */
const MIGRATIONS: readonly string[] = [
  // 1: mirror of the five app tables, the outbox, and a key-value store.
  `
  CREATE TABLE profiles (
    id TEXT PRIMARY KEY NOT NULL,
    remote_id TEXT,
    name TEXT,
    gender TEXT,
    product TEXT DEFAULT 'cigarete',
    cigarettes_per_day INTEGER DEFAULT 20,
    cigarettes_per_pack INTEGER DEFAULT 20,
    pack_price_rsd INTEGER DEFAULT 0,
    quit_date TEXT,
    quit_time_zone TEXT,
    reasons TEXT NOT NULL DEFAULT '[]',
    reason_text TEXT,
    fears TEXT NOT NULL DEFAULT '[]',
    triggers TEXT NOT NULL DEFAULT '[]',
    timing TEXT,
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    is_premium INTEGER NOT NULL DEFAULT 0,
    committed INTEGER NOT NULL DEFAULT 0,
    signature_data TEXT,
    push_token TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE cravings (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    strength INTEGER,
    trigger TEXT,
    tool_used TEXT,
    duration_seconds INTEGER,
    outcome TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX cravings_created_at ON cravings (created_at);

  CREATE TABLE checkins (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    date TEXT NOT NULL UNIQUE,
    clean INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE slips (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    trigger TEXT,
    notes TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX slips_created_at ON slips (created_at);

  CREATE TABLE milestones (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT,
    key TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    unlocked_at TEXT NOT NULL,
    shared INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE outbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    row_id TEXT NOT NULL,
    op TEXT NOT NULL,
    payload TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at INTEGER NOT NULL DEFAULT 0,
    dead_at INTEGER,
    last_error TEXT,
    created_at INTEGER NOT NULL,
    UNIQUE (table_name, row_id)
  );

  CREATE TABLE kv (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT
  );
  `,

  // 2: consent, mirrored from Supabase migration 20260924095550 (docs/LEGAL-brief.md).
  // `consented_at` is the gate: until it is set, nothing but this schema exists on the phone.
  `
  ALTER TABLE profiles ADD COLUMN consented_at TEXT;
  ALTER TABLE profiles ADD COLUMN analytics_consent INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE profiles ADD COLUMN marketing_consent INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE profiles ADD COLUMN marketing_consent_at TEXT;
  `,

  // 3: how many cigarettes a slip was, mirrored from Supabase migration 20260924125902
  // (docs/M5-brief.md Task 6). Existing slips count as one, as the engine always counted them.
  `
  ALTER TABLE slips ADD COLUMN cigarettes INTEGER NOT NULL DEFAULT 1;
  `,
];

/** Every table that holds anything a person entered or the app derived from it. */
const DATA_TABLES = ['cravings', 'slips', 'checkins', 'milestones', 'outbox', 'kv', 'profiles'];

let database: SQLiteDatabase | null = null;

/**
 * True when this launch created the database from nothing: a first install, or a reinstall.
 * "Obriši sve podatke" empties the tables but keeps the schema, so it never looks like this.
 */
let createdThisLaunch = false;

export function wasCreatedThisLaunch(): boolean {
  getDb();
  return createdThisLaunch;
}

function migrate(db: SQLiteDatabase) {
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current === 0) createdThisLaunch = true;
  for (let version = current; version < MIGRATIONS.length; version += 1) {
    db.withTransactionSync(() => {
      db.execSync(MIGRATIONS[version] as string);
      db.execSync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}

/**
 * Opens and migrates on first use. Synchronous on purpose: the schema is tiny, and a write
 * from a Poriv tool must never wait on an "is the database ready" promise.
 */
export function getDb(): SQLiteDatabase {
  if (!database) {
    const db = openDatabaseSync('iskra.db');
    db.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    migrate(db);
    database = db;
  }
  return database;
}

let writeQueue: Promise<unknown> = Promise.resolve();

/**
 * Serialises every write to the database, wherever it comes from.
 *
 * expo-sqlite holds an exclusive lock for the length of a transaction, and any other write
 * issued while one is open fails with "database is locked". Until M3 that overlap was rare;
 * now it is routine, because a craving row is written while the outbox drains and while the
 * key-value store is touched. Nothing may throw at someone mid-craving, so every writer
 * queues here. Reads are untouched: WAL lets them run alongside.
 */
export function serialiseWrite<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  // The queue must survive a failed write, so the next one still runs.
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function kvGet(key: string): Promise<string | null> {
  const row = await getDb().getFirstAsync<{ value: string | null }>(
    'SELECT value FROM kv WHERE key = ?',
    key,
  );
  return row?.value ?? null;
}

export async function kvSet(key: string, value: string | null): Promise<void> {
  await serialiseWrite(() =>
    getDb().runAsync(
      'INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      key,
      value,
    ),
  );
}

/**
 * "Obriši sve podatke", on the phone: every row in every table, in one transaction, leaving
 * only the empty schema, which is exactly the state of a first launch. Goes through the write
 * queue like every other write, and deliberately does not ask for a sync: there is nothing left
 * to send, and the outbox itself is one of the tables emptied.
 */
export async function wipeLocalData(): Promise<void> {
  await serialiseWrite(() =>
    getDb().withExclusiveTransactionAsync(async (tx) => {
      for (const table of DATA_TABLES) await tx.runAsync(`DELETE FROM ${table}`);
    }),
  );
}
