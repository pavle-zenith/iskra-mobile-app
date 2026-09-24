import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { color, minTarget, space, toolColor } from '@/theme';
import type { ToolKey } from '@/lib/vocab';

import { mode } from './copy';

/**
 * The shell every Poriv tool sits in: paper, the tool's eyebrow in its own colour, a back
 * arrow to Mode, and one button that ends the tool and returns to Mode.
 *
 * The screen stays awake here too. Nothing interrupts a tool: no prompt, no toast, no banner.
 */
export function ToolShell({
  tool,
  eyebrow,
  children,
  done,
  onDone,
  disabled,
  contentStyle,
  background,
}: {
  tool: ToolKey;
  eyebrow: string;
  children: React.ReactNode;
  done: string;
  onDone?: () => void;
  disabled?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Drawn behind everything, full screen: the rising water of Pijem vodu. */
  background?: React.ReactNode;
}) {
  useKeepAwake();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tone = toolColor[tool].color;

  const back = () => {
    if (onDone) onDone();
    router.back();
  };

  return (
    <View style={styles.screen}>
      {background}
      <View style={{ paddingTop: insets.top + space.xs, paddingHorizontal: space.gutter }}>
        <View style={styles.topBar}>
          <Pressable
            onPress={back}
            accessibilityLabel={mode.eyebrow}
            hitSlop={space.xs}
            style={styles.back}
          >
            <Icon as={ChevronLeft} size={26} color={color.text} />
          </Pressable>
          <Text variant="caption" style={[styles.eyebrow, { color: tone }]}>
            {eyebrow}
          </Text>
          <View style={styles.back} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <Button label={done} disabled={disabled} onPress={back} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: {
    width: minTarget,
    height: minTarget,
    justifyContent: 'center',
    marginLeft: -space.sm,
  },
  eyebrow: { letterSpacing: 2 },
  content: {
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    paddingBottom: space.xl,
    gap: space.md,
    flexGrow: 1,
  },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
