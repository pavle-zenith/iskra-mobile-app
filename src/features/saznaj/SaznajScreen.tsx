import { useFocusEffect } from 'expo-router';
import {
  BookOpen,
  Brain,
  Flame,
  HeartPulse,
  Utensils,
  Wallet,
  WifiOff,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusScrim } from '@/components/StatusScrim';
import { Icon, Pressable, Text } from '@/components/primitives';
import { readSaznaj, refreshSaznaj, type SaznajIndex, type SaznajPost } from '@/data/saznaj';
import { color, palette, radius, space, toolColor } from '@/theme';

import { saznaj } from './copy';
import { openArticle } from './open';

/**
 * Saznaj, the third tab: the export's KnowledgeScreen (docs/M5-brief.md, Export alignment 6) over
 * the website's live blog. The newest post as the featured card, the 2-column Kategorije grid
 * with each topic's real post count, then Novo. Only Sanity's live topics show, and Popularno is
 * cut: no data exists for it. The screen reads as finished at three posts.
 *
 * Renders from the SQLite cache, so it works offline; an article needs signal, and without it
 * the tab says so instead of opening a broken browser.
 */

/** The site's topic icons (`TOPIC_ICONS` in its lib/blog.ts), in Lucide. New topics get the book. */
const TOPIC_GLYPHS: Record<string, LucideIcon> = {
  telo: HeartPulse,
  okidaci: Zap,
  'kafana-i-drustvo': Utensils,
  stres: Brain,
  novac: Wallet,
  motivacija: Flame,
};

/**
 * A colour per topic, each carrying small white text at 4.5:1 or better: health rose, money
 * green, and the tool indigo and violets. Never ember, the one voice of action.
 */
const TOPIC_COLORS: Record<string, string> = {
  telo: palette.health,
  novac: palette.money,
  motivacija: palette.time,
  okidaci: toolColor.odlazem.color,
  'kafana-i-drustvo': toolColor.belezim.color,
};
const FALLBACK_COLOR = toolColor.odlazem.color;

const topicColor = (slug?: string) => (slug && TOPIC_COLORS[slug]) || FALLBACK_COLOR;
const topicGlyph = (slug?: string) => (slug && TOPIC_GLYPHS[slug]) || BookOpen;

export function SaznajScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState<SaznajIndex | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [topic, setTopic] = useState<string | null>(null);

  const refresh = useCallback(async (force: boolean) => {
    const next = await refreshSaznaj({ force });
    if (next) setIndex(next);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void readSaznaj().then((cached) => {
        if (!alive) return;
        if (cached) setIndex(cached);
        setLoaded(true);
        void refresh(false);
      });
      return () => {
        alive = false;
      };
    }, [refresh]),
  );

  // Back in the foreground: refreshed at most every six hours (refreshSaznaj decides).
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh(false);
    });
    return () => subscription.remove();
  }, [refresh]);

  const open = async (post: SaznajPost) => {
    setOffline((await openArticle(post)) === 'offline');
  };

  const onPull = async () => {
    setRefreshing(true);
    await refresh(true);
    setRefreshing(false);
  };

  const [featured, ...rest] = index?.posts ?? [];
  const list = topic ? (index?.posts ?? []).filter((post) => post.category?.slug === topic) : rest;
  const tileWidth = (width - space.gutter * 2 - space.sm) / 2;

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.md }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onPull} tintColor={color.textMuted} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.head}>
          <Text variant="title" accessibilityRole="header">
            {saznaj.title}
          </Text>
          <Text variant="body" color="textMuted">
            {saznaj.sub}
          </Text>
        </View>

        {offline || (loaded && !index) ? (
          <View style={styles.offline} accessibilityLiveRegion="polite">
            <Icon as={WifiOff} size={20} color={color.textSoft} />
            <Text variant="body" color="textSoft" style={styles.grow}>
              {saznaj.offline}
            </Text>
          </View>
        ) : null}

        {featured ? <FeaturedCard post={featured} onPress={() => void open(featured)} /> : null}

        {index && index.categories.length > 0 ? (
          <>
            <SectionLabel>{saznaj.categoriesTitle}</SectionLabel>
            <View style={styles.grid}>
              {index.categories.map((category) => {
                const selected = topic === category.slug;
                return (
                  <Pressable
                    key={category.id}
                    haptic="light"
                    onPress={() => setTopic(selected ? null : category.slug)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${category.title}, ${saznaj.count(category.count)}`}
                    style={[
                      styles.tile,
                      { width: tileWidth, backgroundColor: topicColor(category.slug) },
                      selected ? styles.tileSelected : null,
                    ]}
                  >
                    <Icon as={topicGlyph(category.slug)} size={24} color={color.onAccent} />
                    <View>
                      <Text variant="bodyStrong" style={styles.onColor}>
                        {category.title}
                      </Text>
                      <Text variant="caption" style={styles.onColor}>
                        {saznaj.count(category.count)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {list.length > 0 ? (
          <>
            <View style={styles.novoHead}>
              <SectionLabel>{saznaj.newTitle}</SectionLabel>
              {topic ? (
                <Pressable
                  haptic="light"
                  onPress={() => setTopic(null)}
                  accessibilityLabel={saznaj.all}
                  style={styles.allChip}
                >
                  <Text variant="label">{saznaj.all}</Text>
                </Pressable>
              ) : null}
            </View>
            {list.map((post) => (
              <PostRow key={post.id} post={post} onPress={() => void open(post)} />
            ))}
          </>
        ) : null}
      </ScrollView>
      <StatusScrim />
    </View>
  );
}

/**
 * The newest post, on the export's ember card with a landscape blended into it. White on ember
 * is 3.18:1, so the title is display type and the reading time sits on a white plate.
 */
function FeaturedCard({ post, onPress }: { post: SaznajPost; onPress: () => void }) {
  return (
    <Pressable
      haptic="light"
      onPress={onPress}
      accessibilityLabel={`${post.title}, ${saznaj.minutes(post.minutes)}`}
      style={styles.featured}
    >
      <Image
        source={require('@assets/saznaj/path-cta.jpg')}
        style={[StyleSheet.absoluteFill, styles.texture]}
        resizeMode="cover"
        accessible={false}
      />
      <Text variant="heading" style={styles.onColor}>
        {post.title}
      </Text>
      <View style={styles.minutesPlate}>
        <Text variant="caption">{saznaj.minutes(post.minutes)}</Text>
      </View>
    </Pressable>
  );
}

function PostRow({ post, onPress }: { post: SaznajPost; onPress: () => void }) {
  return (
    <Pressable
      haptic="light"
      onPress={onPress}
      accessibilityLabel={`${post.title}, ${saznaj.minutes(post.minutes)}`}
      style={styles.row}
    >
      <View style={styles.rowHead}>
        {post.category ? (
          <View style={styles.tag}>
            <View style={[styles.tagDot, { backgroundColor: topicColor(post.category.slug) }]} />
            <Text variant="caption">{post.category.title}</Text>
          </View>
        ) : (
          <View />
        )}
        <Text variant="caption" color="textMuted">
          {saznaj.minutes(post.minutes)}
        </Text>
      </View>
      <Text variant="bodyStrong">{post.title}</Text>
      {post.excerpt ? (
        <Text variant="caption" color="textSoft" numberOfLines={2}>
          {post.excerpt}
        </Text>
      ) : null}
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text variant="caption" color="textMuted" style={styles.sectionLabel}>
      {children.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.gutter, paddingBottom: space.xl, gap: space.sm },
  head: { gap: space.xxs, marginBottom: space.xs },
  grow: { flex: 1 },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.card,
    backgroundColor: color.well,
  },
  featured: {
    minHeight: 170,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: color.accent,
    padding: space.lg,
    justifyContent: 'flex-end',
    gap: space.sm,
  },
  texture: { opacity: 0.45, mixBlendMode: 'soft-light' },
  onColor: { color: color.onAccent },
  minutesPlate: {
    alignSelf: 'flex-start',
    backgroundColor: color.surface,
    borderRadius: radius.badge,
    paddingHorizontal: space.xs + 2,
    paddingVertical: 2,
  },
  sectionLabel: { marginTop: space.md, letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: {
    minHeight: 132,
    borderRadius: radius.control,
    padding: space.md,
    justifyContent: 'space-between',
    gap: space.sm,
  },
  tileSelected: { borderWidth: 3, borderColor: color.text },
  novoHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  allChip: {
    minHeight: 36,
    paddingHorizontal: space.md,
    borderRadius: radius.badge,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    justifyContent: 'center',
  },
  row: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.control,
    padding: space.md,
    gap: space.xs,
  },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  tagDot: { width: 8, height: 8, borderRadius: 4 },
});
