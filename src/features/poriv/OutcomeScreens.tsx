import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import { listCravings } from '@/data/repo';
import type { TriggerKey } from '@/lib/vocab';
import { color, space } from '@/theme';

import { TriggerChips } from './components';
import { slip as slipCopy, success as successCopy } from './copy';
import { usePorivSession } from './PorivSession';
import { survivedOn } from './session';

/**
 * The two ways a craving ends.
 *
 * Neither screen asks for a rating, shows a milestone or offers a share: M3 has none of
 * those, and a rating prompt here would be asking for something in the person's worst minute.
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

  if (craving?.trigger) return null;

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

  useEffect(() => {
    let alive = true;
    void listCravings().then((rows) => {
      if (alive) setToday(survivedOn(rows, new Date()));
    });
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
      <OptionalTrigger question={successCopy.triggerQuestion} />
    </OutcomeShell>
  );
}

/**
 * The slip minimum. M5 builds the full flow; this exists so the link never leads nowhere.
 * Absolution first: the day count does not move, and the screen says so plainly.
 */
export function SlipScreen() {
  const router = useRouter();

  return (
    <OutcomeShell homeLabel={slipCopy.home} onHome={() => router.replace('/')}>
      <Text variant="display">{slipCopy.header}</Text>
      <Text variant="bodyLarge" color="textSoft">
        {slipCopy.lead}
      </Text>
      <OptionalTrigger question={slipCopy.triggerQuestion} />
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
