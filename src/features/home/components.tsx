import { Banknote, Check, CigaretteOff, Flame } from 'lucide-react-native';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, Pressable, Text } from '@/components/primitives';
import { profil } from '@/features/legal/copy';
import { GlyphChip } from '@/features/onboarding/components';
import { formatNumber } from '@/lib/progress';
import {
  color,
  elevation,
  minTarget,
  progressColor,
  radius,
  space,
  type ProgressKey,
} from '@/theme';

import { home } from './copy';
import type { WeekDay } from './week';

/**
 * The dashboard's modules, in the export's card language: white cards with a hairline border
 * and a soft shadow, except "Ova nedelja", which is the one ember surface on the screen.
 */

/** A white card, the screen's default surface. */
export function Card({
  children,
  style,
  onPress,
  accessibilityLabel,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        haptic="light"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

/**
 * "Zdravo," the name, and the flame chip. The chip counts cravings survived, not days.
 *
 * The avatar is the name's initial on ember (nobody uploads a photo in v1) and opens Profil,
 * which is where "Obriši sve podatke" lives (docs/LEGAL-brief.md Task 2).
 */
export function Header({
  name,
  survived,
  onProfile,
}: {
  name: string;
  survived: number;
  onProfile: () => void;
}) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View style={styles.header}>
      <Pressable
        haptic="light"
        onPress={onProfile}
        accessibilityLabel={profil.title}
        style={styles.avatar}
      >
        <Text variant="label" style={{ color: color.onAccent }}>
          {initial}
        </Text>
      </Pressable>
      <View style={styles.headerText}>
        <Text variant="caption" color="textMuted">
          {home.greeting}
        </Text>
        <Text variant="heading">{name}</Text>
      </View>
      {/* Hidden at zero: "0 poriva iza tebe" reads like a score. */}
      {survived > 0 ? (
        <View style={styles.chip} accessibilityLabel={home.survived(survived)}>
          <Icon as={Flame} size={16} color={color.accent} />
          <Text variant="label" style={{ color: color.accentPressed }}>
            {String(survived)}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * "Ova nedelja": the one ember surface on Home, as in the export. Seven days Monday first.
 *
 * A slip day is a filled neutral circle, never red and never an X. A day nobody answered is
 * faint, because the app does not know. Only today, unanswered, is tappable.
 */
export function WeekCard({
  days,
  clean,
  onCheckIn,
}: {
  days: readonly WeekDay[];
  clean: number;
  onCheckIn: () => void;
}) {
  return (
    <View style={styles.weekCard}>
      <View style={styles.weekHead}>
        <Text variant="label" style={styles.onField}>
          {home.week.title}
        </Text>
        <Text variant="label" style={styles.onField}>
          {home.week.count(clean)}
        </Text>
      </View>
      <View style={styles.weekRow}>
        {days.map((day) => (
          <View key={day.date} style={styles.weekDay}>
            <Text variant="caption" style={[styles.onField, day.today ? null : styles.weekDayDim]}>
              {day.label}
            </Text>
            <DayMark day={day} onPress={onCheckIn} />
          </View>
        ))}
      </View>
    </View>
  );
}

function DayMark({ day, onPress }: { day: WeekDay; onPress: () => void }) {
  if (day.state === 'today') {
    return (
      <Pressable
        haptic="light"
        accessibilityLabel={home.checkIn.question}
        onPress={onPress}
        style={[styles.mark, styles.markToday]}
        hitSlop={space.xs}
      >
        <Text variant="label" style={styles.onField}>
          ?
        </Text>
      </Pressable>
    );
  }

  if (day.state === 'clean') {
    return (
      <View style={[styles.mark, styles.markClean]}>
        <Icon as={Check} size={16} color={color.accent} />
      </View>
    );
  }

  // Slip, unanswered, future and before-the-quit-date all render as a circle with no mark in
  // it. Only the weight changes; nothing here says "you failed".
  return (
    <View
      style={[
        styles.mark,
        day.state === 'slip' ? styles.markSlip : styles.markEmpty,
        day.state === 'future' || day.state === 'before' ? styles.markAhead : null,
      ]}
    />
  );
}

/** The live timer. Four columns, tabular figures, one divider between each. */
export function TimerCard({
  eyebrow,
  columns: values,
  onPress,
}: {
  eyebrow: string;
  columns: readonly { value: number; label: string }[];
  /** Opens Tvoje vreme (M4). */
  onPress?: () => void;
}) {
  return (
    <Card
      style={styles.timerCard}
      onPress={onPress}
      accessibilityLabel={[
        eyebrow,
        ...values.map((column) => `${column.value} ${column.label}`),
      ].join(', ')}
    >
      <Text variant="caption" style={styles.timerEyebrow}>
        {eyebrow}
      </Text>
      <View style={styles.timerRow}>
        {values.map((column, index) => (
          <View key={column.label + String(index)} style={styles.timerCell}>
            <View style={styles.timerColumn}>
              <Text variant="title" style={styles.timerValue}>
                {String(column.value)}
              </Text>
              <Text variant="caption" color="textMuted" style={styles.timerLabel}>
                {column.label}
              </Text>
            </View>
            {index < values.length - 1 ? <View style={styles.timerDivider} /> : null}
          </View>
        ))}
      </View>
    </Card>
  );
}

/**
 * Module 4: money saved and cigarettes not smoked, side by side, as in the export. They open
 * Ušteđevina and Odbijene cigarete. The export coloured the cigarette count red; `negative` is
 * never pointed at the user, so it takes the calm violet Odbijene cigarete uses.
 */
export function StatCards({
  rsdSaved,
  cigarettesNotSmoked,
  onMoney,
  onCigarettes,
}: {
  rsdSaved: number;
  cigarettesNotSmoked: number;
  onMoney: () => void;
  onCigarettes: () => void;
}) {
  return (
    <View style={styles.stats}>
      <StatCard
        tone="money"
        icon={Banknote}
        value={formatNumber(rsdSaved)}
        label={home.stats.money}
        onPress={onMoney}
      />
      <StatCard
        tone="time"
        icon={CigaretteOff}
        value={formatNumber(cigarettesNotSmoked)}
        label={home.stats.cigarettes(cigarettesNotSmoked)}
        onPress={onCigarettes}
      />
    </View>
  );
}

function StatCard({
  tone,
  icon,
  value,
  label,
  onPress,
}: {
  tone: ProgressKey;
  icon: typeof Banknote;
  value: string;
  label: string;
  onPress: () => void;
}) {
  const palette = progressColor[tone];
  return (
    <Card style={styles.stat} onPress={onPress} accessibilityLabel={`${value} ${label}`}>
      <GlyphChip glyph={{ icon, color: palette.deep, tint: palette.tint }} size={36} />
      <Text variant="title" style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text variant="caption" style={{ color: palette.deep }}>
        {label}
      </Text>
    </Card>
  );
}

/** The lead slot. Empty in every state but the 48 hours after a slip. */
export function AbsolutionCard() {
  return (
    <Card style={styles.absolution}>
      <Text variant="bodyStrong">{home.postSlipLead}</Text>
      <Text variant="body" color="textSoft">
        {home.postSlipSub}
      </Text>
    </Card>
  );
}

/** The quiet way to log a slip, at the end of the scroll and far from "Imam poriv". */
export function SlipLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={home.slipLink.label}
      onPress={onPress}
      feedback="none"
      style={styles.slipLink}
    >
      <Text variant="body" color="textMuted">
        {home.slipLink.label}
      </Text>
      <Text variant="caption" color="textMuted" style={styles.slipSub}>
        {home.slipLink.sub}
      </Text>
    </Pressable>
  );
}

const MARK = 30;

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.md,
    ...(elevation.raised as object),
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stats: { flexDirection: 'row', gap: space.sm },
  stat: { flex: 1, gap: space.xxs },
  statValue: { marginTop: space.xs, fontVariant: ['tabular-nums'] },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs + 1,
    backgroundColor: color.accentTint,
    borderRadius: 999,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
  },

  weekCard: {
    backgroundColor: color.field,
    borderRadius: radius.card,
    padding: space.md,
    gap: space.sm,
  },
  weekHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  onField: { color: color.onField },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDay: { alignItems: 'center', gap: space.xs },
  weekDayDim: { opacity: 0.85 },
  mark: {
    width: MARK,
    height: MARK,
    borderRadius: MARK / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markClean: { backgroundColor: color.onField },
  markToday: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: color.onField,
    minWidth: minTarget - 12,
    minHeight: minTarget - 12,
    borderRadius: (minTarget - 12) / 2,
  },
  markSlip: { backgroundColor: 'rgba(255, 255, 255, 0.45)' },
  markEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  markAhead: { borderColor: color.onFieldFaint, backgroundColor: 'transparent' },

  timerCard: { gap: space.sm },
  timerEyebrow: { color: color.accent, letterSpacing: 1.6 },
  timerRow: { flexDirection: 'row' },
  timerCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  timerColumn: { flex: 1, alignItems: 'center', gap: 2 },
  timerValue: { fontVariant: ['tabular-nums'] },
  timerLabel: { letterSpacing: 0.8 },
  timerDivider: { width: 1, height: 26, backgroundColor: color.line },

  absolution: { gap: space.xs },

  slipLink: {
    minHeight: minTarget,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: space.sm,
  },
  slipSub: { textAlign: 'center' },
});
