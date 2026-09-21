import { Stack } from 'expo-router';

import { OnboardingProvider } from '@/features/onboarding/OnboardingProvider';
import { color } from '@/theme';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.bg },
          // Each step is its own route, so the system back gesture walks the flow backwards.
          animation: 'slide_from_right',
        }}
      />
    </OnboardingProvider>
  );
}
