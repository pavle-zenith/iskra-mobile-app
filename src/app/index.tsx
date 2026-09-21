import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getProfile } from '@/data/repo';
import { FoundationsScreen } from '@/features/foundations/FoundationsScreen';
import { resumeOnboardingTarget } from '@/features/onboarding/OnboardingProvider';
import type { StepId } from '@/lib/onboarding/steps';
import { color } from '@/theme';

/**
 * The gate. `profiles.onboarding_completed` decides whether someone is still being set up,
 * and an unfinished flow reopens on the step it was left on, answers intact.
 *
 * Both reads come from SQLite, so this never waits on the network.
 */
type Target =
  { kind: 'loading' } | { kind: 'onboarding'; splash: boolean; step: StepId } | { kind: 'home' };

export default function IndexRoute() {
  const [target, setTarget] = useState<Target>({ kind: 'loading' });

  useEffect(() => {
    let alive = true;
    void Promise.all([getProfile(), resumeOnboardingTarget()]).then(([profile, resume]) => {
      if (!alive) return;
      setTarget(
        profile?.onboardingCompleted
          ? { kind: 'home' }
          : { kind: 'onboarding', splash: resume.splash, step: resume.step },
      );
    });
    return () => {
      alive = false;
    };
  }, []);

  // Paper, not a spinner: the first frame is the app's own ground, whatever happens next.
  if (target.kind === 'loading') return <View style={{ flex: 1, backgroundColor: color.bg }} />;

  if (target.kind === 'onboarding') {
    return target.splash ? (
      <Redirect href="/onboarding" />
    ) : (
      <Redirect href={{ pathname: '/onboarding/[step]', params: { step: target.step } }} />
    );
  }

  return <FoundationsScreen />;
}
