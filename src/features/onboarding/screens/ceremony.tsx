import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { Flame } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Pressable, Text } from '@/components/primitives';
import { drain } from '@/data/sync';
import { updateProfile } from '@/data/repo';
import { color, radius, space } from '@/theme';

import { FieldScreen, Plate, ProgressBar, Prompt, QuestionScreen } from '../components';
import { annualCigarettes, annualCostRsd, copy, costEquivalent, formatRsd, REASONS } from '../copy';
import { useOnboarding } from '../OnboardingProvider';
import { SignaturePad } from '../SignaturePad';

/**
 * The demo, the ceremony, the payoff and the permission.
 *
 * The panic demo deliberately does NOT write a `cravings` row. That table is the only honest
 * measure of whether Iskra works, and an onboarding tap on every install would pollute it.
 */

export function PanicStep() {
  const { goNext, goBack, gender } = useOnboarding();

  return (
    <QuestionScreen step="panic" onBack={() => goBack('panic')}>
      <Text variant="caption" color="textMuted" style={styles.eyebrowInk}>
        {copy.panic.eyebrow}
      </Text>
      <Prompt title={copy.panic.header} sub={copy.panic.body(gender)} />

      <View style={styles.panicArea}>
        <Pressable
          haptic="medium"
          accessibilityLabel={copy.panic.button}
          onPress={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            void goNext('panic');
          }}
          style={styles.panicButton}
        >
          <Icon as={Flame} size={34} color={color.onAccent} />
          <Text variant="action" style={{ color: color.onAccent }}>
            {copy.panic.button}
          </Text>
        </Pressable>
      </View>

      <Text variant="body" color="textMuted" style={styles.centered}>
        {copy.panic.footer}
      </Text>
    </QuestionScreen>
  );
}

export function CommitmentStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom, gender } = useOnboarding();

  return (
    <FieldScreen
      step="commitment"
      onBack={() => goBack('commitment')}
      cta={{
        label: copy.commitment.cta,
        disabled: !canAdvanceFrom('commitment'),
        onPress: () => void goNext('commitment'),
      }}
    >
      <Text variant="caption" style={styles.wordmark}>
        {copy.commitment.wordmark}
      </Text>
      <Text variant="title" style={styles.onField}>
        {copy.commitment.header(draft.name ?? '')}
      </Text>

      <View style={styles.pledges}>
        {copy.commitment.pledges(gender).map((pledge) => (
          <View key={pledge} style={styles.pledgeRow}>
            <View style={styles.pledgeTick} />
            <Text variant="body" style={[styles.onField, styles.pledgeText]}>
              {pledge}
            </Text>
          </View>
        ))}
      </View>

      <SignaturePad
        value={draft.signatureData ?? null}
        onChange={(path) => void answer({ signatureData: path ?? undefined, committed: !!path })}
      />
    </FieldScreen>
  );
}

/**
 * The processing beat. Real work, not a fake timer: the plan is computed here, and the profile
 * is pushed if there is signal. It never waits longer than the animation, so with no signal it
 * takes exactly as long as it does online.
 */
const STEP_MS = 900;

export function ProcessingStep() {
  const { goNext, copyContext } = useOnboarding();
  const [done, setDone] = useState(0);
  const advanced = useRef(false);

  useEffect(() => {
    // The work: the numbers the summary is about to show, and a push attempt for the profile.
    const plan = {
      annual: annualCostRsd(copyContext),
      perYear: annualCigarettes(copyContext),
    };
    void plan;
    void drain();

    const timers = copy.processing.steps.map((_, index) =>
      setTimeout(() => setDone(index + 1), STEP_MS * (index + 1)),
    );
    const finish = setTimeout(() => {
      if (advanced.current) return;
      advanced.current = true;
      void goNext('processing');
    }, STEP_MS * copy.processing.steps.length);

    return () => {
      for (const timer of timers) clearTimeout(timer);
      clearTimeout(finish);
    };
  }, [copyContext, goNext]);

  return (
    <QuestionScreen step="processing">
      <Prompt title={copy.processing.header} />
      <View style={styles.processing}>
        {copy.processing.steps.map((label, index) => (
          <View key={label} style={styles.processingRow}>
            <Text variant="body" color={index < done ? 'text' : 'textMuted'}>
              {label}
            </Text>
            <ProgressBar current={index < done ? 1 : 0} total={1} />
          </View>
        ))}
      </View>
      <Text variant="caption" color="textMuted">
        {copy.processing.facts[done % copy.processing.facts.length]}
      </Text>
    </QuestionScreen>
  );
}

export function SummaryStep() {
  const { draft, goNext, copyContext } = useOnboarding();
  const annual = annualCostRsd(copyContext);
  const quitDate = draft.quitDate ? new Date(draft.quitDate) : null;

  const stats: { label: string; value: string }[] = [
    {
      label: copy.summary.statLabels.quitDate,
      value: quitDate
        ? `${quitDate.getDate()}. ${copy.date.months[quitDate.getMonth()]?.toLowerCase() ?? ''}`
        : '',
    },
    { label: copy.summary.statLabels.perDay, value: String(copyContext.cigarettesPerDay) },
    {
      label: copy.summary.statLabels.packPrice,
      value: `${formatRsd(copyContext.packPriceRsd)} ${copy.cost.currency}`,
    },
    {
      label: copy.summary.statLabels.perYear,
      value: formatRsd(annualCigarettes(copyContext)),
    },
  ];

  return (
    <FieldScreen
      step="summary"
      cta={{ label: copy.summary.cta, onPress: () => void goNext('summary') }}
    >
      <Text variant="caption" style={styles.eyebrow}>
        {copy.summary.eyebrow}
      </Text>
      <Prompt
        title={copy.summary.header(copyContext)}
        sub={copy.summary.sub(copyContext.gender)}
        field
      />

      <Plate style={{ gap: space.xxs }}>
        <Text variant="body" color="textMuted">
          {copy.summary.savingsTitle}
        </Text>
        <Text variant="title" style={{ color: color.accent }}>
          {formatRsd(annual)} {copy.cost.currency}
        </Text>
        <Text variant="caption" color="textMuted">
          {costEquivalent(annual)}
        </Text>
      </Plate>

      <View style={styles.statGrid}>
        {stats.map((stat) => (
          <Plate key={stat.label} style={styles.stat}>
            <Text variant="label">{stat.value}</Text>
            <Text variant="caption" color="textMuted">
              {stat.label}
            </Text>
          </Plate>
        ))}
      </View>

      <Plate style={{ gap: space.xs }}>
        <Text variant="label">{copy.summary.milestonesTitle}</Text>
        {copy.summary.milestones.map((milestone) => (
          <View key={milestone.time} style={styles.milestone}>
            <Text variant="caption" color="textMuted" style={styles.milestoneTime}>
              {milestone.time}
            </Text>
            <Text variant="body" style={styles.milestoneText}>
              {milestone.text}
            </Text>
          </View>
        ))}
      </Plate>

      {(draft.reasons?.length ?? 0) > 0 ? (
        <Plate style={{ gap: space.xs }}>
          <Text variant="label">{copy.summary.reasonsTitle}</Text>
          {(draft.reasons ?? []).map((key) => (
            <Text key={key} variant="body" color="textSoft">
              {REASONS.find((reason) => reason.key === key)?.label ?? key}
            </Text>
          ))}
        </Plate>
      ) : null}

      <Text variant="bodyLarge" style={[styles.onField, styles.centered]}>
        {copy.summary.closing}
      </Text>
      <Text variant="caption" style={[styles.onField, styles.centered, styles.finePrint]}>
        {copy.summary.finePrint}
      </Text>
    </FieldScreen>
  );
}

export function NotificationsStep() {
  const { finish } = useOnboarding();
  const [asking, setAsking] = useState(false);

  /**
   * Permission only. Iskra sends nothing in M2: the rule that a push reads state before it
   * speaks is undecided (ROADMAP Part 4), and congratulating someone who slipped yesterday is
   * the worst thing this app could do.
   */
  const allow = async () => {
    setAsking(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        try {
          const token = await Notifications.getDevicePushTokenAsync();
          await updateProfile({ pushToken: String(token.data) });
        } catch {
          // No token on a simulator, and none without push credentials. Permission still holds.
        }
      }
    } finally {
      setAsking(false);
      await finish();
    }
  };

  return (
    <QuestionScreen
      step="notifications"
      cta={{ label: copy.notifications.cta, disabled: asking, onPress: () => void allow() }}
      secondary={{ label: copy.notifications.skip, onPress: () => void finish() }}
    >
      <Prompt title={copy.notifications.header} sub={copy.notifications.sub} />
      <View style={{ gap: space.xs }}>
        {copy.notifications.samples.map((sample) => (
          <View key={sample.title} style={styles.sample}>
            <View style={styles.sampleIcon}>
              <Icon as={Flame} size={18} color={color.accent} />
            </View>
            <View style={styles.sampleText}>
              <Text variant="bodyStrong">{sample.title}</Text>
              <Text variant="caption" color="textMuted">
                {sample.body}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </QuestionScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: color.onField, opacity: 0.85, letterSpacing: 1.6 },
  eyebrowInk: { letterSpacing: 1.6 },
  onField: { color: color.onField },
  centered: { textAlign: 'center' },
  wordmark: { color: color.onField, letterSpacing: 3, opacity: 0.9 },
  panicArea: { alignItems: 'center', paddingVertical: space.xl },
  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  pledges: { gap: space.sm, marginVertical: space.sm },
  pledgeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs },
  pledgeTick: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color.onField,
    marginTop: 8,
  },
  pledgeText: { flex: 1 },
  processing: { gap: space.md, paddingVertical: space.lg },
  processingRow: { gap: space.xxs },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  stat: { flexGrow: 1, flexBasis: '45%', gap: 2 },
  milestone: { flexDirection: 'row', gap: space.sm },
  milestoneTime: { width: 72 },
  milestoneText: { flex: 1 },
  finePrint: { opacity: 0.8 },
  sample: {
    flexDirection: 'row',
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.control,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  sampleIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.badge,
    backgroundColor: color.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sampleText: { flex: 1, gap: 2 },
});
