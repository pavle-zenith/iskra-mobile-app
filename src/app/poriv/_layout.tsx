import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { setPorivOpen } from '@/features/notifications/scheduler';
import { PorivProvider } from '@/features/poriv/PorivSession';
import { color } from '@/theme';

/**
 * The craving stack. One provider holds the open row for Mode, the six tools and the two
 * outcome screens, so every write lands on the same craving.
 *
 * Gestures are off: nothing navigates away from a craving by accident.
 */
export default function PorivLayout() {
  // Nothing interrupts a craving: no notification is presented while this stack is open.
  useEffect(() => {
    setPorivOpen(true);
    return () => setPorivOpen(false);
  }, []);

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
