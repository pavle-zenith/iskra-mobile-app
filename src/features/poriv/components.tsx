import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Icon, Pressable, Text } from '@/components/primitives';
import { TRIGGERS } from '@/features/onboarding/copy';
import { TRIGGER_GLYPHS } from '@/features/onboarding/glyphs';
import type { TriggerKey } from '@/lib/vocab';
import { color, minTarget, radius, space, toolColor } from '@/theme';

import type { PorivTool } from './tools';

/** Above this the label moves under the badge, so a two-line label still fits the card. */
const STACK_CARD_ABOVE_FONT_SCALE = 1.35;

/**
 * The countdown ring. It fills once over five minutes and then holds: reaching 0:00 is not
 * a failure and must not read as one, so nothing resets and nothing flashes.
 */
export function Ring({
  progress,
  label,
  caption,
  size = 136,
}: {
  progress: number;
  label: string;
  caption: string;
  size?: number;
}) {
  const stroke = 6;
  const radiusPx = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radiusPx;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={color.onFieldFaint}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radiusPx}
          stroke={color.onField}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - Math.min(1, Math.max(0, progress)))}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.ringCentre} pointerEvents="none">
        {/* Display type, so white on ember clears 3.18:1 as WCAG large text. */}
        <Text variant="display" style={styles.onField}>
          {label}
        </Text>
        <Text variant="bodyLarge" style={[styles.onField, styles.ringCaption]}>
          {caption}
        </Text>
      </View>
    </View>
  );
}

/** A tool on the Mode grid: the site's painted panel, its glyph on its tint, its label. */
export function ToolTile({ tool, onPress }: { tool: PorivTool; onPress: () => void }) {
  const { color: toolTone, tint } = toolColor[tool.key];
  const stacked = useWindowDimensions().fontScale > STACK_CARD_ABOVE_FONT_SCALE;

  return (
    <Pressable haptic="light" accessibilityLabel={tool.label} onPress={onPress} style={styles.card}>
      <Image source={tool.texture} style={styles.texture} resizeMode="cover" />
      <View style={[styles.cardLabelRow, stacked && styles.cardLabelStacked]}>
        <View style={[styles.badge, { backgroundColor: tint }]}>
          <Icon as={tool.icon} size={20} color={toolTone} />
        </View>
        <Text variant="tile" numberOfLines={2} style={styles.cardLabel}>
          {tool.label}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * The ten trigger chips, one tap. The same vocabulary and the same glyphs as onboarding, so
 * what someone answered then and what they log now can be compared.
 */
export function TriggerChips({
  value,
  onSelect,
}: {
  value: TriggerKey | null;
  onSelect: (trigger: TriggerKey) => void;
}) {
  return (
    <View style={styles.chips}>
      {TRIGGERS.map((trigger) => {
        const key = trigger.key as TriggerKey;
        const selected = value === key;
        const glyph = TRIGGER_GLYPHS[key];
        return (
          <Pressable
            key={key}
            haptic="light"
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={trigger.label}
            onPress={() => onSelect(key)}
            style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
          >
            <Icon as={glyph.icon} size={18} color={selected ? color.onAccent : glyph.color} />
            <Text variant="tile" style={selected ? { color: color.onAccent } : undefined}>
              {trigger.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  onField: { color: color.onField },
  ringCentre: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCaption: { opacity: 0.85 },
  card: {
    flexGrow: 1,
    flexBasis: '40%',
    padding: 6,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    // Well past the 64pt Mode floor: this is a hand that is shaking.
    minHeight: 108,
  },
  texture: {
    width: '100%',
    height: 54,
    borderRadius: radius.card - 6,
    backgroundColor: color.well,
  },
  cardLabelRow: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: 6,
    paddingTop: space.xs,
    paddingBottom: 4,
  },
  cardLabelStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: { flexShrink: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: minTarget,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.control,
  },
  chipIdle: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  chipSelected: { backgroundColor: color.accent, borderWidth: 1, borderColor: color.accent },
});
