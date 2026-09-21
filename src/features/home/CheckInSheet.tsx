import { X } from 'lucide-react-native';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { color, minTarget, radius, space } from '@/theme';

import { home } from './copy';

/**
 * The daily check-in. One question, two answers.
 *
 * Closing it records NOTHING. The export says "if you close, we assume you're clean"; that is
 * a guess, and the app never guesses (PRODUCT.md). The day simply stays unanswered, and the
 * week card shows it as faint rather than as a miss.
 *
 * "Desila se cigareta" goes through the same slip path as Poriv mod: a `slips` row and the
 * absolution screen. Nothing resets.
 */
export function CheckInSheet({
  visible,
  onClean,
  onSlipped,
  onClose,
}: {
  visible: boolean;
  onClean: () => void;
  onSlipped: () => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Tapping away is the same as the X: it answers nothing. */}
        <Pressable
          accessibilityLabel={home.checkIn.question}
          onPress={onClose}
          feedback="none"
          style={styles.dismissArea}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
          <View style={styles.head}>
            <Text variant="title" style={styles.question}>
              {home.checkIn.question}
            </Text>
            <Pressable
              accessibilityLabel={home.checkIn.question}
              onPress={onClose}
              hitSlop={space.xs}
              style={styles.close}
            >
              <Icon as={X} size={22} color={color.textMuted} />
            </Pressable>
          </View>

          <Button label={home.checkIn.clean} haptic="medium" onPress={onClean} />
          <Button variant="secondary" label={home.checkIn.slipped} onPress={onSlipped} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(25, 21, 18, 0.45)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  sheet: {
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    gap: space.sm,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  question: { flex: 1 },
  close: {
    width: minTarget,
    height: minTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: -space.xs,
    marginRight: -space.sm,
  },
});
