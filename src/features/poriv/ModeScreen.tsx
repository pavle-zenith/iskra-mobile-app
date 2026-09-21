import { useKeepAwake } from 'expo-keep-awake';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { color, minTarget, space } from '@/theme';

import { Ring, ToolTile } from './components';
import { mode } from './copy';
import { usePorivSession } from './PorivSession';
import { remainingLabel, ringProgress } from './session';
import { porivTools } from './tools';

/**
 * Poriv mod. Ember above, paper below, as the direction contract sets out; the export's dark
 * takeover is not used.
 *
 * Nothing interrupts this screen. No prompt, toast, sync banner or navigation while it or a
 * tool is open, and the display stays awake for the whole craving (PRODUCT.md, "What the app
 * must never do"). There is no entry screen asking strength and trigger first: that is the
 * thirty seconds of navigation the craving has already outlasted.
 */
export function ModeScreen() {
  useKeepAwake();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { craving, finish, dismiss } = usePorivSession();
  const [now, setNow] = useState(() => new Date());

  // Wall clock, so a backgrounded craving keeps running. One tick a second is enough.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const createdAt = craving?.created_at ?? null;
  const progress = createdAt ? ringProgress(createdAt, now) : 0;
  const label = createdAt ? remainingLabel(createdAt, now) : '5:00';
  const done = progress >= 1;
  const noted = !!craving && (craving.trigger !== null || craving.strength !== null);

  const close = async () => {
    // Leaves `outcome` null: the craving happened, we do not know how it ended.
    await dismiss();
    router.replace('/');
  };

  const end = async (outcome: 'survived' | 'slipped') => {
    await finish(outcome);
    router.replace(outcome === 'survived' ? '/poriv/success' : '/poriv/slip');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.field, { paddingTop: insets.top + space.xs }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => void close()}
            accessibilityLabel={mode.close}
            hitSlop={space.xs}
            style={styles.close}
          >
            <Icon as={X} size={24} color={color.onField} />
          </Pressable>
          <Text variant="caption" style={styles.eyebrow}>
            {mode.eyebrow}
          </Text>
          <View style={styles.close} />
        </View>

        <View style={styles.ringArea}>
          <Ring progress={progress} label={label} caption={mode.minutes} />
          <Text variant="bodyLarge" style={styles.hint}>
            {done ? mode.elapsed : mode.breathingHint}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.paper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolsHeader}>
          <Text variant="caption" color="textMuted" style={styles.toolsTitle}>
            {mode.toolsTitle}
          </Text>
          {/* Beležim's confirmation. A line, not a toast: nothing pops up over a craving. */}
          {noted ? (
            <Text variant="caption" style={styles.noted}>
              {mode.noted}
            </Text>
          ) : null}
        </View>
        <View style={styles.grid}>
          {porivTools.map((tool) => (
            <ToolTile
              key={tool.key}
              tool={tool}
              onPress={() =>
                router.push({ pathname: '/poriv/alat/[tool]', params: { tool: tool.key } })
              }
            />
          ))}
        </View>

        <View style={styles.footerRow}>
          <Text variant="caption" color="textMuted" style={styles.footerHint}>
            {mode.footer}
          </Text>
          {/* Kept deliberately away from the primary: quiet text, opposite edge, no fill. */}
          <Pressable
            onPress={() => void end('slipped')}
            accessibilityLabel={mode.slipped}
            feedback="none"
            style={styles.slipLink}
          >
            <Text variant="caption" color="textMuted" style={styles.slipText}>
              {mode.slipped}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <Button label={mode.survived} haptic="medium" onPress={() => void end('survived')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  field: {
    backgroundColor: color.field,
    paddingHorizontal: space.gutter,
    paddingBottom: space.md,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: {
    width: minTarget,
    height: minTarget,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  eyebrow: { color: color.onField, letterSpacing: 2, opacity: 0.9 },
  ringArea: { alignItems: 'center', gap: space.sm, paddingTop: 0 },
  hint: { color: color.onField, opacity: 0.9 },
  paper: {
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    paddingBottom: space.xs,
    gap: space.xs,
  },
  toolsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toolsTitle: { letterSpacing: 1.6 },
  noted: { color: color.accent },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginTop: space.xs,
  },
  footerHint: { flexShrink: 1 },
  slipLink: { minHeight: minTarget, justifyContent: 'center' },
  slipText: { textDecorationLine: 'underline' },
  actions: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
