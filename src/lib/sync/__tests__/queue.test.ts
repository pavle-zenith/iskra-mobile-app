import {
  BACKOFF_CAP_MS,
  afterFailure,
  backoffDelayMs,
  classifyFailure,
  mergeEnqueue,
  selectDue,
  toRemoteRow,
  type OutboxEntry,
} from '../queue';

const entry = (over: Partial<OutboxEntry>): OutboxEntry => ({
  id: 1,
  table: 'cravings',
  rowId: 'row',
  op: 'upsert',
  payload: {},
  version: 1,
  attempts: 0,
  nextAttemptAt: 0,
  deadAt: null,
  lastError: null,
  ...over,
});

describe('selectDue', () => {
  it('pushes the profile before any row that references it, then oldest first', () => {
    const due = selectDue(
      [
        entry({ id: 3, table: 'cravings' }),
        entry({ id: 5, table: 'profiles' }),
        entry({ id: 1, table: 'slips' }),
      ],
      1_000,
    );
    expect(due.map((e) => e.id)).toEqual([5, 1, 3]);
  });

  it('skips entries still in backoff and entries parked as dead', () => {
    const due = selectDue(
      [
        entry({ id: 1, nextAttemptAt: 2_000 }),
        entry({ id: 2, deadAt: 500 }),
        entry({ id: 3, nextAttemptAt: 1_000 }),
      ],
      1_000,
    );
    expect(due.map((e) => e.id)).toEqual([3]);
  });

  it('respects the batch limit', () => {
    const many = Array.from({ length: 10 }, (_, i) => entry({ id: i + 1 }));
    expect(selectDue(many, 0, 4)).toHaveLength(4);
  });
});

describe('backoffDelayMs', () => {
  it('doubles from 2s and stays within 50–100% of the step', () => {
    expect(backoffDelayMs(1, () => 1)).toBe(2_000);
    expect(backoffDelayMs(2, () => 1)).toBe(4_000);
    expect(backoffDelayMs(3, () => 0)).toBe(4_000);
  });

  it('never exceeds five minutes', () => {
    expect(backoffDelayMs(40, () => 1)).toBe(BACKOFF_CAP_MS);
  });
});

describe('classifyFailure', () => {
  it('retries anything that looks like no signal or a busy server', () => {
    expect(classifyFailure({ kind: 'network' })).toBe('retry');
    expect(classifyFailure({ kind: 'http', status: 503 })).toBe('retry');
    expect(classifyFailure({ kind: 'http', status: 429 })).toBe('retry');
    expect(classifyFailure({ kind: 'http', status: 0 })).toBe('retry');
  });

  it('retries a missing parent profile, which is queued ahead', () => {
    expect(classifyFailure({ kind: 'http', status: 409, code: '23503' })).toBe('retry');
  });

  it('asks for a fresh session on an expired or missing token', () => {
    expect(classifyFailure({ kind: 'http', status: 401 })).toBe('reauth');
    expect(classifyFailure({ kind: 'http', status: 401, code: 'PGRST301' })).toBe('reauth');
  });

  it('parks rows the server will never accept', () => {
    expect(classifyFailure({ kind: 'http', status: 400, code: '23514' })).toBe('dead');
    expect(classifyFailure({ kind: 'http', status: 403, code: '42501' })).toBe('dead');
    expect(classifyFailure({ kind: 'http', status: 400 })).toBe('dead');
  });
});

describe('afterFailure', () => {
  it('schedules a retry with backoff and records why', () => {
    expect(
      afterFailure({ attempts: 0 }, { kind: 'network', message: 'offline' }, 10_000, () => 1),
    ).toEqual({
      attempts: 1,
      nextAttemptAt: 12_000,
      deadAt: null,
      lastError: 'network: offline',
    });
  });

  it('parks a permanent failure instead of retrying it', () => {
    expect(
      afterFailure(
        { attempts: 2 },
        { kind: 'http', status: 400, code: '23514', message: 'check' },
        9,
        () => 1,
      ),
    ).toEqual({ attempts: 3, nextAttemptAt: 9, deadAt: 9, lastError: '400 23514: check' });
  });
});

describe('toRemoteRow', () => {
  it('stamps ownership at push time: user_id for data, id for the profile', () => {
    expect(toRemoteRow({ table: 'cravings', payload: { id: 'c1', strength: 5 } }, 'u1')).toEqual({
      id: 'c1',
      strength: 5,
      user_id: 'u1',
    });
    expect(toRemoteRow({ table: 'profiles', payload: { name: null } }, 'u1')).toEqual({
      name: null,
      id: 'u1',
    });
  });

  it('overrides any owner already in the snapshot', () => {
    expect(toRemoteRow({ table: 'slips', payload: { user_id: 'someone-else' } }, 'u1')).toEqual({
      user_id: 'u1',
    });
  });
});

describe('mergeEnqueue', () => {
  it('keeps one entry per row, holding the newest snapshot', () => {
    expect(
      mergeEnqueue(
        { op: 'upsert', payload: { strength: 3 } },
        { op: 'upsert', payload: { strength: 7 } },
      ),
    ).toEqual({ op: 'upsert', payload: { strength: 7 } });
  });

  it('lets a real profile write replace the empty first-sign-in insert', () => {
    expect(
      mergeEnqueue({ op: 'insert_ignore', payload: {} }, { op: 'upsert', payload: { name: 'x' } }),
    ).toEqual({ op: 'upsert', payload: { name: 'x' } });
  });

  it('never lets the empty insert overwrite a pending profile write', () => {
    expect(
      mergeEnqueue({ op: 'upsert', payload: { name: 'x' } }, { op: 'insert_ignore', payload: {} }),
    ).toEqual({ op: 'upsert', payload: { name: 'x' } });
  });
});
