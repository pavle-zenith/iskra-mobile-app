import { Redirect } from 'expo-router';

import { FoundationsScreen } from '@/features/foundations/FoundationsScreen';

/**
 * The M0 foundations specimen: the type ramp, the palette and the six tool cards on one
 * screen. It is not part of the product any more, only a reference, so it is reachable from
 * the dev harness and nowhere else.
 */
export default function FoundationsRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <FoundationsScreen />;
}
