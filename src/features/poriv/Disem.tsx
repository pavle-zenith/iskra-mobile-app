import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives';
import { color, space, toolColor } from '@/theme';

import { tools } from './copy';
import { ToolShell } from './ToolShell';

/**
 * Dišem: four rounds of in 4s, hold 4s, out 6s, about a minute in all.
 *
 * The longer exhale is the point, not decoration: a slow out-breath is what actually settles
 * the body. The animation runs on the UI thread so it never stutters while the rest of the
 * app is busy, and a light haptic marks every phase change.
 *
 * With Reduce Motion on, the circle does not move at all. The phase word and the haptic carry
 * the whole exercise, so it still works with the screen barely looked at.
 */
const ROUNDS = 4;

const PHASES = [
  { key: 'inhale', ms: 4000, scale: 1 },
  { key: 'hold', ms: 4000, scale: 1 },
  { key: 'exhale', ms: 6000, scale: 0.55 },
] as const;

type PhaseKey = (typeof PHASES)[number]['key'];

export function DisemScreen() {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(0.55);
  const [step, setStep] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = ROUNDS * PHASES.length;
  const finished = step >= total;
  const phase = PHASES[step % PHASES.length] ?? PHASES[0];

  useEffect(() => {
    if (finished) return;
    const current = PHASES[step % PHASES.length];
    if (!current) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!reduceMotion) {
      scale.value = withTiming(current.scale, { duration: current.ms });
    }

    timer.current = setTimeout(() => setStep((value) => value + 1), current.ms);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [step, finished, reduceMotion, scale]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const round = Math.min(ROUNDS, Math.floor(step / PHASES.length) + 1);

  return (
    <ToolShell
      tool="disem"
      eyebrow={tools.disem.eyebrow}
      done={tools.disem.done}
      contentStyle={styles.content}
    >
      <Text variant="body" color="textMuted">
        {tools.disem.lead}
      </Text>

      <View style={styles.stage}>
        <Animated.View style={[styles.circle, reduceMotion ? null : circle]} />
        <View style={styles.word} pointerEvents="none">
          <Text variant="title">{phaseWord(finished ? 'exhale' : phase.key)}</Text>
        </View>
      </View>

      <Text variant="body" color="textMuted" style={styles.count}>
        {round} / {ROUNDS}
      </Text>
    </ToolShell>
  );
}

function phaseWord(key: PhaseKey): string {
  if (key === 'inhale') return tools.disem.phases.inhale;
  if (key === 'hold') return tools.disem.phases.hold;
  return tools.disem.phases.exhale;
}

const SIZE = 220;

const styles = StyleSheet.create({
  content: { alignItems: 'center', justifyContent: 'center' },
  stage: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: space.lg,
  },
  circle: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: toolColor.disem.tint,
    borderWidth: 2,
    borderColor: toolColor.disem.color,
  },
  word: { alignItems: 'center', justifyContent: 'center' },
  count: { color: color.textMuted },
});
