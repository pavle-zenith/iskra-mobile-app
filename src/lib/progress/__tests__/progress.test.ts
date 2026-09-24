import {
  annualCost,
  computeProgress,
  equivalents,
  formatNumber,
  HEALTH_ITEMS,
  healthTimeline,
  nextMoneyThreshold,
  reachedAt,
  savingsSeries,
  timeGoals,
  timeLeft,
  type ProgressInput,
} from '..';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const QUIT = new Date('2026-09-01T08:00:00Z');

const input = (over: Partial<ProgressInput> = {}): ProgressInput => ({
  quitDate: QUIT,
  cigarettesPerDay: 20,
  packPriceRsd: 450,
  cigarettesPerPack: 20,
  slips: [],
  now: new Date(QUIT.getTime() + DAY),
  ...over,
});

describe('computeProgress', () => {
  it('counts a clean day: 20 cigarettes, one pack, 450 RSD, 2 hours', () => {
    const p = computeProgress(input());
    expect(p.smokeFreeDays).toBe(1);
    expect(p.cigarettesNotSmoked).toBe(20);
    expect(p.packsNotSmoked).toBe(1);
    expect(p.rsdSaved).toBe(450);
    expect(p.hoursReturned).toBe(2);
  });

  it('floors every figure and never rounds a saving up', () => {
    // 90 minutes at 20 a day is 1,25 cigarettes: 1 not smoked, 22,5 RSD shown as 22.
    const p = computeProgress(input({ now: new Date(QUIT.getTime() + 1.5 * HOUR) }));
    expect(p.cigarettesNotSmoked).toBe(1);
    expect(p.rsdSaved).toBe(22);
    expect(p.hoursReturned).toBe(0);
    expect(p.smokeFreeDays).toBe(0);
  });

  it('subtracts a slip as one cigarette until the slip flow records a count', () => {
    const slip = { createdAt: new Date(QUIT.getTime() + 2 * HOUR).toISOString() };
    const p = computeProgress(input({ slips: [slip] }));
    expect(p.slipCigarettes).toBe(1);
    expect(p.cigarettesNotSmoked).toBe(19);
    expect(p.rsdSaved).toBe(427);
  });

  it('subtracts the recorded count when a slip has one', () => {
    const at = new Date(QUIT.getTime() + 2 * HOUR).toISOString();
    const p = computeProgress(input({ slips: [{ createdAt: at, cigarettes: 4 }] }));
    expect(p.cigarettesNotSmoked).toBe(16);
  });

  it('never resets the smoke-free time on a slip', () => {
    const slip = { createdAt: new Date(QUIT.getTime() + 2 * HOUR).toISOString() };
    expect(computeProgress(input({ slips: [slip] })).smokeFreeMs).toBe(DAY);
  });

  it('ignores slips from before the quit date', () => {
    const before = { createdAt: new Date(QUIT.getTime() - DAY).toISOString() };
    expect(computeProgress(input({ slips: [before] })).cigarettesNotSmoked).toBe(20);
  });

  it('never goes below zero, however many slips', () => {
    const at = new Date(QUIT.getTime() + HOUR).toISOString();
    const p = computeProgress(input({ slips: [{ createdAt: at, cigarettes: 50 }] }));
    expect(p.cigarettesNotSmoked).toBe(0);
    expect(p.rsdSaved).toBe(0);
  });

  it('recomputes the whole history from the current habits', () => {
    const before = computeProgress(input());
    const after = computeProgress(input({ cigarettesPerDay: 10, packPriceRsd: 500 }));
    expect(before.rsdSaved).toBe(450);
    expect(after.cigarettesNotSmoked).toBe(10);
    expect(after.rsdSaved).toBe(250);
  });

  it('shows nothing gained before the quit date', () => {
    const p = computeProgress(input({ now: new Date(QUIT.getTime() - HOUR) }));
    expect(p.smokeFreeMs).toBe(0);
    expect(p.cigarettesNotSmoked).toBe(0);
    expect(p.rsdSaved).toBe(0);
  });

  it('projects from the daily cost, floored', () => {
    const p = computeProgress(input({ cigarettesPerDay: 15, packPriceRsd: 455 }));
    // 15 / 20 × 455 = 341,25 a day.
    expect(p.dailyCostRsd).toBe(341);
    expect(p.next7DaysRsd).toBe(2388);
    expect(p.next30DaysCigarettes).toBe(450);
    expect(p.nextYearCigarettes).toBe(5475);
    expect(p.next30DaysRsd).toBe(10237);
    expect(p.nextYearRsd).toBe(124556);
    expect(p.nextYearHours).toBe(547);
  });

  it('defaults to 20 a pack and survives a missing profile', () => {
    expect(computeProgress(input({ cigarettesPerPack: null })).packsNotSmoked).toBe(1);
    const empty = computeProgress({ ...input(), quitDate: null, cigarettesPerDay: null });
    expect(empty.rsdSaved).toBe(0);
    expect(empty.health).toEqual([]);
  });
});

describe('nextMoneyThreshold', () => {
  it('walks the fixed ladder, then every 250.000', () => {
    expect(nextMoneyThreshold(0)).toMatchObject({ target: 1000, from: 0, remaining: 1000 });
    expect(nextMoneyThreshold(999)).toMatchObject({ target: 1000, remaining: 1 });
    expect(nextMoneyThreshold(1000)).toMatchObject({ target: 5000, from: 1000, remaining: 4000 });
    expect(nextMoneyThreshold(3000).fraction).toBeCloseTo(0.5);
    expect(nextMoneyThreshold(100000)).toMatchObject({ target: 250000, from: 100000 });
    expect(nextMoneyThreshold(260000)).toMatchObject({ target: 500000, from: 250000 });
    expect(nextMoneyThreshold(500000)).toMatchObject({ target: 750000, from: 500000 });
  });
});

describe('the health timeline', () => {
  it('holds exactly the eleven sourced items: eight WHO, three NHS', () => {
    expect(HEALTH_ITEMS).toHaveLength(11);
    expect(HEALTH_ITEMS.filter((item) => item.source === 'WHO')).toHaveLength(8);
    expect(HEALTH_ITEMS.filter((item) => item.source === 'NHS').map((item) => item.at)).toEqual([
      '8 sati',
      '48 sati',
      '72 sata',
    ]);
  });

  it('has one current item: the first not yet reached', () => {
    const states = healthTimeline(QUIT, new Date(QUIT.getTime() + 3 * DAY + HOUR));
    expect(states.filter((s) => s.status === 'reached')).toHaveLength(5);
    expect(states.filter((s) => s.status === 'current').map((s) => s.key)).toEqual(['circulation']);
    expect(states[5]?.fraction).toBeGreaterThan(0);
    expect(states[5]?.fraction).toBeLessThan(1);
  });

  it('counts a range as reached at its start', () => {
    const twoWeeks = new Date(QUIT.getTime() + 14 * DAY);
    const circulation = healthTimeline(QUIT, twoWeeks).find((s) => s.key === 'circulation');
    expect(circulation?.status).toBe('reached');
    expect(circulation?.at).toBe('od 2 do 12 nedelja');
  });

  it('is all reached after fifteen years', () => {
    const later = new Date('2041-09-02T08:00:00Z');
    expect(healthTimeline(QUIT, later).every((s) => s.status === 'reached')).toBe(true);
  });

  it('steps months and years on the calendar, clamped to the month', () => {
    expect(reachedAt(new Date('2026-01-31T10:00:00Z'), { unit: 'months', value: 1 })).toEqual(
      new Date('2026-02-28T10:00:00Z'),
    );
    expect(reachedAt(new Date('2028-02-29T10:00:00Z'), { unit: 'years', value: 1 })).toEqual(
      new Date('2029-02-28T10:00:00Z'),
    );
  });
});

describe('timeLeft', () => {
  it('uses hours under two days, days under eight weeks, months under two years, then years', () => {
    expect(timeLeft(10 * 60_000)).toEqual({ value: 1, unit: 'hours' });
    expect(timeLeft(5.2 * HOUR)).toEqual({ value: 6, unit: 'hours' });
    expect(timeLeft(47 * HOUR)).toEqual({ value: 47, unit: 'hours' });
    expect(timeLeft(3.5 * DAY)).toEqual({ value: 4, unit: 'days' });
    expect(timeLeft(60 * DAY)).toEqual({ value: 2, unit: 'months' });
    expect(timeLeft(400 * DAY)).toEqual({ value: 14, unit: 'months' });
    expect(timeLeft(9.9 * 365.25 * DAY)).toEqual({ value: 10, unit: 'years' });
  });
});

describe('the calc port', () => {
  it('floors the annual cost', () => {
    expect(annualCost(15, 455)).toBe(124556);
  });

  it('groups with a dot', () => {
    expect(formatNumber(164250)).toBe('164.250');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1234.9)).toBe('1.234');
  });

  it('gives three equivalents at different scales, as on the site', () => {
    expect(equivalents(164250).map((e) => `${e.count} ${e.label}`)).toEqual([
      '1 letovanje za dvoje',
      '3 meseca kirije',
      '657 kafa',
    ]);
  });
});

describe('savingsSeries', () => {
  it('is a straight line from zero to now with no slips', () => {
    const series = savingsSeries(input({ now: new Date(QUIT.getTime() + 10 * DAY) }));
    expect(series).toEqual([
      { atMs: 0, rsd: 0 },
      { atMs: 10 * DAY, rsd: 4500 },
    ]);
  });

  it('steps down on each slip, at the moment of the slip, and ends on the hero figure', () => {
    const slipAt = new Date(QUIT.getTime() + 5 * DAY);
    const now = new Date(QUIT.getTime() + 10 * DAY);
    const slips = [{ createdAt: slipAt.toISOString(), cigarettes: 20 }];
    const series = savingsSeries(input({ now, slips }));
    expect(series).toEqual([
      { atMs: 0, rsd: 0 },
      { atMs: 5 * DAY, rsd: 2250 },
      { atMs: 5 * DAY, rsd: 1800 },
      { atMs: 10 * DAY, rsd: 4050 },
    ]);
    expect(series[series.length - 1]?.rsd).toBe(computeProgress(input({ now, slips })).rsdSaved);
  });

  it('is empty before the quit date', () => {
    expect(savingsSeries(input({ now: new Date(QUIT.getTime() - HOUR) }))).toEqual([]);
  });
});

describe('timeGoals', () => {
  it('lists the fixed goals, reached or ahead', () => {
    const goals = timeGoals(QUIT, new Date(QUIT.getTime() + 3.5 * DAY));
    expect(goals.map((g) => g.days)).toEqual([1, 3, 7, 14, 30, 60, 90, 182, 365]);
    expect(goals.filter((g) => g.status === 'reached').map((g) => g.days)).toEqual([1, 3]);
    expect(goals[2]?.msLeft).toBe(3.5 * DAY);
  });

  it('adds one yearly goal at a time once a year has passed', () => {
    const goals = timeGoals(QUIT, new Date(QUIT.getTime() + 400 * DAY));
    expect(goals.slice(-2).map((g) => [g.days, g.status])).toEqual([
      [365, 'reached'],
      [730, 'upcoming'],
    ]);
  });
});
