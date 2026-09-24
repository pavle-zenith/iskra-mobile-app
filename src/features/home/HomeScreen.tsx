import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Flame } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusScrim } from '@/components/StatusScrim';
import { Button, Text } from '@/components/primitives';
import {
  getProfile,
  listCheckins,
  listCravings,
  listSlips,
  logCraving,
  logSlip,
  recordCheckin,
  type SlipRow,
} from '@/data/repo';
import { readSaznaj, refreshSaznaj, type SaznajPost } from '@/data/saznaj';
import { goalSub, goalTitle } from '@/features/ciljevi/copy';
import { syncGoals } from '@/features/ciljevi/data';
import { categoryHref } from '@/features/ciljevi/goals';
import {
  ArticleCard,
  CategoryGrid,
  CelebrationSheet,
  NextGoalCard,
} from '@/features/ciljevi/HomeModules';
import { progressFor } from '@/features/napredak/data';
import { MisaoCard, useTodaysLine } from '@/features/misao/QuoteScreen';
import { rescheduleNotifications } from '@/features/notifications/scheduler';
import { openArticle } from '@/features/saznaj/open';
import { useShareCard } from '@/features/share/ShareCard';
import { GlyphChip } from '@/features/onboarding/components';
import { REASONS } from '@/features/onboarding/copy';
import { REASON_GLYPHS } from '@/features/onboarding/glyphs';
import { nearestGoals, type Goal } from '@/lib/progress';
import type { Profile } from '@/lib/sync/profileRow';
import { quitProgress, resolveAnchorTimeZone } from '@/lib/time/dayCount';
import { color, space } from '@/theme';

import { CheckInSheet } from './CheckInSheet';
import {
  AbsolutionCard,
  Card,
  Header,
  SlipLink,
  StatCards,
  TimerCard,
  WeekCard,
} from './components';
import { home } from './copy';
import { breakdown, columns, sinceQuit } from './elapsed';
import { deriveUserState, POST_SLIP_WINDOW_MS, type UserState } from './state';
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
  slips: SlipRow[];
  week: { days: WeekDay[]; clean: number };
  /** Module 6: every goal, and the newest post from Saznaj's cache. */
  goals: Goal[];
  article: SaznajPost | null;
};

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<HomeData | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [checkingIn, setCheckingIn] = useState(false);
  const [starting, setStarting] = useState(false);
  const [celebrating, setCelebrating] = useState<Goal | null>(null);
  const todaysLine = useTodaysLine();
  const { share, host: shareHost } = useShareCard();
  // A ref as well as the state: two taps inside one frame both pass a state flag, and that
  // would write two craving rows for one craving.
  const startingRef = useRef(false);
  const scroller = useRef<ScrollView>(null);
  // Dev builds only: `?scroll=end` opens Home at its bottom, for screenshots from a script.
  const { scroll, checkin } = useLocalSearchParams<{ scroll?: string; checkin?: string }>();
  const toEnd = __DEV__ && scroll === 'end';

  const load = useCallback(async (alive: () => boolean) => {
    const [profile, cravings, slips, checkins, goals, saznajIndex] = await Promise.all([
      getProfile(),
      listCravings(),
      listSlips(),
      listCheckins(),
      // Evaluated on every return to Home, which is where every write that moves a number ends:
      // a craving outcome, a check-in, a slip, a habit or quit-date edit.
      syncGoals(),
      readSaznaj(),
    ]);
    if (!alive()) return;
    // The article card follows Saznaj's cache; a refresh runs at most every six hours.
    void refreshSaznaj();
    // The next seven days of notifications, rebuilt from what is true now.
    void rescheduleNotifications();

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
      slips,
      week: weekFor({
        now: at,
        anchorTimeZone: zone,
        quitDate,
        checkins,
        slips,
        labels: home.week.days,
      }),
      goals: goals.goals,
      article: saznajIndex?.posts[0] ?? null,
    });

    // A goal crossed since the last look is shown once, calmly: the newest of them, and never
    // within 48 hours of a slip, when the row is written silently (PRODUCT.md, "Never
    // congratulate blindly"). Home is never under Poriv mod, so that rule holds here too.
    const quietAfterSlip = lastSlip && at.getTime() - lastSlip.getTime() < POST_SLIP_WINDOW_MS;
    const newest = [...goals.newly].sort(
      (a, b) => (b.crossedAt?.getTime() ?? at.getTime()) - (a.crossedAt?.getTime() ?? at.getTime()),
    )[0];
    if (newest && !quietAfterSlip) setCelebrating(newest);
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

  // A tapped check-in notification opens the sheet straight away. Each tap carries a new value,
  // so a second tap opens it again; state follows the param during render, not in an effect.
  const [seenCheckin, setSeenCheckin] = useState<string | undefined>(undefined);
  if (checkin !== seenCheckin) {
    setSeenCheckin(checkin);
    if (checkin) setCheckingIn(true);
  }

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

  /** Offline, the article cannot load: Saznaj says so, instead of a blank browser. */
  const readArticle = async (post: SaznajPost | null) => {
    if (post && (await openArticle(post)) === 'offline') router.push('/saznaj');
  };

  const answerCheckIn = async (clean: boolean) => {
    if (!data) return;
    setCheckingIn(false);
    await recordCheckin(todayIso(new Date(), data.zone), clean);
    if (!clean) {
      // The same slip path as Poriv mod: its own row, then absolution. Nothing resets.
      // The slip flow, outside the Poriv stack: a check-in is not a craving, and no craving row
      // may be written for it.
      const row = await logSlip({});
      void rescheduleNotifications();
      router.push({ pathname: '/posrtaj', params: { slip: row.id } });
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

  /**
   * Module 4, from the progress engine. Before the quit date, and in the first minutes after it,
   * nothing has been saved yet: a card showing 0 is a module with no data, which does not render.
   */
  const progress = preQuit ? null : progressFor(data.profile, data.slips, now);
  const showStats = !!progress && progress.cigarettesNotSmoked > 0;

  const nextGoal = nearestGoals(data.goals, 1)[0];

  const words = data.profile?.reasonText?.trim();
  const reasons = (data.profile?.reasons ?? []).slice(0, 2);
  const showReasons = !!words || reasons.length > 0;

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scroller}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.md }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={
          toEnd ? () => scroller.current?.scrollToEnd({ animated: false }) : undefined
        }
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

          {timer ? (
            <TimerCard
              eyebrow={timer.eyebrow}
              columns={timer.columns}
              // Counting down to the quit date, there is no time of theirs to show yet.
              onPress={preQuit ? undefined : () => router.push('/napredak/vreme')}
            />
          ) : null}

          {showReasons ? (
            <Card
              style={styles.reasons}
              onPress={() => router.push('/razlozi')}
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

          {showStats && progress ? (
            <StatCards
              rsdSaved={progress.rsdSaved}
              cigarettesNotSmoked={progress.cigarettesNotSmoked}
              onMoney={() => router.push('/napredak/novac')}
              onCigarettes={() => router.push('/napredak/cigarete')}
            />
          ) : null}

          {/* The export's quote slot holds Misao dana (docs/M5-brief.md, Export alignment 5).
              It renders once Pavle's approved lines exist: docs/QUOTES-draft.md is a draft. */}
          {todaysLine ? (
            <MisaoCard line={todaysLine} onPress={() => router.push('/misao')} />
          ) : null}
        </View>

        {/* Module 6, "Moj napredak". Before the quit date nothing is on its way yet. */}
        {preQuit ? null : (
          <View style={styles.modules}>
            <Text variant="heading" accessibilityRole="header">
              {home.progress.title}
            </Text>
            {data.article ? (
              <ArticleCard post={data.article} onPress={() => void readArticle(data.article)} />
            ) : null}
            {nextGoal ? (
              <NextGoalCard goal={nextGoal} onPress={() => router.push('/napredak/ciljevi')} />
            ) : null}
            <CategoryGrid
              goals={data.goals}
              onOpen={(category) => router.push(categoryHref(category))}
            />
          </View>
        )}

        <SlipLink onPress={() => setCheckingIn(true)} />
      </ScrollView>

      <StatusScrim />

      {/* Pinned above the tab bar, which carries the bottom inset. */}
      <View style={[styles.footer, { paddingBottom: space.sm }]}>
        <Button
          label={home.cta}
          icon={Flame}
          haptic="medium"
          disabled={starting}
          onPress={() => void beginCraving()}
        />
      </View>

      <CelebrationSheet
        goal={celebrating}
        onClose={() => setCelebrating(null)}
        onShare={(goal) => {
          setCelebrating(null);
          share({ title: goalTitle(goal), sub: goalSub(goal), milestoneKey: goal.key });
        }}
      />
      {shareHost}

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
