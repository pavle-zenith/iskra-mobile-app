import { Redirect, useLocalSearchParams } from 'expo-router';

import { STEP_SCREENS } from '@/features/onboarding/screens';
import type { StepId } from '@/lib/onboarding/steps';

/** One route per step, so back is the platform's own gesture rather than a custom stack. */
export default function OnboardingStepRoute() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const Screen = STEP_SCREENS[step as StepId];
  if (!Screen) return <Redirect href="/onboarding" />;
  return <Screen />;
}
