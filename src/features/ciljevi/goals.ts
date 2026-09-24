import type { Href } from 'expo-router';
import {
  CalendarCheck,
  CigaretteOff,
  Clock,
  Coins,
  Flame,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react-native';

import type { MilestoneRow } from '@/data/repo';
import { GOAL_CATEGORIES, type Goal, type GoalCategory } from '@/lib/progress';

import type { GoalsState } from './data';

/** One Lucide glyph per category, at the app's stroke. */
export const GOAL_GLYPHS: Record<GoalCategory, LucideIcon> = {
  vreme: Clock,
  novac: Coins,
  cigarete: CigaretteOff,
  porivi: Flame,
  provere: CalendarCheck,
  zdravlje: HeartPulse,
};

/** Each category's CategoryScreen. Zdravlje is M4's screen; the rest share one route. */
export function categoryHref(category: GoalCategory): Href {
  return category === 'zdravlje'
    ? '/napredak/zdravlje'
    : { pathname: '/napredak/kategorija/[category]', params: { category } };
}

export function isGoalCategory(value: unknown): value is GoalCategory {
  return typeof value === 'string' && (GOAL_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Every goal with a `milestones` row, newest first. A row can outlive the goal list: after a
 * quit-date edit the yearly Vreme goals are trimmed, but a year once reached stays reached, so a
 * row the list no longer holds is rebuilt from its key.
 */
export function reachedGoals(state: Pick<GoalsState, 'goals' | 'milestones'>): Goal[] {
  const byKey = new Map(state.goals.map((goal) => [goal.key, goal]));
  return state.milestones
    .map((row) => byKey.get(row.key) ?? goalFromRow(row))
    .filter((goal): goal is Goal => goal !== null);
}

function goalFromRow(row: MilestoneRow): Goal | null {
  const dash = row.key.indexOf('-');
  const category = row.key.slice(0, dash);
  const rest = row.key.slice(dash + 1);
  if (!isGoalCategory(category)) return null;
  const threshold = Number(rest);
  return {
    key: row.key,
    category,
    threshold: Number.isFinite(threshold) ? threshold : 0,
    healthKey: category === 'zdravlje' ? rest : undefined,
    reached: true,
    crossedAt: new Date(row.unlocked_at),
    fraction: 1,
    left:
      category === 'vreme' || category === 'zdravlje'
        ? { kind: 'time', ms: 0 }
        : { kind: 'count', amount: 0 },
  };
}
