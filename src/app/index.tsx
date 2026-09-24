import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getProfile } from '@/data/repo';
import { HomeScreen } from '@/features/home/HomeScreen';
import { resumeOnboardingTarget } from '@/features/onboarding/OnboardingProvider';
import { resumableCraving } from '@/features/poriv/PorivSession';
import type { StepId } from '@/lib/onboarding/steps';
import { color } from '@/theme';

/**
 * The gate. `profiles.onboarding_completed` decides whether someone is still being set up,
 * and an unfinished flow reopens on the step it was left on, answers intact.
 *
 * A craving left open outranks both: killed mid-craving, the app comes back into Mode with
 * the timer still running. That check happens once per launch, so closing Mode with the X
 * returns here and stays here.
 *
 * Every read comes from SQLite, so this never waits on the network.
 */
type Target =
  | { kind: 'loading' }
  | { kind: 'onboarding'; splash: boolean; step: StepId }
  | { kind: 'poriv' }
  | { kind: 'home' };

/** Cold-start only: a resumed craving must not fight the X. */
let resumeChecked = false;

export default function IndexRoute() {
  const [target, setTarget] = useState<Target>({ kind: 'loading' });

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [profile, resume] = await Promise.all([getProfile(), resumeOnboardingTarget()]);
      if (!alive) return;

      // Consent outranks everything, even a finished onboarding: health data is stored only with
      // it, so anyone without it, including a tester from before it existed, sees the intro and
      // the consent screen first (docs/LEGAL-brief.md).
      if (!profile?.consentedAt) {
        setTarget({ kind: 'onboarding', splash: true, step: resume.step });
        return;
      }

      if (!profile.onboardingCompleted) {
        setTarget({ kind: 'onboarding', splash: resume.splash, step: resume.step });
        return;
      }

      if (!resumeChecked) {
        resumeChecked = true;
        const open = await resumableCraving();
        if (!alive) return;
        if (open) {
          setTarget({ kind: 'poriv' });
          return;
        }
      }

      setTarget({ kind: 'home' });
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Paper, not a spinner: the first frame is the app's own ground, whatever happens next.
  if (target.kind === 'loading') return <View style={{ flex: 1, backgroundColor: color.bg }} />;

  if (target.kind === 'poriv') return <Redirect href="/poriv" />;

  if (target.kind === 'onboarding') {
    return target.splash ? (
      <Redirect href="/onboarding" />
    ) : (
      <Redirect href={{ pathname: '/onboarding/[step]', params: { step: target.step } }} />
    );
  }

  return <HomeScreen />;
}
