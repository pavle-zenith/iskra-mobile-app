import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { toolColor } from '@/theme';

/**
 * The export's drawings for two tools (docs/M5-brief.md, Export alignment 11). Only the drawing
 * changes: M3's timers, taps, outcome rows and copy stay exactly as they were.
 */

// --- Pijem vodu ----------------------------------------------------------------

/** How strongly the water is tinted: light enough that ink reads on it at every size. */
const WATER_OPACITY = 0.22;
const WAVE_HEIGHT = 18;
const DRIFT_MS = 7000;
const RISE_MS = 600;

/**
 * Water rising from the bottom of the whole screen, one step per gulp, with a slow wave on its
 * surface. With Reduce Motion the level still steps, instantly, and the wave holds still.
 *
 * The export fills the screen with solid blue and repeats the text in white where it is under
 * water. A light blue instead keeps ink readable above and below the surface with one copy of
 * the text: ink on it measures well over 4.5:1.
 */
export function RisingWater({ level }: { level: number }) {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const target = Math.max(0, Math.min(1, level)) * height;

  const waterHeight = useSharedValue(target);
  useEffect(() => {
    waterHeight.value = reduceMotion
      ? target
      : withTiming(target, { duration: RISE_MS, easing: Easing.out(Easing.quad) });
  }, [target, reduceMotion, waterHeight]);

  const drift = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(drift);
      drift.value = 0;
      return;
    }
    drift.value = withRepeat(withTiming(-width, { duration: DRIFT_MS, easing: Easing.linear }), -1);
    return () => cancelAnimation(drift);
  }, [reduceMotion, width, drift]);

  const body = useAnimatedStyle(() => ({ height: waterHeight.value }));
  const wave = useAnimatedStyle(() => ({ transform: [{ translateX: drift.value }] }));

  const tone = toolColor.voda.color;
  // Two wavelengths per screen width, drawn twice as wide so the drift can loop without a seam.
  const w = width;
  const crest = `M0 ${WAVE_HEIGHT / 2} Q ${w / 4} 0 ${w / 2} ${WAVE_HEIGHT / 2} T ${w} ${WAVE_HEIGHT / 2} T ${w * 1.5} ${WAVE_HEIGHT / 2} T ${w * 2} ${WAVE_HEIGHT / 2} L ${w * 2} ${WAVE_HEIGHT} L 0 ${WAVE_HEIGHT} Z`;

  return (
    <Animated.View style={[styles.water, body]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tone, opacity: WATER_OPACITY }]} />
      {level > 0 ? (
        <Animated.View style={[styles.wave, { width: w * 2 }, wave]}>
          <Svg width={w * 2} height={WAVE_HEIGHT}>
            <Path d={crest} fill={tone} fillOpacity={WATER_OPACITY} />
          </Svg>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

// --- Šetam ----------------------------------------------------------------------

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** One pass along the trail. Roughly a slow walk across the screen. */
const WALK_MS = 9000;
const TRAIL_HEIGHT = 100;

/**
 * A point on the export's trail: two quadratic curves, a rise and a dip, across the width. `t`
 * runs 0 to 1 along the whole trail.
 */
function trailPoint(t: number, width: number): { x: number; y: number } {
  'worklet';
  const mid = 60;
  const half = width / 2;
  const lift = 42;
  const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const x0 = t < 0.5 ? 0 : half;
  const cx = x0 + half / 2;
  const cy = t < 0.5 ? mid - lift : mid + lift;
  const x1 = x0 + half;
  const x = (1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1;
  const y = (1 - u) * (1 - u) * mid + 2 * (1 - u) * u * cy + u * u * mid;
  return { x, y };
}

/**
 * The export's dotted trail with one dot walking along it, looping for as long as the tool is
 * open. With Reduce Motion the trail holds still and the dot sits where the walk has got to,
 * moved on every few seconds rather than animated.
 */
export function WalkingTrail({ startedAt }: { startedAt: number }) {
  const { width: screen } = useWindowDimensions();
  const width = screen - 40;
  const reduceMotion = useReducedMotion();
  const tone = toolColor.setam.color;

  const progress = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(progress);
      return;
    }
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration: WALK_MS, easing: Easing.linear }), -1);
    return () => cancelAnimation(progress);
  }, [reduceMotion, progress]);

  // Reduce Motion: where the walk has got to, stepped every few seconds.
  const [still, setStill] = useState(0);
  useEffect(() => {
    if (!reduceMotion) return;
    const place = () => setStill(((Date.now() - startedAt) % WALK_MS) / WALK_MS);
    place();
    const timer = setInterval(place, 3000);
    return () => clearInterval(timer);
  }, [reduceMotion, startedAt]);

  const dot = useAnimatedProps(() => {
    const point = trailPoint(reduceMotion ? still : progress.value, width);
    return { cx: point.x, cy: point.y };
  });

  const half = width / 2;
  const path = `M0 60 Q ${half / 2} 18 ${half} 60 T ${width} 60`;

  return (
    <View style={styles.trail} accessibilityElementsHidden importantForAccessibility="no">
      <Svg width={width} height={TRAIL_HEIGHT}>
        <Path
          d={path}
          stroke={tone}
          strokeOpacity={0.45}
          strokeWidth={3}
          strokeDasharray="2 10"
          strokeLinecap="round"
          fill="none"
        />
        <AnimatedCircle r={7} fill={tone} animatedProps={dot} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  water: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  wave: { position: 'absolute', left: 0, top: -WAVE_HEIGHT + 1, height: WAVE_HEIGHT },
  trail: { alignItems: 'center', marginVertical: 8 },
});
