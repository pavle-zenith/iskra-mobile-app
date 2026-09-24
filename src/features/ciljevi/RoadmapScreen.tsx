import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/primitives';
import { Card } from '@/features/home/components';
import { Bar, DetailScreen } from '@/features/napredak/components';
import { formatDay } from '@/lib/i18n/date';
import { upcomingInOrder, type Goal } from '@/lib/progress';
import { color, goalColor, radius, space } from '@/theme';

import { ciljevi, goalLeft, goalSub, goalTitle } from './copy';
import { syncGoals, type GoalsState } from './data';
import { reachedGoals } from './goals';

/**
 * "Moj napredak", the export's GoalsRoadmapScreen (docs/M5-brief.md, Export alignment 3), opened
 * from Home's "Sledeći cilj" card: one rail across every category. The last goals reached, muted
 * and dated; the next one on a highlighted card with its progress; then what comes after, soonest
 * first, each in its category's colour.
 */

/** How much of the rail each end shows, as the export does: five behind, ten ahead. */
const BEHIND = 5;
const AHEAD = 10;

export function RoadmapScreen() {
  const [state, setState] = useState<GoalsState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void syncGoals().then((next) => {
        if (alive) setState(next);
      });
      return () => {
        alive = false;
      };
    }, []),
  );

  if (!state) return <DetailScreen title={ciljevi.roadmapTitle}>{null}</DetailScreen>;

  const unlocked = new Map(state.milestones.map((row) => [row.key, row.unlocked_at]));
  // Reached, oldest of the last five first, so the rail reads forward in time.
  const behind = reachedGoals(state).slice(0, BEHIND).reverse();
  const [current, ...ahead] = upcomingInOrder(state.goals, state.progress);

  return (
    <DetailScreen title={ciljevi.roadmapTitle}>
      <View style={styles.rail}>
        {behind.map((goal) => {
          const at = unlocked.get(goal.key);
          return (
            <RailRow key={goal.key} goal={goal} kind="behind">
              <View style={styles.behindRow}>
                <Text variant="body" color="textMuted" numberOfLines={1} style={styles.grow}>
                  {`${goalTitle(goal)} ${goalSub(goal)}`}
                </Text>
                {at ? (
                  <Text variant="caption" color="textMuted">
                    {formatDay(new Date(at))}
                  </Text>
                ) : null}
              </View>
            </RailRow>
          );
        })}

        {current ? (
          <RailRow goal={current} kind="current">
            <Card style={[styles.currentCard, { borderLeftColor: color.accent }]}>
              <Text variant="caption" style={styles.eyebrow}>
                {ciljevi.nextSection.toUpperCase()}
              </Text>
              <Text variant="caption" color="textMuted">
                {ciljevi.categories[current.category]}
              </Text>
              <Text variant="bodyStrong">{`${goalTitle(current)} ${goalSub(current)}`}</Text>
              <View style={styles.progress}>
                <View style={styles.grow}>
                  <Bar fraction={current.fraction} tone={color.accent} />
                </View>
                <Text variant="caption">{`${Math.floor(current.fraction * 100)}%`}</Text>
              </View>
              <Text variant="caption" color="textSoft">
                {goalLeft(current)}
              </Text>
            </Card>
          </RailRow>
        ) : null}

        {ahead.slice(0, AHEAD).map((goal, index, list) => (
          <RailRow key={goal.key} goal={goal} kind="ahead" last={index === list.length - 1}>
            <View style={styles.aheadRow}>
              <Text variant="caption" style={{ color: goalColor[goal.category].text }}>
                {ciljevi.categories[goal.category]}
              </Text>
              <Text variant="bodyStrong">{`${goalTitle(goal)} ${goalSub(goal)}`}</Text>
              <Text variant="caption" color="textMuted">
                {goalLeft(goal)}
              </Text>
            </View>
          </RailRow>
        ))}
      </View>
    </DetailScreen>
  );
}

function RailRow({
  goal,
  kind,
  last = false,
  children,
}: {
  goal: Goal;
  kind: 'behind' | 'current' | 'ahead';
  last?: boolean;
  children: React.ReactNode;
}) {
  const tone = goalColor[goal.category].solid;
  return (
    <View style={styles.row}>
      <View style={styles.dotColumn}>
        <View
          style={[
            styles.dot,
            kind === 'behind'
              ? { backgroundColor: tone, opacity: 0.5 }
              : kind === 'current'
                ? styles.dotCurrent
                : [styles.dotAhead, { borderColor: tone }],
          ]}
        />
        {last ? null : <View style={styles.line} />}
      </View>
      <View style={[styles.body, last ? null : styles.bodyGap]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { marginTop: space.sm },
  row: { flexDirection: 'row', gap: space.md },
  dotColumn: { width: 14, alignItems: 'center', paddingTop: 5 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotCurrent: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: color.accent,
    backgroundColor: color.surface,
  },
  dotAhead: { borderWidth: 2.5, backgroundColor: color.surface },
  line: { flex: 1, width: 2, marginTop: space.xxs, backgroundColor: color.line, minHeight: 16 },
  body: { flex: 1 },
  bodyGap: { paddingBottom: space.md + 2 },
  grow: { flex: 1 },
  behindRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
  currentCard: {
    borderLeftWidth: 3,
    borderRadius: radius.control,
    gap: space.xxs,
  },
  eyebrow: { color: color.text, letterSpacing: 0.8 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.xs },
  aheadRow: { gap: 2 },
});
