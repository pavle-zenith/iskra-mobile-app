import { Redirect, useLocalSearchParams } from 'expo-router';

import { CategoryGoalsScreen } from '@/features/ciljevi/CategoryGoalsScreen';
import { isGoalCategory } from '@/features/ciljevi/goals';

/**
 * One category's goals on the export's CategoryScreen (docs/M5-brief.md, Export alignment 2),
 * opened from Home's category cards and the Napredak tab. Zdravlje has its own M4 screen.
 */
export default function CategoryRoute() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  if (category === 'zdravlje') return <Redirect href="/napredak/zdravlje" />;
  if (!isGoalCategory(category)) return <Redirect href="/napredak" />;
  return <CategoryGoalsScreen category={category} />;
}
