import { smokeFreeMs } from '@/lib/time/dayCount';

import { CIGS_PER_PACK, dailyCost, MINUTES_PER_CIG } from './calc';
import { HEALTH_ITEMS, reachedAt, type HealthItem } from './health';

/**
 * The progress engine (docs/M4-brief.md Task 0). Home, Napredak and, from M5, notifications read
 * every figure from here; nothing on screen computes its own numbers.
 *
 * Every figure is floored. A saving is never rounded up (PRODUCT.md: never invent a number).
 *
 * It computes from the profile's current habits each time, so changing cigarettes per day or the
 * pack price in Profil (M5) recomputes the whole history from the new values. There is no stored
 * running total to drift.
 */

const MS_PER_DAY = 86_400_000;
const MS_PER_HOUR = 3_600_000;

export type ProgressSlip = {
  createdAt: string;
  /**
   * Cigarettes smoked in this slip. The M5 slip flow adds the count; until then a slip counts
   * as one cigarette.
   */
  cigarettes?: number | null;
};

export type ProgressInput = {
  quitDate: Date | null;
  cigarettesPerDay: number | null;
  packPriceRsd: number | null;
  /** `profiles.cigarettes_per_pack`, 20 when unset. */
  cigarettesPerPack?: number | null;
  slips: readonly ProgressSlip[];
  now: Date;
};

export type MoneyThreshold = {
  /** The target, in RSD. */
  target: number;
  /** Where this stretch started: the previous target, or 0. */
  from: number;
  /** RSD still to go, never below 1 while the target is ahead. */
  remaining: number;
  /** 0 to 1 along this stretch. */
  fraction: number;
};

export type HealthState = HealthItem & {
  reachedAt: Date;
  status: 'reached' | 'current' | 'upcoming';
  /** For the current item: 0 to 1 from the previous item (or the quit moment) to this one. */
  fraction: number;
  /** Milliseconds until it is reached, 0 once it has been. */
  msLeft: number;
};

export type Progress = {
  /** Total smoke-free time. Slips never reset it. */
  smokeFreeMs: number;
  /** Whole days of it, the same figure as the day column of Home's timer. */
  smokeFreeDays: number;
  /** Cigarettes that would have been smoked, minus those smoked in slips. Never negative. */
  cigarettesNotSmoked: number;
  /** Cigarettes counted against the total, from slips since the quit date. */
  slipCigarettes: number;
  packsNotSmoked: number;
  rsdSaved: number;
  /** `cigarettesNotSmoked` × 6 minutes, in whole hours. */
  hoursReturned: number;
  /**
   * "Ako nastaviš": what the current habit would cost or burn from here on. A month is 30 days
   * and a year 365, so a reader can check them in their head, as on the site.
   */
  dailyCostRsd: number;
  next7DaysRsd: number;
  next30DaysRsd: number;
  nextYearRsd: number;
  next30DaysCigarettes: number;
  nextYearCigarettes: number;
  nextYearHours: number;
  nextMoneyThreshold: MoneyThreshold;
  health: HealthState[];
};

/** 1.000 to 250.000 RSD, then every 250.000 after that. */
export const MONEY_THRESHOLDS = [1000, 5000, 10000, 25000, 50000, 100000, 250000] as const;
const THRESHOLD_STEP_AFTER = 250_000;

export function nextMoneyThreshold(saved: number): MoneyThreshold {
  const amount = Math.max(0, Math.floor(saved));
  let from = 0;
  let target: number | undefined = MONEY_THRESHOLDS.find((value) => value > amount);
  if (target === undefined) {
    from = Math.floor(amount / THRESHOLD_STEP_AFTER) * THRESHOLD_STEP_AFTER;
    target = from + THRESHOLD_STEP_AFTER;
  } else {
    const index = MONEY_THRESHOLDS.indexOf(target as (typeof MONEY_THRESHOLDS)[number]);
    from = index > 0 ? (MONEY_THRESHOLDS[index - 1] ?? 0) : 0;
  }
  return {
    target,
    from,
    remaining: target - amount,
    fraction: Math.min(1, Math.max(0, (amount - from) / (target - from))),
  };
}

/** Slips before the quit date were not slips from this attempt; they count for nothing here. */
function slipCigarettesSince(slips: readonly ProgressSlip[], quitDate: Date): number {
  let total = 0;
  for (const slip of slips) {
    const at = new Date(slip.createdAt).getTime();
    if (Number.isNaN(at) || at < quitDate.getTime()) continue;
    const count = slip.cigarettes;
    total +=
      typeof count === 'number' && Number.isFinite(count) && count > 0 ? Math.floor(count) : 1;
  }
  return total;
}

export function healthTimeline(quitDate: Date | null, now: Date): HealthState[] {
  if (!quitDate || Number.isNaN(quitDate.getTime())) return [];
  let previous = quitDate.getTime();
  let currentFound = false;

  return HEALTH_ITEMS.map((item) => {
    const at = reachedAt(quitDate, item.offset);
    const msLeft = Math.max(0, at.getTime() - now.getTime());
    let status: HealthState['status'];
    let fraction = 0;
    if (msLeft === 0) {
      status = 'reached';
      fraction = 1;
    } else if (!currentFound) {
      currentFound = true;
      status = 'current';
      const span = at.getTime() - previous;
      fraction = span > 0 ? Math.min(1, Math.max(0, (now.getTime() - previous) / span)) : 0;
    } else {
      status = 'upcoming';
    }
    previous = at.getTime();
    return { ...item, reachedAt: at, status, fraction, msLeft };
  });
}

export function computeProgress(input: ProgressInput): Progress {
  const { quitDate, now } = input;
  const perDay = Math.max(0, input.cigarettesPerDay ?? 0);
  const price = Math.max(0, input.packPriceRsd ?? 0);
  const perPack = Math.max(1, input.cigarettesPerPack ?? CIGS_PER_PACK);

  const valid = quitDate !== null && !Number.isNaN(quitDate.getTime());
  const elapsed = valid ? smokeFreeMs(quitDate, now) : 0;
  const slipCigarettes = valid ? slipCigarettesSince(input.slips, quitDate) : 0;

  // Elapsed time, not calendar days: three hours after the last cigarette, someone who smoked 20
  // a day has already not smoked two, and the figure says so.
  const wouldHaveSmoked = Math.floor((elapsed / MS_PER_DAY) * perDay);
  const cigarettesNotSmoked = Math.max(0, wouldHaveSmoked - slipCigarettes);
  const rsdSaved = Math.max(0, Math.floor((cigarettesNotSmoked * price) / perPack));
  const daily = dailyCost(perDay, price, perPack);

  return {
    smokeFreeMs: elapsed,
    smokeFreeDays: Math.floor(elapsed / MS_PER_DAY),
    cigarettesNotSmoked,
    slipCigarettes,
    packsNotSmoked: Math.floor(cigarettesNotSmoked / perPack),
    rsdSaved,
    hoursReturned: Math.floor((cigarettesNotSmoked * MINUTES_PER_CIG * 60_000) / MS_PER_HOUR),
    dailyCostRsd: Math.floor(daily),
    next7DaysRsd: Math.floor(daily * 7),
    next30DaysRsd: Math.floor(daily * 30),
    nextYearRsd: Math.floor(daily * 365),
    next30DaysCigarettes: Math.floor(perDay * 30),
    nextYearCigarettes: Math.floor(perDay * 365),
    nextYearHours: Math.floor((perDay * MINUTES_PER_CIG * 365) / 60),
    nextMoneyThreshold: nextMoneyThreshold(rsdSaved),
    health: healthTimeline(valid ? quitDate : null, now),
  };
}

/**
 * "za [n] [vreme]": how long until an item, in the unit the brief sets. Hours under two days,
 * days under eight weeks, months under two years, then years.
 *
 * Hours, days and months round up, so an item is never promised sooner than it arrives. Years
 * round to the nearest, because rounding 2,1 years up to 3 would say more than a year too much.
 */
export type TimeLeft = { value: number; unit: 'hours' | 'days' | 'months' | 'years' };

const MS_PER_MONTH = (365.25 / 12) * MS_PER_DAY;
const MS_PER_YEAR = 365.25 * MS_PER_DAY;

export function timeLeft(ms: number): TimeLeft {
  const left = Math.max(0, ms);
  if (left < 2 * MS_PER_DAY)
    return { value: Math.max(1, Math.ceil(left / MS_PER_HOUR)), unit: 'hours' };
  if (left < 56 * MS_PER_DAY) return { value: Math.ceil(left / MS_PER_DAY), unit: 'days' };
  if (left < 2 * MS_PER_YEAR) return { value: Math.ceil(left / MS_PER_MONTH), unit: 'months' };
  return { value: Math.round(left / MS_PER_YEAR), unit: 'years' };
}

// --- the savings chart -------------------------------------------------------

export type SeriesPoint = {
  /** Milliseconds since the quit moment. */
  atMs: number;
  rsd: number;
};

/**
 * "Rast ušteđevine" (docs/M4-brief.md Task 1): what was saved at each moment since the quit date.
 * The truth is a straight line that steps down on each slip, so the series is exactly that: its
 * start, the value just before and just after each slip, and now. Drawn point to point, with no
 * smoothing, it is the real curve; the export's wave was decoration.
 */
export function savingsSeries(input: ProgressInput): SeriesPoint[] {
  const { quitDate, now } = input;
  if (!quitDate || Number.isNaN(quitDate.getTime()) || now.getTime() <= quitDate.getTime()) {
    return [];
  }
  const start = quitDate.getTime();
  const at = (instant: number, slips: readonly ProgressSlip[]) =>
    computeProgress({ ...input, slips, now: new Date(instant) }).rsdSaved;

  const slips = input.slips
    .filter((slip) => {
      const time = new Date(slip.createdAt).getTime();
      return !Number.isNaN(time) && time >= start && time <= now.getTime();
    })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const points: SeriesPoint[] = [{ atMs: 0, rsd: 0 }];
  slips.forEach((slip, index) => {
    const time = new Date(slip.createdAt).getTime();
    points.push({ atMs: time - start, rsd: at(time, slips.slice(0, index)) });
    points.push({ atMs: time - start, rsd: at(time, slips.slice(0, index + 1)) });
  });
  points.push({ atMs: now.getTime() - start, rsd: at(now.getTime(), slips) });
  return points;
}

// --- time goals ----------------------------------------------------------------

/**
 * Iskra's own time thresholds (docs/M5-brief.md, Ciljevi, Vreme category): 1, 3, 7, 14, 30, 60,
 * 90, 182 and 365 days, then every further year. Tvoje vreme shows them as a timeline in M4.
 */
export const TIME_GOAL_DAYS = [1, 3, 7, 14, 30, 60, 90, 182, 365] as const;

export type TimeGoal = {
  days: number;
  status: 'reached' | 'upcoming';
  msLeft: number;
};

/** Every fixed goal, then yearly ones up to and including the first not yet reached. */
export function timeGoals(quitDate: Date | null, now: Date): TimeGoal[] {
  if (!quitDate || Number.isNaN(quitDate.getTime())) return [];
  const elapsed = smokeFreeMs(quitDate, now);
  const goal = (days: number): TimeGoal => {
    const msLeft = Math.max(0, days * MS_PER_DAY - elapsed);
    return { days, status: msLeft === 0 ? 'reached' : 'upcoming', msLeft };
  };

  const goals = TIME_GOAL_DAYS.map(goal);
  for (let years = 2; goals[goals.length - 1]?.status === 'reached'; years += 1) {
    goals.push(goal(years * 365));
  }
  return goals;
}
