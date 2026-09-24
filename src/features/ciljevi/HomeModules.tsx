import { ArrowRight } from 'lucide-react-native';
import { Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import type { SaznajPost } from '@/data/saznaj';
import { home } from '@/features/home/copy';
import { Bar } from '@/features/napredak/components';
import { saznaj } from '@/features/saznaj/copy';
import { GOAL_CATEGORIES, nextInCategory, type Goal } from '@/lib/progress';
import { color, elevation, goalColor, radius, space } from '@/theme';

import { ciljevi, goalLeft, goalSub, goalTitle } from './copy';
import { GOAL_GLYPHS } from './goals';

/**
 * Home module 6, "Moj napredak", as the export draws it (docs/M5-brief.md Task 1 and Export
 * alignment 10): the daily article, "Sledeći cilj" opening the roadmap, and the six category
 * cards opening their CategoryScreens. Every part renders only with data behind it.
 */

/**
 * The newest post from Saznaj's cache, on the export's teal card. White sits on teal only at
 * display size, so the label and the reading time sit on white plates.
 */
export function ArticleCard({ post, onPress }: { post: SaznajPost; onPress: () => void }) {
  return (
    <Pressable
      haptic="light"
      onPress={onPress}
      accessibilityLabel={`${home.progress.article}, ${post.title}`}
      style={styles.article}
    >
      <View style={styles.articleHead}>
        <View style={styles.plate}>
          <Text variant="caption" style={styles.plateText}>
            {home.progress.article.toUpperCase()}
          </Text>
        </View>
        <View style={styles.plate}>
          <Text variant="caption">{saznaj.minutes(post.minutes)}</Text>
        </View>
      </View>
      <Text variant="heading" style={styles.onColor}>
        {post.title}
      </Text>
      <View style={styles.readRow}>
        <Text variant="action" style={styles.onColor}>
          {home.progress.read}
        </Text>
        <Icon as={ArrowRight} size={20} color={color.onAccent} />
      </View>
    </Pressable>
  );
}

/**
 * The nearest goal, with its bar and what is still to go. On Home it opens the roadmap; on the
 * success screen it has no `onPress`, because nothing there may pull someone out of the flow.
 */
export function NextGoalCard({ goal, onPress }: { goal: Goal; onPress?: () => void }) {
  const tone = goalColor[goal.category];
  const label = `${home.progress.nextGoal}, ${goalTitle(goal)} ${goalSub(goal)}, ${goalLeft(goal)}`;
  const body = (
    <>
      <View style={styles.nextHead}>
        <View style={[styles.glyph, { backgroundColor: tone.tint }]}>
          <Icon as={GOAL_GLYPHS[goal.category]} size={23} color={tone.solid} />
        </View>
        <View style={styles.grow}>
          <Text variant="caption" color="textMuted" style={styles.eyebrow}>
            {home.progress.nextGoal.toUpperCase()}
          </Text>
          <Text variant="bodyStrong">{`${goalTitle(goal)} ${goalSub(goal)}`}</Text>
          {onPress ? null : (
            <Text variant="caption" color="textSoft">
              {goalLeft(goal)}
            </Text>
          )}
        </View>
      </View>
      <Bar fraction={goal.fraction} tone={tone.solid} />
    </>
  );
  return onPress ? (
    <Pressable
      haptic="light"
      onPress={onPress}
      accessibilityLabel={label}
      style={[styles.card, styles.nextGoal]}
    >
      {body}
    </Pressable>
  ) : (
    <View accessible accessibilityLabel={label} style={[styles.card, styles.nextGoal]}>
      {body}
    </View>
  );
}

/** The six categories, 3 x 2: glyph, name, and the bar to each one's next goal. */
export function CategoryGrid({
  goals,
  onOpen,
}: {
  goals: readonly Goal[];
  onOpen: (goal: Goal['category']) => void;
}) {
  const { width } = useWindowDimensions();
  const tileWidth = (width - space.gutter * 2 - space.sm * 2) / 3;
  return (
    <View style={styles.grid}>
      {GOAL_CATEGORIES.map((category) => {
        const next = nextInCategory(goals, category);
        const tone = goalColor[category];
        return (
          <Pressable
            key={category}
            haptic="light"
            onPress={() => onOpen(category)}
            accessibilityLabel={ciljevi.categories[category]}
            style={[styles.card, styles.tile, { width: tileWidth }]}
          >
            <Icon as={GOAL_GLYPHS[category]} size={25} color={tone.solid} />
            <Text variant="label" style={[styles.tileName, { color: tone.text }]} numberOfLines={1}>
              {ciljevi.categories[category]}
            </Text>
            <Bar fraction={next ? next.fraction : 1} tone={tone.solid} />
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * A goal crossed while the app is open, shown once, calmly (docs/M5-brief.md, Celebration). Never
 * during Poriv mod or a tool, and never within 48 hours of a slip: the caller only opens it on
 * Home, and not after a slip.
 */
export function CelebrationSheet({
  goal,
  onClose,
  onShare,
}: {
  goal: Goal | null;
  onClose: () => void;
  onShare: (goal: Goal) => void;
}) {
  const insets = useSafeAreaInsets();
  const tone = goal ? goalColor[goal.category] : null;
  return (
    <Modal visible={goal !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel={ciljevi.celebration.cta}
          onPress={onClose}
          feedback="none"
          style={styles.grow}
        />
        {goal && tone ? (
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, space.lg) }]}>
            <View style={[styles.badge, { backgroundColor: tone.solid }]}>
              <Icon as={GOAL_GLYPHS[goal.category]} size={28} color={color.onAccent} />
            </View>
            <Text variant="caption" color="textMuted" style={styles.eyebrow}>
              {ciljevi.celebration.title.toUpperCase()}
            </Text>
            <Text variant="title" accessibilityRole="header">
              {goalTitle(goal)}
            </Text>
            <Text variant="body" color="textSoft">
              {goalSub(goal)}
            </Text>
            <Button label={ciljevi.celebration.cta} onPress={onClose} style={styles.sheetCta} />
            <Pressable
              onPress={() => onShare(goal)}
              accessibilityRole="link"
              accessibilityLabel={ciljevi.celebration.share}
              style={styles.shareLink}
            >
              <Text variant="label">{ciljevi.celebration.share}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  onColor: { color: color.onAccent },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    ...(elevation.raised as object),
  },
  article: {
    borderRadius: radius.card,
    backgroundColor: goalColor.porivi.solid,
    padding: space.lg - 4,
    gap: space.sm,
  },
  articleHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  plate: {
    backgroundColor: color.surface,
    borderRadius: radius.badge,
    paddingHorizontal: space.xs + 2,
    paddingVertical: 2,
  },
  plateText: { color: color.text, letterSpacing: 0.8 },
  readRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, alignSelf: 'flex-end' },
  nextGoal: { padding: space.md, gap: space.sm },
  nextHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  glyph: {
    width: 44,
    height: 44,
    borderRadius: radius.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: { letterSpacing: 0.6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: {
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    gap: space.xs,
  },
  tileName: { marginBottom: space.xxs },
  backdrop: { flex: 1, backgroundColor: color.scrim, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    gap: space.xs,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  sheetCta: { marginTop: space.md },
  shareLink: { alignSelf: 'center', justifyContent: 'center', paddingHorizontal: space.md },
});
