import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { CategoryDetail, type TimelineRow } from '@/features/napredak/CategoryDetail';
import { DetailScreen } from '@/features/napredak/components';
import { formatDateTime } from '@/lib/i18n/date';
import { nextInCategory, type GoalCategory } from '@/lib/progress';
import { goalColor } from '@/theme';

import { ciljevi, goalLeft, goalTitle } from './copy';
import { syncGoals, type GoalsState } from './data';
import { GOAL_GLYPHS } from './goals';

/**
 * A category's goals on the CategoryScreen template: the next goal in the pill, "[n] / [m]
 * dostignuto", then every goal on the rail, reached ones with the date they were crossed.
 */
export function CategoryGoalsScreen({ category }: { category: GoalCategory }) {
  const [state, setState] = useState<GoalsState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void syncGoals().then((next) => {
        if (alive) setState(next);
      });
      return () => {
        alive = false;
      };
    }, []),
  );

  if (!state) return <DetailScreen>{null}</DetailScreen>;

  const tone = goalColor[category];
  const goals = state.goals.filter((goal) => goal.category === category);
  const unlocked = new Map(state.milestones.map((row) => [row.key, row.unlocked_at]));
  const current = nextInCategory(goals, category);

  const rows: TimelineRow[] = goals.map((goal) => {
    const at = unlocked.get(goal.key);
    return {
      key: goal.key,
      status: goal.reached ? 'reached' : goal.key === current?.key ? 'current' : 'upcoming',
      label: goalTitle(goal),
      reachedOn: at ? formatDateTime(new Date(at)) : undefined,
      fraction: goal.fraction,
      left: goalLeft(goal),
    };
  });

  return (
    <CategoryDetail
      title={ciljevi.categories[category]}
      icon={GOAL_GLYPHS[category]}
      tone={tone.solid}
      deep={tone.text}
      next={current ? goalLeft(current) : undefined}
      rows={rows}
    />
  );
}
