import { useRouter, useFocusEffect } from 'expo-router';
import { Flame } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import { getProfile, listCravings, listSlips, logCraving } from '@/data/repo';
import type { Profile } from '@/lib/sync/profileRow';
import { copy as onboardingCopy, REASONS } from '@/features/onboarding/copy';
import { REASON_GLYPHS } from '@/features/onboarding/glyphs';
import { GlyphChip } from '@/features/onboarding/components';
import { quitProgress, resolveAnchorTimeZone } from '@/lib/time/dayCount';
import { color, radius, space } from '@/theme';

import { home } from '@/features/poriv/copy';
import { deriveUserState, type UserState } from './state';

/**
 * Home, v1. Not a dashboard: it leads with ONE thing, decided by the user's state, and shows
 * at most a couple of supporting cards under it (SCREENS.md Part 4).
 *
 * Built only from data that exists today. Money is M4; milestones, check-ins and the weekly
 * tracker are M5. A state whose supporting card needs that data simply shows fewer cards,
 * because an empty card or a "uskoro" is worse than nothing.
 *
 * No bottom nav: Napredak and Saznaj do not exist yet, and a tab that leads nowhere is a lie.
 * "Imam poriv" is fixed in the thumb zone in every state.
 */
type HomeData = {
  profile: Profile | null;
  state: UserState;
  day: number;
  daysUntil: number;
  survived: number;
};

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<HomeData | null>(null);
  const [starting, setStarting] = useState(false);

  // Reloads on every return from Poriv mod, so the survived count and the state are current.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void (async () => {
        const [profile, cravings, slips] = await Promise.all([
          getProfile(),
          listCravings(),
          listSlips(),
        ]);
        if (!alive) return;

        const now = new Date();
        const quitDate = profile?.quitDate ? new Date(profile.quitDate) : null;
        const zone = resolveAnchorTimeZone(
          profile?.quitTimeZone,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        const lastSlip = slips[0] ? new Date(slips[0].created_at) : null;
        const progress = quitDate ? quitProgress(quitDate, now, zone) : null;

        setData({
          profile,
          state: deriveUserState({ quitDate, anchorTimeZone: zone, now, lastSlipAt: lastSlip }),
          day: progress?.state === 'quit' ? progress.day : 0,
          daysUntil: progress?.state === 'pre-quit' ? progress.daysUntil : 0,
          survived: cravings.filter((row) => row.outcome === 'survived').length,
        });
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  /**
   * The row is written BEFORE Mode is navigated to, so it exists on disk before the first
   * frame of the craving screen, with or without a network.
   */
  const beginCraving = async () => {
    if (starting) return;
    setStarting(true);
    try {
      await logCraving();
      router.push('/poriv');
    } finally {
      setStarting(false);
    }
  };

  // Paper, not a spinner: the first frame is the app's own ground.
  if (!data) return <View style={styles.screen} />;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Lead data={data} />
        <Supporting data={data} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <Button
          label={home.cta}
          icon={Flame}
          haptic="medium"
          disabled={starting}
          onPress={() => void beginCraving()}
        />
      </View>
    </View>
  );
}

/** One thing leads. Which one is the whole point of the state machine. */
function Lead({ data }: { data: HomeData }) {
  if (data.state === 'pre-quit') return <PreQuitLead data={data} />;
  if (data.state === 'post-slip') return <PostSlipLead />;
  return <DayCount day={data.day} />;
}

function PreQuitLead({ data }: { data: HomeData }) {
  const quitDate = data.profile?.quitDate ? new Date(data.profile.quitDate) : null;
  if (data.daysUntil === 0) {
    return <Text variant="display">{home.preQuitToday}</Text>;
  }
  return (
    <View style={styles.lead}>
      <Text variant="display">{home.preQuitCountdown(data.daysUntil)}</Text>
      {quitDate ? (
        <Text variant="bodyLarge" color="textMuted">
          {home.preQuitDate(formatDate(quitDate))}
        </Text>
      ) : null}
    </View>
  );
}

function PostSlipLead() {
  return (
    <View style={styles.lead}>
      <Text variant="title">{home.postSlipLead}</Text>
      <Text variant="bodyLarge" color="textSoft">
        {home.postSlipSub}
      </Text>
    </View>
  );
}

function DayCount({ day }: { day: number }) {
  if (day === 0) return <Text variant="display">{home.firstDay}</Text>;
  return (
    <View style={styles.lead}>
      <Text variant="display" style={styles.bigNumber}>
        {day}
      </Text>
      <Text variant="bodyLarge" color="textMuted">
        {home.dayCaption(day)}
      </Text>
    </View>
  );
}

/** At most a couple of cards, and only ones whose data exists in M3. */
function Supporting({ data }: { data: HomeData }) {
  const showReasons = data.state === 'pre-quit' || data.state === 'post-slip';
  const showSurvived = !showReasons && data.survived > 0;

  return (
    <View style={styles.cards}>
      {showSurvived ? (
        <View style={styles.card}>
          <Text variant="label">{home.survived(data.survived)}</Text>
        </View>
      ) : null}

      {showReasons && (data.profile?.reasons.length ?? 0) > 0 ? (
        <View style={styles.card}>
          <Text variant="label">{home.reasonsTitle}</Text>
          {(data.profile?.reasons ?? []).map((key: string) => {
            const glyph = REASON_GLYPHS[key];
            return (
              <View key={key} style={styles.reasonRow}>
                {glyph ? <GlyphChip glyph={glyph} size={32} /> : null}
                <Text variant="body" color="textSoft">
                  {REASONS.find((reason) => reason.key === key)?.label ?? key}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

/** Day and month. The month names are onboarding's own, not a second Serbian list. */
function formatDate(date: Date): string {
  return `${date.getDate()}. ${onboardingCopy.date.months[date.getMonth()]?.toLowerCase() ?? ''}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: {
    paddingHorizontal: space.gutter,
    paddingBottom: space.xl,
    gap: space.xl,
    flexGrow: 1,
  },
  lead: { gap: space.xs },
  bigNumber: { fontSize: 88, lineHeight: 96 },
  cards: { gap: space.sm },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.lg,
    gap: space.sm,
  },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
