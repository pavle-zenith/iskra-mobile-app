import { Stack } from 'expo-router';

import { PorivProvider } from '@/features/poriv/PorivSession';
import { color } from '@/theme';

/**
 * The craving stack. One provider holds the open row for Mode, the six tools and the two
 * outcome screens, so every write lands on the same craving.
 *
 * Gestures are off: nothing navigates away from a craving by accident.
 */
export default function PorivLayout() {
  return (
    <PorivProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: { backgroundColor: color.bg },
        }}
      />
    </PorivProvider>
  );
}
