import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { QUIET_FROM_HOUR, QUIET_UNTIL_HOUR, type Clock } from '@/lib/notifications/plan';
import { color, minTarget, radius, space } from '@/theme';

import { profilCopy } from './copy';

/**
 * Picks a notification's time. Hours run from 08 to 21 only: nothing is ever sent between 22:00
 * and 08:00, so a time there could never arrive. Minutes move in quarters.
 */
const FIRST_HOUR = QUIET_UNTIL_HOUR;
const LAST_HOUR = QUIET_FROM_HOUR - 1;
const MINUTE_STEP = 15;

export function TimeSheet({
  visible,
  title,
  value,
  onSave,
  onClose,
}: {
  visible: boolean;
  title: string;
  value: Clock;
  onSave: (clock: Clock) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [clock, setClock] = useState(value);
  // The sheet opens on the time it is changing, whichever row that is.
  const [shown, setShown] = useState(visible);
  if (visible !== shown) {
    setShown(visible);
    if (visible) setClock(value);
  }

  const shiftHour = (by: number) =>
    setClock((current) => ({
      ...current,
      hour: Math.min(LAST_HOUR, Math.max(FIRST_HOUR, current.hour + by)),
    }));
  const shiftMinute = (by: number) =>
    setClock((current) => ({ ...current, minute: (current.minute + by + 60) % 60 }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel={title}
          onPress={onClose}
          feedback="none"
          style={styles.grow}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
          <Text variant="title" accessibilityRole="header">
            {title}
          </Text>
          <View style={styles.dial}>
            <Column
              value={String(clock.hour).padStart(2, '0')}
              onUp={() => shiftHour(1)}
              onDown={() => shiftHour(-1)}
            />
            <Text variant="display">:</Text>
            <Column
              value={String(clock.minute).padStart(2, '0')}
              onUp={() => shiftMinute(MINUTE_STEP)}
              onDown={() => shiftMinute(-MINUTE_STEP)}
            />
          </View>
          <Text variant="caption" color="textMuted" style={styles.centred}>
            {profilCopy.notifications.quiet}
          </Text>
          <Button label={profilCopy.save} onPress={() => onSave(clock)} />
        </View>
      </View>
    </Modal>
  );
}

function Column({ value, onUp, onDown }: { value: string; onUp: () => void; onDown: () => void }) {
  return (
    <View
      style={styles.column}
      accessible
      accessibilityRole="adjustable"
      accessibilityValue={{ text: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) =>
        event.nativeEvent.actionName === 'increment' ? onUp() : onDown()
      }
    >
      <Pressable onPress={onUp} haptic="light" style={styles.arrow} accessibilityElementsHidden>
        <Icon as={ChevronUp} size={28} color={color.textSoft} />
      </Pressable>
      <Text variant="display" style={styles.value}>
        {value}
      </Text>
      <Pressable onPress={onDown} haptic="light" style={styles.arrow} accessibilityElementsHidden>
        <Icon as={ChevronDown} size={28} color={color.textSoft} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: color.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    gap: space.md,
  },
  dial: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.md },
  column: { alignItems: 'center' },
  arrow: { width: minTarget, height: minTarget, alignItems: 'center', justifyContent: 'center' },
  value: { fontVariant: ['tabular-nums'] },
  centred: { textAlign: 'center' },
});
