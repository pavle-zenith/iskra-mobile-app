import { Check } from 'lucide-react-native';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/primitives';
import { dani } from '@/features/home/copy';
import { Card } from '@/features/home/components';
import { breakdown, columns } from '@/features/home/elapsed';
import { formatNumber, timeGoals, timeLeft } from '@/lib/progress';
import { color, progressColor, radius, space } from '@/theme';

import { DetailScreen, FinePrint, Section, useProgressSource } from './components';
import { goalTitle, progressCopy } from './copy';
import { progressFor } from './data';

/**
 * Tvoje vreme, the export's TimeScreen (docs/M4-brief.md Task 3b): the live counter on its ember
 * card, the hours given back, then the time goals as a timeline with "Ti si ovde" between the
 * last goal reached and the next.
 *
 * The goals are Iskra's own (M5 Ciljevi, Vreme). The export's Artemis, ISS, flight and holiday
 * comparisons are cut: they compare with nothing the person did. "Prethodni pad" is cut: slip
 * history belongs to the slip flow and must never read as a verdict here.
 *
 * White on ember is 3.18:1, so on the card only the 19pt bold eyebrow sits on ember; the four
 * figures and their unit labels sit on white plates, the site's rule for the ember field.
 */

const TICK_MS = 1_000;

export function TimeScreen() {
  const { source, now } = useProgressSource(TICK_MS);
  const copy = progressCopy.time;

  if (!source) return <DetailScreen title={copy.title}>{null}</DetailScreen>;

  const progress = progressFor(source.profile, source.slips, now);
  const quitDate = source.profile?.quitDate ? new Date(source.profile.quitDate) : null;
  const cells = columns(breakdown(progress.smokeFreeMs));
  const goals = timeGoals(quitDate, now);
  const reached = goals.filter((goal) => goal.status === 'reached');
  const ahead = goals.filter((goal) => goal.status === 'upcoming');

  return (
    <DetailScreen title={copy.title}>
      <View
        style={styles.counter}
        accessible
        accessibilityLabel={[
          copy.eyebrow,
          ...cells.map((cell) => `${cell.value} ${cell.label}`),
        ].join(', ')}
      >
        <Text variant="action" style={styles.eyebrow}>
          {copy.eyebrow}
        </Text>
        <View style={styles.cells}>
          {cells.map((cell) => (
            <View key={cell.label + String(cell.value)} style={styles.cell}>
              <Text variant="display" style={styles.cellValue}>
                {String(cell.value)}
              </Text>
              <Text variant="caption" color="textMuted">
                {cell.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      {/* The export writes this line inside the card, small and white; white on ember is 3.18:1,
          so it sits under the card on paper, where a line this size can be read. */}
      {quitDate ? (
        <Text variant="body" color="textMuted" style={styles.centred}>
          {copy.period(quitDate)}
        </Text>
      ) : null}

      <Section title={copy.returnedTitle} style={styles.returned}>
        <Text variant="title" style={styles.hours}>
          {copy.hours(progress.hoursReturned)}
        </Text>
        <Text variant="caption" color="textMuted" style={styles.centred}>
          {copy.hoursSub}
        </Text>
        <Text variant="caption" color="textMuted" style={[styles.centred, styles.basis]}>
          {copy.basis}
        </Text>
      </Section>

      <Text variant="bodyStrong" style={styles.goalsTitle}>
        {copy.goalsTitle}
      </Text>
      <View>
        {reached.map((goal) => (
          <Fragment key={goal.days}>
            <Card style={styles.goal}>
              <View style={styles.goalText}>
                <Text variant="bodyLarge">{goalTitle(goal.days)}</Text>
                <Text variant="caption" color="textMuted">
                  {copy.goalSub}
                </Text>
              </View>
              <Icon as={Check} size={24} color={progressColor.money.base} />
            </Card>
            <Road />
          </Fragment>
        ))}

        {/* Where the person is now: between the last goal reached and the next. */}
        <View style={styles.here}>
          <View style={styles.hereBadge}>
            <Text variant="caption" style={styles.hereBadgeText}>
              {copy.here.toUpperCase()}
            </Text>
          </View>
          <Text variant="heading">{`${formatNumber(progress.smokeFreeDays)} ${dani(progress.smokeFreeDays)}`}</Text>
        </View>

        {ahead.map((goal) => (
          <Fragment key={goal.days}>
            <Road />
            <View style={styles.ahead}>
              <Text variant="bodyLarge" color="textMuted">
                {goalTitle(goal.days)}
              </Text>
              <Text variant="caption" color="textMuted">
                {copy.upcoming(timeLeft(goal.msLeft))}
              </Text>
            </View>
          </Fragment>
        ))}
      </View>

      {/* "Podeli svoju pobedu" arrives with M5's share card (Task 1b). */}

      <FinePrint>{copy.finePrint}</FinePrint>
    </DetailScreen>
  );
}

/** The export's dotted road between two goals. */
function Road() {
  return (
    <View style={styles.road} accessibilityElementsHidden importantForAccessibility="no">
      {[0, 1, 2].map((dot) => (
        <View key={dot} style={styles.roadDot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    backgroundColor: color.field,
    borderRadius: radius.card,
    padding: space.lg,
    gap: space.md,
    marginTop: space.xs,
  },
  eyebrow: { color: color.onField, textAlign: 'center', letterSpacing: 2 },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  cell: {
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: color.fieldPlate,
    borderRadius: radius.control - 2,
    paddingVertical: space.md,
    alignItems: 'center',
    gap: space.xxs,
  },
  cellValue: { fontVariant: ['tabular-nums'] },
  centred: { textAlign: 'center' },
  returned: { alignItems: 'center' },
  hours: { color: color.accentPressed, fontVariant: ['tabular-nums'] },
  basis: { marginTop: space.xs },
  goalsTitle: { marginTop: space.sm },
  goal: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  goalText: { flex: 1, gap: space.xxs },
  road: { alignItems: 'center', gap: 4, paddingVertical: 5 },
  roadDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: color.line },
  here: {
    backgroundColor: color.accentTint,
    borderWidth: 2,
    borderColor: color.accent,
    borderRadius: radius.card - 4,
    padding: space.md,
    gap: space.xs,
  },
  hereBadge: {
    alignSelf: 'flex-start',
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.accent,
    borderRadius: radius.badge,
    paddingHorizontal: space.xs,
    paddingVertical: 2,
  },
  hereBadgeText: { color: color.text, letterSpacing: 0.6 },
  ahead: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.card - 4,
    padding: space.md,
    gap: space.xxs,
    backgroundColor: color.bg,
  },
});
