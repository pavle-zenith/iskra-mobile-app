import { Flame, Quote, Share } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { Button, Icon, Text } from '@/components/primitives';
import { getProfile } from '@/data/repo';
import { Card } from '@/features/home/components';
import { DetailScreen } from '@/features/napredak/components';
import { copy as onboardingCopy } from '@/features/onboarding/copy';
import { useShareCard } from '@/features/share/ShareCard';
import { HEALTH_ITEMS } from '@/lib/progress';
import { resolveAnchorTimeZone } from '@/lib/time/dayCount';
import { color, radius, space } from '@/theme';

import { dayIndex, lineFor, recentLines } from './daily';
import { MISLI } from './misli';

export const misao = {
  label: 'Misao dana',
  share: 'Podeli',
} as const;

/**
 * The facts the card under the line may state: only what the app already says and sources.
 * "Poriv traje 3 do 5 minuta." from the welcome intro, and the eleven WHO and NHS health items.
 */
const FACTS: readonly string[] = [
  onboardingCopy.welcome.beats[1]?.headline[0] ?? '',
  ...HEALTH_ITEMS.map((item) => `${item.at}: ${item.text}`),
].filter(Boolean);

function useAnchorZone(): string | null {
  const [zone, setZone] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    void getProfile().then((profile) => {
      if (!alive) return;
      setZone(
        resolveAnchorTimeZone(
          profile?.quitTimeZone,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ),
      );
    });
    return () => {
      alive = false;
    };
  }, []);
  return zone;
}

/** Today's line for Home's quote slot, or null while no line is approved. */
export function useTodaysLine(): string | null {
  const zone = useAnchorZone();
  return zone ? lineFor(MISLI, new Date(), zone) : null;
}

/**
 * Home's card in the export's quote slot: the quote glyph, "Misao dana", the line in „…".
 * It renders only when a line exists.
 */
export function MisaoCard({ line, onPress }: { line: string; onPress: () => void }) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${misao.label}, ${line}`} style={styles.homeCard}>
      <Icon as={Quote} size={20} color={color.accent} />
      <View style={styles.grow}>
        <Text variant="caption" color="textMuted">
          {misao.label}
        </Text>
        <Text variant="bodyLarge" numberOfLines={3}>{`„${line}“`}</Text>
      </View>
    </Card>
  );
}

/**
 * Misao dana in full: the export's QuoteScreen (docs/M5-brief.md, Export alignment 5). The line
 * large, dots over the last five days' lines (swiped back through, never ahead), the Iskra fact
 * card, and Podeli. No author row, no category pill, no heart.
 */
export function QuoteScreen() {
  const { width } = useWindowDimensions();
  const zone = useAnchorZone();
  const pager = useRef<ScrollView>(null);
  const [page, setPage] = useState<number | null>(null);
  const { share, host } = useShareCard();

  const recent = zone ? recentLines(MISLI, new Date(), zone) : [];
  const shown = page ?? recent.length - 1;
  const fact = zone ? FACTS[dayIndex(new Date(), zone) % FACTS.length] : null;
  const pageWidth = width - space.gutter * 2;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (next !== shown) setPage(next);
  };

  return (
    <DetailScreen title={misao.label}>
      {recent.length > 0 ? (
        <>
          <Icon as={Quote} size={40} color={color.accentTint} />
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            // Opens on today, the last page; swiping goes back through the earlier days.
            contentOffset={{ x: (recent.length - 1) * pageWidth, y: 0 }}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {recent.map((entry) => (
              <View key={entry.daysAgo} style={{ width: pageWidth }}>
                <Text variant="title" style={styles.line}>
                  {`„${entry.line}“`}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no">
            {recent.map((entry, index) => (
              <View
                key={entry.daysAgo}
                style={[styles.dot, index === shown ? styles.dotOn : null]}
              />
            ))}
          </View>
          {fact ? (
            <Card style={styles.fact}>
              <Icon as={Flame} size={20} color={color.accent} />
              <Text variant="body" color="textSoft" style={styles.grow}>
                {fact}
              </Text>
            </Card>
          ) : null}
          <Button
            label={misao.share}
            icon={Share}
            onPress={() => {
              const entry = recent[shown];
              if (entry) share({ title: `„${entry.line}“` });
            }}
          />
          {host}
        </>
      ) : null}
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  homeCard: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  line: { lineHeight: 36 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginVertical: space.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.line },
  dotOn: { width: 22, backgroundColor: color.accent },
  fact: {
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'flex-start',
    borderRadius: radius.card,
  },
});
