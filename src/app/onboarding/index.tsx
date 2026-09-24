import { useLocalSearchParams } from 'expo-router';

import { WelcomeIntro } from '@/features/onboarding/WelcomeIntro';

/**
 * The start of onboarding: the three-beat welcome intro, then consent, then step 1
 * (docs/WELCOME-brief.md, docs/LEGAL-brief.md). Uncounted; the seventeen steps do not change.
 *
 * Dev builds accept `iskra://onboarding?beat=2` to open on a given beat, because a simulator
 * cannot be swiped from a shell. Release builds always start on beat 1.
 */
export default function OnboardingStart() {
  const { beat } = useLocalSearchParams<{ beat?: string }>();
  const initialBeat = __DEV__ ? Number(beat) || 0 : 0;
  return <WelcomeIntro key={initialBeat} initialBeat={initialBeat} />;
}
