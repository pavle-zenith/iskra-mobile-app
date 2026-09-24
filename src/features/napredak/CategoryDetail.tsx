import { Info, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/primitives';
import { Card } from '@/features/home/components';
import { color, radius, space } from '@/theme';

import { Bar, DetailScreen } from './components';
import { progressCopy } from './copy';

/**
 * The export's CategoryScreen: the template for every category detail. The export built only
 * Zdravlje; M5 (docs/M5-brief.md, Export alignment 2) adds Vreme, Novac, Cigarete, Porivi and
 * Provere on this same template, so it takes its rows as data and knows nothing about health.
 *
 * Top to bottom, as the export: back, and the next-goal pill where the other screens have share;
 * the category title in its colour with the "[n] / [m] dostignuto" line; anything the category
 * adds above the timeline; the vertical timeline (filled dot reached, ringed dot with a bar for
 * the current one, faint dot ahead, one thin line between); the info card at the bottom.
 */

export type TimelineRow = {
  key: string;
  status: 'reached' | 'current' | 'upcoming';
  /** The row's label: a health item's time ("20 minuta"), a goal's title. */
  label: string;
  /** A small tag on the right, muted: Zdravlje's WHO or NHS. */
  tag?: string;
  text?: string;
  /** Under a reached row: when it was reached. */
  reachedOn?: string;
  /** For the current row: 0 to 1. */
  fraction?: number;
  /** Under a row not yet reached: "za [vreme]" or "još [x]". */
  left?: string;
};

export function CategoryDetail({
  title,
  icon,
  tone,
  deep,
  next,
  intro,
  rows,
  info,
}: {
  title: string;
  icon: LucideIcon;
  /** The category colour, for dots, bars and the glyph. */
  tone: string;
  /** Its deep shade, for text: 5.1:1 or better on paper. */
  deep: string;
  /** The pill in the export's top-right slot: how long to the next row. */
  next?: string;
  intro?: React.ReactNode;
  rows: readonly TimelineRow[];
  info: string;
}) {
  const reached = rows.filter((row) => row.status === 'reached').length;

  return (
    <DetailScreen
      right={
        next ? (
          <View style={styles.pill}>
            <Text variant="caption" style={styles.pillText}>
              {next}
            </Text>
          </View>
        ) : undefined
      }
    >
      <View style={styles.head}>
        <Text variant="title" accessibilityRole="header" style={{ color: deep }}>
          {title}
        </Text>
        <View style={styles.count}>
          <Icon as={icon} size={20} color={tone} />
          <Text variant="bodyStrong">{progressCopy.category.reached(reached, rows.length)}</Text>
        </View>
      </View>

      {intro}

      <View style={styles.timeline}>
        {rows.map((row, index) => (
          <Row key={row.key} row={row} last={index === rows.length - 1} tone={tone} deep={deep} />
        ))}
      </View>

      <Card style={styles.info}>
        <Icon as={Info} size={18} color={tone} />
        <Text variant="caption" color="textSoft" style={styles.grow}>
          {info}
        </Text>
      </Card>
    </DetailScreen>
  );
}

function Row({
  row,
  last,
  tone,
  deep,
}: {
  row: TimelineRow;
  last: boolean;
  tone: string;
  deep: string;
}) {
  const reached = row.status === 'reached';
  const current = row.status === 'current';
  const lit = reached || current;

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.dot,
            reached
              ? { backgroundColor: tone }
              : current
                ? [styles.dotCurrent, { borderColor: tone }]
                : styles.dotAhead,
          ]}
        />
        {last ? null : <View style={styles.railLine} />}
      </View>

      <View style={[styles.body, last ? null : styles.bodyGap]}>
        <View style={styles.bodyHead}>
          <Text variant="label" style={[styles.grow, { color: lit ? deep : color.textMuted }]}>
            {row.label}
          </Text>
          {row.tag ? (
            <Text variant="caption" color="textMuted">
              {row.tag}
            </Text>
          ) : null}
        </View>
        {row.text ? (
          <Text variant="body" color={lit ? 'text' : 'textMuted'}>
            {row.text}
          </Text>
        ) : null}
        {reached && row.reachedOn ? (
          <Text variant="caption" color="textMuted">
            {row.reachedOn}
          </Text>
        ) : null}
        {current ? (
          <View style={styles.progress}>
            <View style={styles.grow}>
              <Bar fraction={row.fraction ?? 0} tone={tone} />
            </View>
            <Text variant="caption" style={{ color: deep }}>
              {`${Math.floor((row.fraction ?? 0) * 100)}%`}
            </Text>
          </View>
        ) : null}
        {!reached && row.left ? (
          <Text variant="caption" color="textMuted">
            {row.left}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: color.accentTint,
    borderRadius: radius.badge,
    paddingHorizontal: space.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  pillText: { color: color.text },
  head: { gap: space.xs, marginTop: space.xs },
  count: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  grow: { flex: 1 },
  timeline: { marginTop: space.md },
  row: { flexDirection: 'row', gap: space.md },
  rail: { width: 16, alignItems: 'center', paddingTop: 3 },
  dot: { width: 14, height: 14, borderRadius: 7 },
  dotCurrent: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, backgroundColor: color.bg },
  dotAhead: { borderWidth: 2, borderColor: color.line, backgroundColor: color.bg },
  railLine: {
    flex: 1,
    width: 2,
    marginTop: space.xxs,
    borderRadius: 1,
    backgroundColor: color.line,
  },
  body: { flex: 1, gap: space.xxs },
  bodyGap: { paddingBottom: space.lg },
  bodyHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  progress: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.xs },
  info: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
});
