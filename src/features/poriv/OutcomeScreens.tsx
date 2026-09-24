import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import { getProfile, listCravings } from '@/data/repo';
import { syncGoals } from '@/features/ciljevi/data';
import { NextGoalCard } from '@/features/ciljevi/HomeModules';
import { nearestGoals, type Goal } from '@/lib/progress';
import { resolveAnchorTimeZone } from '@/lib/time/dayCount';
import type { TriggerKey } from '@/lib/vocab';
import { color, space } from '@/theme';

import { TriggerChips } from './components';
import { success as successCopy } from './copy';
import { usePorivSession } from './PorivSession';
import { survivedOn } from './session';

/**
 * How a craving ends well.
 *
 * Neither screen asks for a rating or offers a share: a rating prompt here would be asking for
 * something in the person's worst minute. Success shows the next goal and how far it is, the
 * export's card, now that goals exist (docs/M5-brief.md, Export alignment 9). A slip goes to the
 * slip flow in src/features/posrtaj.
 * The trigger chips appear only when the craving carries no trigger yet, so nobody is asked
 * the same question twice.
 */

function OutcomeShell({
  children,
  onHome,
  homeLabel,
}: {
  children: React.ReactNode;
  onHome: () => void;
  homeLabel: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <Button label={homeLabel} onPress={onHome} />
      </View>
    </View>
  );
}

/** The one optional tap, offered only if Beležim was not used. */
function OptionalTrigger({ question }: { question: string }) {
  const { craving, note } = usePorivSession();
  const [chosen, setChosen] = useState<TriggerKey | null>(craving?.trigger ?? null);
  // Whether Beležim had already answered this before the screen opened. Captured once, so a
  // tap here does not make the chips vanish under the thumb with nothing to show for it.
  const [askedAlready] = useState(() => !!craving?.trigger);

  if (askedAlready) return null;

  return (
    <View style={styles.optional}>
      <Text variant="label">{question}</Text>
      <TriggerChips
        value={chosen}
        onSelect={(trigger) => {
          setChosen(trigger);
          void note({ trigger });
        }}
      />
    </View>
  );
}

export function SuccessScreen() {
  const router = useRouter();
  const [today, setToday] = useState<number | null>(null);
  const [next, setNext] = useState<Goal | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      // syncGoals also writes a Porivi goal this craving may just have reached.
      const [rows, profile, goals] = await Promise.all([listCravings(), getProfile(), syncGoals()]);
      if (!alive) return;
      setNext(nearestGoals(goals.goals, 1)[0] ?? null);
      // The same anchor zone Home counts days in, so "Danas" means one day in the app.
      const zone = resolveAnchorTimeZone(
        profile?.quitTimeZone,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      setToday(survivedOn(rows, new Date(), zone));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <OutcomeShell homeLabel={successCopy.home} onHome={() => router.replace('/')}>
      <Text variant="display" style={styles.accent}>
        {successCopy.header}
      </Text>
      <Text variant="bodyLarge" color="textSoft">
        {successCopy.lead}
      </Text>
      {today !== null ? <Text variant="title">{successCopy.today(today)}</Text> : null}
      <Text variant="body" color="textMuted">
        {successCopy.learning}
      </Text>
      {next ? <NextGoalCard goal={next} /> : null}
      <OptionalTrigger question={successCopy.triggerQuestion} />
    </OutcomeShell>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: {
    paddingHorizontal: space.gutter,
    paddingBottom: space.xl,
    gap: space.md,
    flexGrow: 1,
  },
  accent: { color: color.accent },
  optional: { gap: space.sm, marginTop: space.lg },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
