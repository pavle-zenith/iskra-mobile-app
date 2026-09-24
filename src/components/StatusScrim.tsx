import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color } from '@/theme';

/**
 * A paper strip the height of the status bar, over a scrolling screen, so content scrolls under
 * it and never under the clock (DESIGN.md, scrolling chrome). Render it after the ScrollView.
 */
export function StatusScrim() {
  const insets = useSafeAreaInsets();
  return <View style={[styles.scrim, { height: insets.top }]} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: color.bg },
});
