import * as Haptics from 'expo-haptics';
import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from 'react-native-reanimated';

import { Icon, Pressable, Text } from '@/components/primitives';
import { color, palette, radius, space } from '@/theme';

export type Segment<K extends string> = {
  key: K;
  label: string;
  icon: LucideIcon;
  /** Fill when selected. Must carry a white label at 4.5:1 or better. */
  selectedColor: string;
  /** Icon colour when not selected. */
  iconColor: string;
};

export type SegmentedControlProps<K extends string> = {
  segments: readonly Segment<K>[];
  value: K;
  onChange: (key: K) => void;
  style?: StyleProp<ViewStyle>;
};

const TRACK_PADDING = 4;
/**
 * Above this system text scale every segment stacks its icon over its label, so all
 * three share one layout. Side by side, "Zdravlje" needs 102pt of a 109pt segment on a
 * 375pt phone at 1.0, and overflows from iOS "extra large" (1.12) upwards.
 */
const STACK_ABOVE_FONT_SCALE = 1.05;
const SLIDE = { duration: 260, easing: Easing.out(Easing.exp) };

/**
 * The website's Novac / Zdravlje / Vreme switch (iskraclub.com, "Gledaj kako
 * napreduješ."): a `well` track, the selected segment filled in its own colour with a
 * white label. The fill slides on the UI thread; Reduce Motion makes it jump.
 */
export function SegmentedControl<K extends string>({
  segments,
  value,
  onChange,
  style,
}: SegmentedControlProps<K>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const reduceMotion = useReducedMotion();
  const stacked = useWindowDimensions().fontScale > STACK_ABOVE_FONT_SCALE;

  const index = Math.max(
    0,
    segments.findIndex((s) => s.key === value),
  );
  const segmentWidth = trackWidth > 0 ? (trackWidth - TRACK_PADDING * 2) / segments.length : 0;
  const fill = segments[index]?.selectedColor ?? color.accent;

  const indicatorStyle = useAnimatedStyle(() => {
    const x = index * segmentWidth;
    return {
      width: segmentWidth,
      backgroundColor: reduceMotion ? fill : withTiming(fill, SLIDE),
      transform: [{ translateX: reduceMotion ? x : withTiming(x, SLIDE) }],
    };
  }, [index, segmentWidth, fill, reduceMotion]);

  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);

  return (
    <View accessibilityRole="tablist" onLayout={onLayout} style={[styles.track, style]}>
      {segmentWidth > 0 ? (
        <Animated.View pointerEvents="none" style={[styles.indicator, indicatorStyle]} />
      ) : null}
      {segments.map((segment) => {
        const selected = segment.key === value;
        return (
          <Pressable
            key={segment.key}
            accessibilityRole="tab"
            accessibilityLabel={segment.label}
            accessibilityState={{ selected }}
            feedback="none"
            onPress={() => {
              if (selected) return;
              void Haptics.selectionAsync();
              onChange(segment.key);
            }}
            style={[styles.segment, stacked ? styles.segmentStacked : styles.segmentInline]}
          >
            <Icon
              as={segment.icon}
              size={20}
              color={selected ? palette.white : segment.iconColor}
            />
            <Text variant="label" style={{ color: selected ? palette.white : color.text }}>
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: TRACK_PADDING,
    borderRadius: radius.control,
    backgroundColor: color.well,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.line,
  },
  indicator: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: radius.control - TRACK_PADDING,
  },
  segment: {
    flex: 1,
    minHeight: 52,
    borderRadius: radius.control - TRACK_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxs,
    paddingVertical: space.xs - 2,
  },
  segmentInline: {
    flexDirection: 'row',
    gap: space.xs - 2,
  },
  segmentStacked: {
    flexDirection: 'column',
    gap: space.xxs,
  },
});
