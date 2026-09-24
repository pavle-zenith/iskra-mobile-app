import type { Progress } from './progress';
import { TIME_GOAL_DAYS } from './progress';

/**
 * Ciljevi: Iskra's goals, six categories, every threshold computed from the progress engine
 * (docs/M5-brief.md Task 1). Unsourced export items (trees saved, nicotine receptors, lung
 * function 30%, skin) are not here.
 *
 * Pure: it says which goals are reached now and how far the others are. Writing a reached goal
 * to `milestones` is the caller's job, and a written row is history: a later slip or quit-date
 * edit never un-reaches it (`mergeHistory`).
 */

export type GoalCategory = 'vreme' | 'novac' | 'cigarete' | 'porivi' | 'provere' | 'zdravlje';

export const GOAL_CATEGORIES: readonly GoalCategory[] = [
  'vreme',
  'novac',
  'cigarete',
  'porivi',
  'provere',
  'zdravlje',
];

/** 1.000 to 250.000 RSD, the M5 set. */
export const MONEY_GOALS = [1000, 5000, 10000, 25000, 50000, 100000, 250000] as const;
export const CIGARETTE_GOALS = [100, 500, 1000, 5000, 10000] as const;
/** Cravings survived. */
export const CRAVING_GOALS = [1, 10, 25, 50, 100] as const;
/** Clean check-ins. */
export const CHECKIN_GOALS = [7, 30, 100] as const;

const MS_PER_DAY = 86_400_000;

/** What is still to go: time for Vreme and Zdravlje, an amount for the others. */
export type GoalLeft =
  | { kind: 'time'; ms: number }
  | { kind: 'rsd'; amount: number }
  | { kind: 'count'; amount: number };

export type Goal = {
  /** Stable, and the `milestones.key`: "vreme-7", "novac-5000", "zdravlje-pulse". */
  key: string;
  category: GoalCategory;
  /** Days, RSD, a count, or for Zdravlje the item's place in the list. */
  threshold: number;
  /** For Zdravlje, the health item's key. */
  healthKey?: string;
  reached: boolean;
  /**
   * When it was crossed, where that can be computed: Vreme and Zdravlje are the quit date plus
   * the threshold. Null for the others; their row takes the moment it is first seen.
   */
  crossedAt: Date | null;
  /** 0 to 1 from the previous goal in the category (or zero) to this one. */
  fraction: number;
  left: GoalLeft;
};

export type GoalInput = {
  progress: Progress;
  quitDate: Date | null;
  now: Date;
  cravingsSurvived: number;
  cleanCheckins: number;
};

function ladder<T extends number>(
  category: GoalCategory,
  thresholds: readonly T[],
  value: number,
  kind: 'rsd' | 'count',
): Goal[] {
  return thresholds.map((threshold, index) => {
    const from = index > 0 ? (thresholds[index - 1] ?? 0) : 0;
    const reached = value >= threshold;
    return {
      key: `${category}-${threshold}`,
      category,
      threshold,
      reached,
      crossedAt: null,
      fraction: reached ? 1 : Math.min(1, Math.max(0, (value - from) / (threshold - from))),
      left: { kind, amount: reached ? 0 : threshold - Math.floor(value) },
    };
  });
}

function timeGoalsFrom(quitDate: Date | null, smokeFreeMs: number): Goal[] {
  const days: number[] = [...TIME_GOAL_DAYS];
  // Then yearly: every further year up to and including the first not yet reached.
  for (let years = 2; days[days.length - 1]! * MS_PER_DAY <= smokeFreeMs; years += 1) {
    days.push(years * 365);
  }
  return days.map((threshold, index) => {
    const at = threshold * MS_PER_DAY;
    const from = index > 0 ? (days[index - 1] ?? 0) * MS_PER_DAY : 0;
    const reached = quitDate !== null && smokeFreeMs >= at;
    return {
      key: `vreme-${threshold}`,
      category: 'vreme' as const,
      threshold,
      reached,
      crossedAt: quitDate ? new Date(quitDate.getTime() + at) : null,
      fraction: reached ? 1 : Math.min(1, Math.max(0, (smokeFreeMs - from) / (at - from))),
      left: { kind: 'time' as const, ms: Math.max(0, at - smokeFreeMs) },
    };
  });
}

/** Every goal in every category, in each category's order. */
export function evaluateGoals(input: GoalInput): Goal[] {
  const { progress, quitDate } = input;
  const health: Goal[] = progress.health.map((item, index) => ({
    key: `zdravlje-${item.key}`,
    category: 'zdravlje',
    threshold: index,
    healthKey: item.key,
    reached: item.status === 'reached',
    crossedAt: item.reachedAt,
    fraction: item.status === 'reached' ? 1 : item.fraction,
    left: { kind: 'time', ms: item.msLeft },
  }));

  return [
    ...timeGoalsFrom(quitDate, progress.smokeFreeMs),
    ...ladder('novac', MONEY_GOALS, progress.rsdSaved, 'rsd'),
    ...ladder('cigarete', CIGARETTE_GOALS, progress.cigarettesNotSmoked, 'count'),
    ...ladder('porivi', CRAVING_GOALS, input.cravingsSurvived, 'count'),
    ...ladder('provere', CHECKIN_GOALS, input.cleanCheckins, 'count'),
    ...health,
  ];
}

/**
 * A goal with a `milestones` row stays reached, whatever the numbers say now: rows are history,
 * and a slip never locks anything again (docs/M5-brief.md, Unlocking).
 */
export function mergeHistory(goals: readonly Goal[], unlockedKeys: ReadonlySet<string>): Goal[] {
  return goals.map((goal) =>
    unlockedKeys.has(goal.key) && !goal.reached
      ? { ...goal, reached: true, fraction: 1, left: zeroLeft(goal.left) }
      : goal,
  );
}

function zeroLeft(left: GoalLeft): GoalLeft {
  return left.kind === 'time' ? { kind: 'time', ms: 0 } : { ...left, amount: 0 };
}

/** Goals reached by the numbers that have no row yet: the ones to write now. */
export function newlyReached(goals: readonly Goal[], unlockedKeys: ReadonlySet<string>): Goal[] {
  return goals.filter((goal) => goal.reached && !unlockedKeys.has(goal.key));
}

/** The next goal in each category: the first one not reached. */
export function nextInCategory(goals: readonly Goal[], category: GoalCategory): Goal | null {
  return goals.find((goal) => goal.category === category && !goal.reached) ?? null;
}

/**
 * The nearest goals across categories, soonest first. Time goals are ordered by time left;
 * the others have no clock, so they are ordered by how far along they are.
 */
export function nearestGoals(goals: readonly Goal[], limit: number): Goal[] {
  const next = GOAL_CATEGORIES.map((category) => nextInCategory(goals, category)).filter(
    (goal): goal is Goal => goal !== null,
  );
  return next.sort((a, b) => b.fraction - a.fraction).slice(0, limit);
}

/**
 * Roughly when a goal will be reached at today's pace, in milliseconds from now: exact for Vreme
 * and Zdravlje, a projection from the current habit for Novac and Cigarete. Porivi and Provere
 * depend on what the person does, so they have no clock and return null. Used to order the
 * roadmap, never shown as a promise.
 */
export function goalEta(goal: Goal, progress: Progress): number | null {
  if (goal.reached) return 0;
  const { left } = goal;
  if (left.kind === 'time') return left.ms;
  if (goal.category === 'novac' && progress.dailyCostRsd > 0) {
    return (left.amount / progress.dailyCostRsd) * MS_PER_DAY;
  }
  const perDay = progress.nextYearCigarettes / 365;
  if (goal.category === 'cigarete' && perDay > 0) return (left.amount / perDay) * MS_PER_DAY;
  return null;
}

/**
 * Every goal not yet reached, soonest first: those with a clock by it, then the rest by how far
 * along they are.
 */
export function upcomingInOrder(goals: readonly Goal[], progress: Progress): Goal[] {
  const ahead = goals.filter((goal) => !goal.reached);
  const timed = ahead
    .map((goal) => ({ goal, eta: goalEta(goal, progress) }))
    .filter((entry): entry is { goal: Goal; eta: number } => entry.eta !== null)
    .sort((a, b) => a.eta - b.eta)
    .map((entry) => entry.goal);
  const untimed = ahead
    .filter((goal) => goalEta(goal, progress) === null)
    .sort((a, b) => b.fraction - a.fraction);
  return [...timed, ...untimed];
}
