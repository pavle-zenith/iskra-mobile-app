import type { CravingRow } from '@/data/repo';

import {
  CRAVING_TOTAL_MS,
  durationSeconds,
  elapsedMs,
  findResumable,
  remainingLabel,
  RESUME_WINDOW_MS,
  ringProgress,
  survivedOn,
} from '../session';

const at = (iso: string, over: Partial<CravingRow> = {}): CravingRow => ({
  id: iso,
  strength: null,
  trigger: null,
  tool_used: null,
  duration_seconds: null,
  outcome: null,
  created_at: iso,
  ...over,
});

const NOW = new Date('2026-10-05T12:00:00.000Z');

describe('findResumable', () => {
  it('reopens a craving left open minutes ago', () => {
    const row = at('2026-10-05T11:56:00.000Z');
    expect(findResumable([row], NOW)).toEqual({ id: row.id, createdAt: row.created_at });
  });

  it('ignores one older than the resume window, leaving it honestly unfinished', () => {
    const stale = at(new Date(NOW.getTime() - RESUME_WINDOW_MS - 1000).toISOString());
    expect(findResumable([stale], NOW)).toBeNull();
  });

  it('ignores a craving that already has an outcome', () => {
    const done = at('2026-10-05T11:58:00.000Z', { outcome: 'survived' });
    expect(findResumable([done], NOW)).toBeNull();
  });

  it('does not reopen the one the person closed with the X', () => {
    const row = at('2026-10-05T11:58:00.000Z');
    expect(findResumable([row], NOW, row.id)).toBeNull();
  });

  it('takes the first open row, which listCravings orders newest first', () => {
    const newer = at('2026-10-05T11:59:00.000Z');
    const older = at('2026-10-05T11:50:00.000Z');
    expect(findResumable([newer, older], NOW)?.id).toBe(newer.id);
  });

  it('survives a row with an unparseable timestamp', () => {
    expect(findResumable([at('not a date')], NOW)).toBeNull();
  });
});

describe('the clock', () => {
  const started = '2026-10-05T11:58:30.000Z';

  it('counts wall clock, so backgrounding does not pause the craving', () => {
    expect(elapsedMs(started, NOW)).toBe(90_000);
    expect(durationSeconds(started, NOW)).toBe(90);
  });

  it('never goes negative when the clock moves backwards', () => {
    expect(elapsedMs('2026-10-05T12:05:00.000Z', NOW)).toBe(0);
  });

  it('fills the ring once and holds it there past five minutes', () => {
    expect(ringProgress(started, NOW)).toBeCloseTo(0.3, 5);
    const late = new Date(Date.parse(started) + CRAVING_TOTAL_MS * 2);
    expect(ringProgress(started, late)).toBe(1);
  });

  it('counts the label down and floors it at zero', () => {
    expect(remainingLabel(started, NOW)).toBe('3:30');
    expect(remainingLabel(started, new Date(Date.parse(started)))).toBe('5:00');
    const late = new Date(Date.parse(started) + CRAVING_TOTAL_MS + 60_000);
    expect(remainingLabel(started, late)).toBe('0:00');
  });
});

describe('survivedOn', () => {
  it('counts only survived cravings, and only on that day', () => {
    const rows = [
      at('2026-10-05T09:00:00.000Z', { outcome: 'survived' }),
      at('2026-10-05T10:00:00.000Z', { outcome: 'survived' }),
      at('2026-10-05T11:00:00.000Z', { outcome: 'slipped' }),
      at('2026-10-05T11:30:00.000Z'),
      at('2026-10-04T09:00:00.000Z', { outcome: 'survived' }),
    ];
    expect(survivedOn(rows, NOW, 'Europe/Belgrade')).toBe(2);
  });

  it('is zero when nothing happened', () => {
    expect(survivedOn([], NOW, 'Europe/Belgrade')).toBe(0);
  });

  it('counts the day in the anchor zone, not the device one', () => {
    // 23:30 UTC on the 4th is already the 5th in Belgrade. Someone who travels must not see
    // Success say "Danas" about a different day than the one Home is counting.
    const lateNight = [at('2026-10-04T23:30:00.000Z', { outcome: 'survived' })];
    expect(survivedOn(lateNight, NOW, 'Europe/Belgrade')).toBe(1);
    expect(survivedOn(lateNight, NOW, 'UTC')).toBe(0);
  });

  it('ignores a row whose timestamp will not parse', () => {
    expect(survivedOn([at('not a date', { outcome: 'survived' })], NOW, 'UTC')).toBe(0);
  });
});
