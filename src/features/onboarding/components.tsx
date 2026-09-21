import { ChevronLeft } from 'lucide-react-native';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { progressFor, type StepId } from '@/lib/onboarding/steps';
import { color, minTarget, radius, space } from '@/theme';

import { copy, type ReflectionCard } from './copy';
import type { Glyph } from './glyphs';

/**
 * The shells every onboarding screen is built from.
 *
 * Two grounds, both from the website: paper for questions, and the ember field for the AHA
 * screens, the ceremony and the summary (what the design export calls [DARK]). On the field,
 * only display type sits directly on ember; everything a person reads goes on a white plate.
 *
 * One question per screen, a back arrow, the counter out of 17, and the action pinned in the
 * thumb zone.
 */

type ShellProps = {
  step: StepId;
  children: React.ReactNode;
  onBack?: () => void;
  cta?: { label: string; onPress: () => void; disabled?: boolean };
  /** A second, quieter action under the primary one (only Notifications uses it). */
  secondary?: { label: string; onPress: () => void };
  contentStyle?: StyleProp<ViewStyle>;
};

function Shell({
  step,
  children,
  onBack,
  cta,
  secondary,
  contentStyle,
  field,
}: ShellProps & { field: boolean }) {
  const insets = useSafeAreaInsets();
  const progress = progressFor(step);
  const ground = field ? color.field : color.bg;
  const ink = field ? color.onField : color.text;

  return (
    <View style={[styles.screen, { backgroundColor: ground }]}>
      <View style={{ paddingTop: insets.top + space.xs, paddingHorizontal: space.gutter }}>
        <View style={styles.topBar}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityLabel={copy.back}
              hitSlop={space.xs}
              style={styles.backButton}
            >
              <Icon as={ChevronLeft} size={26} color={ink} />
            </Pressable>
          ) : (
            <View style={styles.backButton} />
          )}
          {progress ? (
            <Text variant="caption" style={{ color: ink, opacity: field ? 0.85 : 1 }}>
              {progress.current} / {progress.total}
            </Text>
          ) : null}
        </View>
        {progress ? (
          <ProgressBar current={progress.current} total={progress.total} field={field} />
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          {
            paddingHorizontal: space.gutter,
            paddingTop: space.lg,
            paddingBottom: space.xl,
            gap: space.md,
          },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {cta ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, space.sm), backgroundColor: ground },
          ]}
        >
          <Button
            variant={field ? 'onField' : 'primary'}
            label={cta.label}
            disabled={cta.disabled}
            onPress={cta.onPress}
          />
          {secondary ? (
            <Pressable onPress={secondary.onPress} style={styles.secondaryAction} feedback="none">
              <Text variant="bodyStrong" style={{ color: field ? color.onField : color.textMuted }}>
                {secondary.label}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/** A question on paper. */
export function QuestionScreen(props: ShellProps) {
  return <Shell {...props} field={false} />;
}

/** An ember field: the AHA screens, the ceremony, the summary. */
export function FieldScreen(props: ShellProps) {
  return <Shell {...props} field />;
}

export function ProgressBar({
  current,
  total,
  field = false,
}: {
  current: number;
  total: number;
  field?: boolean;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
      style={[styles.progressTrack, { backgroundColor: field ? color.onFieldFaint : color.line }]}
    >
      <View
        style={[
          styles.progressFill,
          {
            width: `${(current / total) * 100}%`,
            backgroundColor: field ? color.onField : color.accent,
          },
        ]}
      />
    </View>
  );
}

/** The question itself, and the line under it. */
export function Prompt({
  title,
  sub,
  field = false,
}: {
  title: string;
  sub?: string;
  field?: boolean;
}) {
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="title" style={field ? { color: color.onField } : undefined}>
        {title}
      </Text>
      {sub ? (
        <Text
          variant="body"
          color={field ? undefined : 'textMuted'}
          style={field ? { color: color.onField, opacity: 0.9 } : undefined}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * A glyph on a rounded square of its own tint, as on the website. `size` is the square;
 * the glyph is a little over half of it. Never rendered without its label beside or under it,
 * because glyph-on-tint is as low as 2.78:1 and the words carry the meaning.
 */
export function GlyphChip({ glyph, size = 40 }: { glyph: Glyph; size?: number }) {
  return (
    <View
      style={[
        styles.chip,
        { width: size, height: size, borderRadius: radius.badge, backgroundColor: glyph.tint },
      ]}
    >
      <Icon as={glyph.icon} size={Math.round(size * 0.55)} color={glyph.color} />
    </View>
  );
}

/**
 * The export's selected state, reused everywhere: a chosen option inverts to an ember fill
 * with white text. Unselected is a white card with a hairline border.
 */
export function ChoiceCard({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string;
  sub?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      haptic="light"
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={sub ? `${label}. ${sub}` : label}
      onPress={onPress}
      style={[styles.choice, selected ? styles.choiceSelected : styles.choiceIdle]}
    >
      <View style={styles.choiceText}>
        <Text variant="label" style={selected ? { color: color.onAccent } : undefined}>
          {label}
        </Text>
        {sub ? (
          <Text
            variant="caption"
            color={selected ? undefined : 'textMuted'}
            style={selected ? { color: color.onAccent, opacity: 0.9 } : undefined}
          >
            {sub}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/**
 * Multi-select, laid out as a wrapping two-column grid. Given a glyph it becomes the export's
 * tile: the icon on top in its own colour, the label centred under it, and room around both.
 * Selected inverts the whole tile to ember, and the glyph goes white on it (3.18:1).
 */
export function ChoicePill({
  label,
  selected,
  onPress,
  disabled,
  glyph,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  glyph?: Glyph;
}) {
  return (
    <Pressable
      haptic="light"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: !!disabled }}
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={[
        glyph ? styles.tile : styles.pill,
        selected ? styles.choiceSelected : styles.choiceIdle,
        disabled && !selected ? styles.choiceDisabled : null,
      ]}
    >
      {glyph ? (
        <Icon as={glyph.icon} size={26} color={selected ? color.onAccent : glyph.color} />
      ) : null}
      <Text
        variant={glyph ? 'tile' : 'label'}
        style={[glyph ? styles.tileLabel : null, selected ? { color: color.onAccent } : null]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** A white card on the ember field. Everything readable lives on one of these. */
export function Plate({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.plate, style]}>{children}</View>;
}

/** The reflection card: glyph, title, body, and the ember takeaway line. */
export function ReflectionPlate({ card, glyph }: { card: ReflectionCard; glyph?: Glyph }) {
  return (
    <Plate style={{ gap: space.xs }}>
      {glyph ? <GlyphChip glyph={glyph} /> : null}
      <Text variant="label">{card.title}</Text>
      <Text variant="body" color="textSoft">
        {card.body}
      </Text>
      <Text variant="bodyStrong" style={{ color: color.accent }}>
        {card.takeaway}
      </Text>
    </Plate>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: minTarget,
  },
  backButton: {
    width: minTarget,
    height: minTarget,
    justifyContent: 'center',
    marginLeft: -space.sm,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: space.xxs,
  },
  progressFill: { height: '100%', borderRadius: 2 },
  footer: {
    paddingTop: space.sm,
    paddingHorizontal: space.gutter,
    gap: space.xs,
  },
  secondaryAction: {
    alignSelf: 'center',
    minHeight: minTarget,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  choice: {
    borderRadius: radius.card,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    justifyContent: 'center',
  },
  choiceIdle: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  choiceSelected: {
    backgroundColor: color.accent,
    borderWidth: 1,
    borderColor: color.accent,
  },
  choiceDisabled: { opacity: 0.45 },
  choiceText: { gap: 2 },
  pill: {
    borderRadius: radius.control,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
    flexGrow: 1,
    flexBasis: '45%',
    justifyContent: 'center',
  },
  /** The export's 104pt tile: glyph, gap, centred label, with air on every side. */
  tile: {
    borderRadius: radius.card,
    minHeight: 104,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs + 2,
  },
  tileLabel: { textAlign: 'center' },
  chip: { alignItems: 'center', justifyContent: 'center' },
  plate: {
    backgroundColor: color.fieldPlate,
    borderRadius: radius.card,
    padding: space.lg,
  },
});
