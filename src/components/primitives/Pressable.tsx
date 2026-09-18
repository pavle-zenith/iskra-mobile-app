import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  Platform,
  Pressable as RNPressable,
  type GestureResponderEvent,
  type PressableProps as RNPressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { minTarget, palette } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export type PressableProps = Omit<RNPressableProps, 'style' | 'children'> & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Extra style while the finger is down, e.g. a darker fill. */
  pressedStyle?: StyleProp<ViewStyle>;
  /** Tactile confirmation on touch-down. Off by default; buttons and tools opt in. */
  haptic?: 'light' | 'medium';
  /** iOS only: 'scale' for buttons and tiles, 'none' for list rows. Android uses ripple. */
  feedback?: 'scale' | 'none';
  /** Android ripple colour. Defaults to ink at 12%. */
  rippleColor?: string;
};

const HAPTIC_STYLE = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
} as const;

const PRESS_IN = { duration: 90, easing: Easing.out(Easing.quad) };
const PRESS_OUT = { duration: 220, easing: Easing.out(Easing.exp) };

/**
 * The only way a tap reaches the app.
 *
 * - Never smaller than 48x48, whatever the visual size.
 * - Platform-native feedback: a quick scale on iOS, the Material ripple on Android.
 *   Reduce Motion swaps the scale for a dim.
 * - Announces itself as a button, and as disabled when it is.
 */
export function Pressable({
  style,
  pressedStyle,
  haptic,
  feedback = 'scale',
  rippleColor = 'rgba(25, 21, 18, 0.12)',
  disabled,
  onPressIn,
  onPressOut,
  accessibilityRole = 'button',
  accessibilityState,
  ...rest
}: PressableProps) {
  const [pressed, setPressed] = useState(false);
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const useScale = Platform.OS === 'ios' && feedback === 'scale';

  const animatedStyle = useAnimatedStyle(() => {
    if (!useScale) return {};
    return reduceMotion
      ? { opacity: 1 - progress.value * 0.3 }
      : { transform: [{ scale: 1 - progress.value * 0.03 }] };
  });

  const handlePressIn = (event: GestureResponderEvent) => {
    setPressed(true);
    progress.value = withTiming(1, PRESS_IN);
    if (haptic) void Haptics.impactAsync(HAPTIC_STYLE[haptic]);
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    setPressed(false);
    progress.value = withTiming(0, PRESS_OUT);
    onPressOut?.(event);
  };

  return (
    <AnimatedPressable
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: !!disabled }}
      disabled={disabled}
      android_ripple={{ color: rippleColor, foreground: true }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        { minHeight: minTarget, minWidth: minTarget },
        Platform.OS === 'android' && { overflow: 'hidden' },
        style,
        pressed && pressedStyle,
        disabled && { opacity: 0.45 },
        animatedStyle,
      ]}
      {...rest}
    />
  );
}

/** Ripple tuned for white-on-colour surfaces (ember button, tool badges). */
export const rippleOnColor = `${palette.white}33`;
