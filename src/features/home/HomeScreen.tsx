import { useFocusEffect, useRouter } from 'expo-router';
import { Flame } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import {
  getProfile,
  listCheckins,
  listCravings,
  listSlips,
  logCraving,
  logSlip,
  recordCheckin,
} from '@/data/repo';
import { GlyphChip } from '@/features/onboarding/components';
import { REASONS } from '@/features/onboarding/copy';
import { REASON_GLYPHS } from '@/features/onboarding/glyphs';
import type { Profile } from '@/lib/sync/profileRow';
import { quitProgress, resolveAnchorTimeZone } from '@/lib/time/dayCount';
import { color, space } from '@/theme';

import { CheckInSheet } from './CheckInSheet';
import { AbsolutionCard, Card, Header, SlipLink, TimerCard, WeekCard } from './components';
import { home } from './copy';
import { breakdown, columns, sinceQuit } from './elapsed';
import { deriveUserState, type UserState } from './state';
import { todayIso, weekFor, type WeekDay } from './week';

/**
 * Home v2: the export's dashboard, made true (docs/HOME-V2-brief.md).
 *
 * The screen is the same in every state; only the lead slot above the header changes, and most
 * of the time it is empty. What varies is which modules exist at all: a module whose data is
 * not here yet is simply not rendered. No placeholder, no zero, no "uskoro". Module 4 arrives
 * with M4, module 6 and the bottom nav with M5.
 *
 * Structure references are in `.impeccable/review/home-v2/REFERENCES.md`.
 */
type HomeData = {
  profile: Profile | null;
  state: UserState;
  quitDate: Date | null;
  zone: string;
  survived: number;
  week: { days: WeekDay[]; clean: number };
};

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<HomeData | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [checkingIn, setCheckingIn] = useState(false);
  const [starting, setStarting] = useState(false);
  // A ref as well as the state: two taps inside one frame both pass a state flag, and that
  // would write two craving rows for one craving.
  const startingRef = useRef(false);

  const load = useCallback(async (alive: () => boolean) => {
    const [profile, cravings, slips, checkins] = await Promise.all([
      getProfile(),
      listCravings(),
      listSlips(),
      listCheckins(),
    ]);
    if (!alive()) return;

    const at = new Date();
    const quitDate = profile?.quitDate ? new Date(profile.quitDate) : null;
    const zone = resolveAnchorTimeZone(
      profile?.quitTimeZone,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    const lastSlip = slips[0] ? new Date(slips[0].created_at) : null;

    setData({
      profile,
      state: deriveUserState({ quitDate, anchorTimeZone: zone, now: at, lastSlipAt: lastSlip }),
      quitDate,
      zone,
      survived: cravings.filter((row) => row.outcome === 'survived').length,
      week: weekFor({
        now: at,
        anchorTimeZone: zone,
        quitDate,
        checkins,
        slips,
        labels: home.week.days,
      }),
    });
  }, []);

  // On every return from Poriv mod.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void load(() => alive);
      return () => {
        alive = false;
      };
    }, [load]),
  );

  /**
   * And on every return to the foreground. `useFocusEffect` fires on navigation only, so an
   * app left open overnight would still show yesterday's numbers in the morning. The day
   * figure is the first thing a beta tester checks, and it must never be wrong.
   */
  useEffect(() => {
    let alive = true;
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') void load(() => alive);
    });
    return () => {
      alive = false;
      subscription.remove();
    };
  }, [load]);

  // The timer ticks every second. Nothing else on the screen depends on it.
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const beginCraving = async () => {
    if (startingRef.current) return;
    startingRef.current = true;
    setStarting(true);
    try {
      // The row exists on disk before Mode's first frame, with or without a network.
      await logCraving();
      router.push('/poriv');
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  };

  const answerCheckIn = async (clean: boolean) => {
    if (!data) return;
    setCheckingIn(false);
    await recordCheckin(todayIso(new Date(), data.zone), clean);
    if (!clean) {
      // The same slip path as Poriv mod: its own row, then absolution. Nothing resets.
      await logSlip({});
      router.push('/poriv/slip');
      return;
    }
    await load(() => true);
  };

  // Paper, not a spinner: the first frame is the app's own ground.
  if (!data) return <View style={styles.screen} />;

  const elapsed = sinceQuit(data.quitDate, now);
  const preQuit = data.quitDate
    ? quitProgress(data.quitDate, now, data.zone).state === 'pre-quit'
    : false;
  const timer =
    elapsed === null
      ? null
      : {
          eyebrow: preQuit ? home.timer.preQuitEyebrow : home.timer.eyebrow,
          columns: columns(breakdown(Math.abs(elapsed))),
        };

  /**
   * Before the quit date every day is "before", so the card would sit there at 0 / 7 with
   * nothing to tap and nothing to show. That is a module with no data, which does not render.
   */
  const showWeek = data.week.days.some((day) => day.state !== 'before');

  const words = data.profile?.reasonText?.trim();
  const reasons = (data.profile?.reasons ?? []).slice(0, 2);
  const showReasons = !!words || reasons.length > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Module 0, the lead slot: empty in every state but the 48 hours after a slip. */}
        {data.state === 'post-slip' ? <AbsolutionCard /> : null}

        <Header
          name={data.profile?.name?.trim() ?? ''}
          survived={data.survived}
          onProfile={() => router.push('/profil')}
        />

        <View style={styles.modules}>
          {showWeek ? (
            <WeekCard
              days={data.week.days}
              clean={data.week.clean}
              onCheckIn={() => setCheckingIn(true)}
            />
          ) : null}

          {timer ? <TimerCard eyebrow={timer.eyebrow} columns={timer.columns} /> : null}

          {showReasons ? (
            <Card
              style={styles.reasons}
              onPress={() => router.push('/poriv/alat/razlozi')}
              accessibilityLabel={home.reasonsTitle}
            >
              {words ? (
                <Text variant="bodyLarge" numberOfLines={2}>{`„${words}“`}</Text>
              ) : (
                <View style={styles.reasonList}>
                  {reasons.map((key: string) => {
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
              )}
              <Text variant="caption" color="textMuted">
                {home.reasonsTitle}
              </Text>
            </Card>
          ) : null}
        </View>

        <SlipLink onPress={() => setCheckingIn(true)} />
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

      <CheckInSheet
        visible={checkingIn}
        onClean={() => void answerCheckIn(true)}
        onSlipped={() => void answerCheckIn(false)}
        // Closing records nothing. The day stays unanswered, which is the truth.
        onClose={() => setCheckingIn(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: {
    paddingHorizontal: space.gutter,
    paddingBottom: space.md,
    gap: space.md,
    flexGrow: 1,
  },
  modules: { gap: space.sm },
  reasons: { gap: space.xs },
  reasonList: { gap: space.xs },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
