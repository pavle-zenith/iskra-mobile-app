import { useFocusEffect, useRouter } from 'expo-router';
import { Lock, Share } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { StatusScrim } from '@/components/StatusScrim';
import { Icon, Pressable, Text } from '@/components/primitives';
import { useShareCard } from '@/features/share/ShareCard';
import { GOAL_CATEGORIES, nextInCategory, type Goal } from '@/lib/progress';
import { color, goalColor, radius, space } from '@/theme';

import { ciljevi, goalLeft, goalSub, goalTitle } from './copy';
import { syncGoals, type GoalsState } from './data';
import { categoryHref, GOAL_GLYPHS, reachedGoals } from './goals';

/**
 * The Napredak tab: the export's MilestoniScreen (docs/M5-brief.md, Export alignment 1). The
 * photo hero holds the title and the count, then two 2-column grids: every goal reached, newest
 * first, as a card in its category's colour, and the next goal of each category as a white card
 * with its category pill and what is still to go.
 *
 * Deviations from the export are listed in `.impeccable/review/m5/REFERENCES.md`.
 */
export function NapredakTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [state, setState] = useState<GoalsState | null>(null);
  const { share, host } = useShareCard();

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

  const cardWidth = (width - space.gutter * 2 - space.sm) / 2;
  const reached = state ? reachedGoals(state) : [];
  const next = state
    ? GOAL_CATEGORIES.map((category) => nextInCategory(state.goals, category)).filter(
        (goal): goal is Goal => goal !== null,
      )
    : [];

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.sm }]}
        showsVerticalScrollIndicator={false}
      >
        <PhotoHero title={ciljevi.title} sub={ciljevi.reachedCount(reached.length)} />

        {reached.length > 0 ? (
          <>
            <SectionLabel>{ciljevi.reachedSection}</SectionLabel>
            <View style={styles.grid}>
              {reached.map((goal) => (
                <ReachedCard
                  key={goal.key}
                  goal={goal}
                  width={cardWidth}
                  onShare={() =>
                    share({ title: goalTitle(goal), sub: goalSub(goal), milestoneKey: goal.key })
                  }
                />
              ))}
            </View>
          </>
        ) : null}

        {next.length > 0 ? (
          <>
            <SectionLabel>{ciljevi.nextSection}</SectionLabel>
            <View style={styles.grid}>
              {next.map((goal) => (
                <NextCard
                  key={goal.key}
                  goal={goal}
                  width={cardWidth}
                  onPress={() => router.push(categoryHref(goal.category))}
                />
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
      <StatusScrim />
      {host}
    </View>
  );
}

/**
 * The export's photo hero: a rounded picture holding the title bottom-left over a scrim. The
 * picture is the website's own sky (assets/PROVENANCE.md); the export's is a test image with no
 * source.
 */
function PhotoHero({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@assets/napredak/sky-hero.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessible={false}
      />
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="heroScrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset={0.2} stopColor={color.text} stopOpacity={0} />
            <Stop offset={0.65} stopColor={color.text} stopOpacity={0.28} />
            <Stop offset={1} stopColor={color.text} stopOpacity={0.6} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroScrim)" />
      </Svg>
      <Text variant="title" accessibilityRole="header" style={styles.heroTitle}>
        {title}
      </Text>
      <Text variant="bodyStrong" style={styles.heroSub}>
        {sub}
      </Text>
    </View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="caption" color="textMuted" style={styles.sectionLabel}>
      {children.toUpperCase()}
    </Text>
  );
}

/**
 * A reached goal in its category's colour. White sits on the colour only at large sizes, so the
 * title is display type and the line under it sits on a white plate, the site's ember-field rule.
 */
function ReachedCard({ goal, width, onShare }: { goal: Goal; width: number; onShare: () => void }) {
  const tone = goalColor[goal.category];
  return (
    <View
      style={[styles.card, styles.reached, { width, backgroundColor: tone.solid }]}
      accessible
      accessibilityLabel={`${goalTitle(goal)}, ${goalSub(goal)}`}
    >
      <Icon as={GOAL_GLYPHS[goal.category]} size={28} color={color.onAccent} />
      <View style={styles.grow} />
      <Text variant="heading" style={styles.onSolid} numberOfLines={2}>
        {goalTitle(goal)}
      </Text>
      <View style={styles.plate}>
        <Text variant="caption" numberOfLines={5}>
          {goalSub(goal)}
        </Text>
      </View>
      {/* The export's Podeli row, on a white plate: small text cannot sit on the colour. */}
      <Pressable
        haptic="light"
        onPress={onShare}
        accessibilityLabel={`${ciljevi.share}, ${goalTitle(goal)}`}
        style={styles.shareRow}
      >
        <Text variant="caption" style={styles.shareText}>
          {ciljevi.share.toUpperCase()}
        </Text>
        <Icon as={Share} size={14} color={color.text} />
      </Pressable>
    </View>
  );
}

/** The next goal of a category: its pill, a lock, the title, and what is still to go. */
function NextCard({ goal, width, onPress }: { goal: Goal; width: number; onPress: () => void }) {
  const tone = goalColor[goal.category];
  return (
    <Pressable
      haptic="light"
      onPress={onPress}
      accessibilityLabel={`${ciljevi.categories[goal.category]}, ${goalTitle(goal)}, ${goalLeft(goal)}`}
      style={[styles.card, styles.next, { width }]}
    >
      <View style={styles.nextHead}>
        <View style={[styles.pill, { backgroundColor: tone.tint }]}>
          <Text variant="caption" style={styles.pillText}>
            {ciljevi.categories[goal.category].toUpperCase()}
          </Text>
        </View>
        <Icon as={Lock} size={20} color={color.textMuted} />
      </View>
      <View style={styles.grow} />
      <Text variant="heading" color="textMuted" numberOfLines={2}>
        {goalTitle(goal)}
      </Text>
      <Text variant="caption" color="textSoft">
        {goalLeft(goal)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.gutter, paddingBottom: space.xl, gap: space.sm },
  hero: {
    minHeight: 188,
    borderRadius: radius.sheet,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: space.lg - 2,
    gap: space.xxs,
    backgroundColor: color.well,
  },
  heroTitle: { color: color.onAccent },
  heroSub: { color: color.onAccent },
  sectionLabel: { marginTop: space.md, marginLeft: space.xxs, letterSpacing: 0.8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  card: { borderRadius: radius.card, padding: space.md, minHeight: 190, gap: space.xs },
  reached: {},
  next: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.line },
  grow: { flexGrow: 1 },
  onSolid: { color: color.onAccent },
  plate: {
    backgroundColor: color.surface,
    borderRadius: radius.badge,
    paddingHorizontal: space.xs + 2,
    paddingVertical: space.xs,
  },
  nextHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { borderRadius: radius.badge, paddingHorizontal: space.xs, paddingVertical: 2 },
  pillText: { color: color.text, letterSpacing: 0.4 },
  shareRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    backgroundColor: color.surface,
    borderRadius: radius.badge,
    paddingHorizontal: space.xs + 2,
    minHeight: 32,
    minWidth: 0,
  },
  shareText: { color: color.text, letterSpacing: 0.8 },
});
