import { Check } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Icon, Pressable, Text } from '@/components/primitives';
import { color, radius, space } from '@/theme';

/**
 * A checkbox whose whole label is the target, as on every consent screen in the references
 * (.impeccable/review/consent/REFERENCES.md). The screen-reader label is the visible text,
 * word for word, and the state is announced as checked or not.
 */
export function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      haptic="light"
      feedback="none"
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onToggle}
      style={styles.row}
    >
      <View style={[styles.box, checked ? styles.boxOn : styles.boxOff]}>
        {checked ? <Icon as={Check} size={18} color={color.onAccent} /> : null}
      </View>
      <Text variant="body" style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const BOX = 26;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  box: {
    width: BOX,
    height: BOX,
    borderRadius: radius.badge / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOff: { borderWidth: 2, borderColor: color.textMuted, backgroundColor: color.surface },
  boxOn: { backgroundColor: color.accent, borderWidth: 2, borderColor: color.accent },
  label: { flex: 1 },
});
