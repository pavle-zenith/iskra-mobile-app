/**
 * @jest-environment node
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '../../src/lib/supabase/database.types';

/**
 * RLS isolation, against the live project. The one test that proves one person's cravings
 * and slips can never be read or changed by another.
 *
 * All five app policies are `FOR ALL` on role `public`, so the USING / WITH CHECK clause is the
 * entire protection (verified 18.09.2026: `auth.uid() = user_id`, and `auth.uid() = id` for
 * profiles). This test keeps it that way: if a policy is ever loosened, it fails.
 *
 * Side effects: two anonymous auth users per run (auth.users rows cannot be deleted without the
 * service role, which this repo must never hold). Every data row it writes, it deletes.
 * Needs EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY; skipped without them.
 *
 * Run: npm run test:rls
 */

type Client = SupabaseClient<Database>;
type DataTable = 'cravings' | 'checkins' | 'slips' | 'milestones';

// Read by computed name: babel-preset-expo rewrites literal `process.env.EXPO_PUBLIC_*` into an
// import of Expo's virtual env module, which only exists inside Metro.
const readEnv = (name: string) => process.env[name];
const url = readEnv('EXPO_PUBLIC_SUPABASE_URL');
const key = readEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
// Locally the suite skips without credentials. In CI (RLS_REQUIRED=1) a missing credential is
// a failure, never a silent skip: a green build must mean isolation was actually tested.
if (readEnv('RLS_REQUIRED') === '1' && !(url && key)) {
  throw new Error('RLS test is required but EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY are not set');
}
const suite = url && key ? describe : describe.skip;

const uuid = () => crypto.randomUUID();

function newClient(): Client {
  return createClient<Database>(url as string, key as string, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function anonymousUser(): Promise<{ client: Client; id: string }> {
  const client = newClient();
  const { data, error } = await client.auth.signInAnonymously();
  if (error || !data.user) throw error ?? new Error('anonymous sign-in returned no user');
  return { client, id: data.user.id };
}

function ok<T extends { error: { message: string } | null }>(result: T): T {
  if (result.error) throw new Error(result.error.message);
  return result;
}

/** A minimal valid row for each table, owned by `userId`. */
const rowFor: Record<DataTable, (id: string, userId: string) => Record<string, unknown>> = {
  cravings: (id, userId) => ({
    id,
    user_id: userId,
    strength: 5,
    tool_used: 'disem',
    outcome: 'survived',
  }),
  checkins: (id, userId) => ({ id, user_id: userId, date: '2026-09-18', clean: true }),
  slips: (id, userId) => ({ id, user_id: userId, trigger: 'stres', notes: 'rls isolation test' }),
  milestones: (id, userId) => ({
    id,
    user_id: userId,
    key: 'rls_isolation_test',
    category: 'test',
  }),
};

/** A change B will try to make to A's row. */
const tamper: Record<DataTable, Record<string, unknown>> = {
  cravings: { strength: 1 },
  checkins: { clean: false },
  slips: { notes: 'tampered' },
  milestones: { shared: true },
};

const TABLES = Object.keys(rowFor) as DataTable[];

suite('RLS isolation (live Supabase)', () => {
  let a: { client: Client; id: string };
  let b: { client: Client; id: string };
  const aRows = Object.fromEntries(TABLES.map((table) => [table, uuid()])) as Record<
    DataTable,
    string
  >;

  // The untyped view of the client for table-generic calls; the typed one is used where the
  // table is known.
  const from = (client: Client, table: DataTable) =>
    client.from(table) as unknown as ReturnType<Client['from']>;

  beforeAll(async () => {
    a = await anonymousUser();
    b = await anonymousUser();
    expect(a.id).not.toBe(b.id);

    ok(await a.client.from('profiles').insert({ id: a.id }));
    ok(await b.client.from('profiles').insert({ id: b.id }));
    for (const table of TABLES) {
      ok(await from(a.client, table).insert(rowFor[table](aRows[table], a.id) as never));
    }
  }, 30_000);

  afterAll(async () => {
    if (a) {
      for (const table of TABLES) await from(a.client, table).delete().eq('id', aRows[table]);
      await a.client.from('profiles').delete().eq('id', a.id);
    }
    if (b) await b.client.from('profiles').delete().eq('id', b.id);
  }, 30_000);

  it.each(TABLES)('A reads its own %s row', async (table) => {
    const { data, error } = await from(a.client, table).select('id').eq('id', aRows[table]);
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it.each(TABLES)('B cannot read A’s %s row', async (table) => {
    const { data, error } = await from(b.client, table).select('*').eq('id', aRows[table]);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it.each(TABLES)('B cannot update A’s %s row', async (table) => {
    const { data } = await from(b.client, table)
      .update(tamper[table] as never)
      .eq('id', aRows[table])
      .select();
    expect(data ?? []).toEqual([]);

    const check = await from(a.client, table).select('*').eq('id', aRows[table]).single();
    const [column, value] = Object.entries(tamper[table])[0] as [string, unknown];
    expect((check.data as Record<string, unknown>)[column]).not.toEqual(value);
  });

  it.each(TABLES)('B cannot delete A’s %s row', async (table) => {
    const { data } = await from(b.client, table).delete().eq('id', aRows[table]).select();
    expect(data ?? []).toEqual([]);

    const check = await from(a.client, table).select('id').eq('id', aRows[table]);
    expect(check.data).toHaveLength(1);
  });

  it.each(TABLES)('B cannot write a %s row owned by A', async (table) => {
    const { error } = await from(b.client, table).insert(rowFor[table](uuid(), a.id) as never);
    expect(error?.code).toBe('42501');
  });

  describe('profiles, which key on id rather than user_id', () => {
    it('A reads its own profile', async () => {
      const { data } = await a.client.from('profiles').select('id').eq('id', a.id);
      expect(data).toEqual([{ id: a.id }]);
    });

    it('B cannot read A’s profile', async () => {
      const { data, error } = await b.client.from('profiles').select('*').eq('id', a.id);
      expect(error).toBeNull();
      expect(data).toEqual([]);
    });

    it('B cannot update A’s profile', async () => {
      const { data } = await b.client
        .from('profiles')
        .update({ name: 'tampered' })
        .eq('id', a.id)
        .select();
      expect(data ?? []).toEqual([]);

      const check = await a.client.from('profiles').select('name').eq('id', a.id).single();
      expect(check.data?.name).not.toBe('tampered');
    });

    it('B cannot create or overwrite a profile under A’s id', async () => {
      const insert = await b.client.from('profiles').insert({ id: a.id, name: 'tampered' });
      expect(insert.error).not.toBeNull();

      const upsert = await b.client.from('profiles').upsert({ id: a.id, name: 'tampered' });
      expect(upsert.error).not.toBeNull();
    });

    it('B cannot delete A’s profile', async () => {
      const { data } = await b.client.from('profiles').delete().eq('id', a.id).select();
      expect(data ?? []).toEqual([]);
    });
  });

  describe('quiz_submissions, the website lead table', () => {
    // It holds real email addresses. The app must never touch it, and the publishable key
    // must not be a way in. Since M2 the table has no policies at all: only the website's
    // server routes reach it, with the service role, which bypasses RLS.
    const probe = () => `rls-probe-${uuid()}@example.invalid`;

    it('cannot be read, with or without a session', async () => {
      for (const client of [a.client, newClient()]) {
        const { data, error } = await client.from('quiz_submissions').select('email').limit(1);
        expect(error).toBeNull();
        expect(data).toEqual([]);
      }
    });

    it('cannot be inserted into', async () => {
      for (const client of [a.client, newClient()]) {
        const { error } = await client.from('quiz_submissions').insert({ email: probe() });
        expect(error?.code).toBe('42501');
      }
    });

    it('cannot be updated', async () => {
      // Nothing is visible to update, so a successful call must still change zero rows.
      for (const client of [a.client, newClient()]) {
        const { data, error } = await client
          .from('quiz_submissions')
          .update({ name: 'tampered' })
          .neq('email', '')
          .select();
        if (error) expect(error.code).toBe('42501');
        else expect(data ?? []).toEqual([]);
      }
    });

    it('cannot be deleted from', async () => {
      const { data, error } = await a.client
        .from('quiz_submissions')
        .delete()
        .neq('email', '')
        .select();
      if (error) expect(error.code).toBe('42501');
      else expect(data ?? []).toEqual([]);
    });
  });

  describe('a client with no session at all', () => {
    const stranger = () => newClient();

    it.each([...TABLES, 'profiles' as const])('sees no %s rows', async (table) => {
      const { data } = await (stranger().from(table) as unknown as ReturnType<Client['from']>)
        .select('*')
        .limit(1);
      expect(data ?? []).toEqual([]);
    });

    it('cannot write', async () => {
      const { error } = await stranger()
        .from('cravings')
        .insert(rowFor.cravings(uuid(), a.id) as never);
      expect(error).not.toBeNull();
    });
  });
});
