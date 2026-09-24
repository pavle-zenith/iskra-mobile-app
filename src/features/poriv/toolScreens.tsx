import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Pressable, Text } from '@/components/primitives';
import { REASONS } from '@/features/onboarding/copy';
import { getProfile } from '@/data/repo';
import type { Profile } from '@/lib/sync/profileRow';
import type { TriggerKey } from '@/lib/vocab';
import { color, radius, space, toolColor } from '@/theme';

import { TriggerChips } from './components';
import { tools } from './copy';
import { usePorivSession } from './PorivSession';
import { CRAVING_TOTAL_MS, remainingLabel } from './session';
import { ToolShell } from './ToolShell';
import { RisingWater, WalkingTrail } from './toolVisuals';

/**
 * Pijem vodu: one tap per gulp, eight to the bottom. Something for the hand to do. Each gulp
 * raises the water over the whole screen one step (docs/M5-brief.md, Export alignment 11).
 */
const GULPS = 8;

export function VodaScreen() {
  const [taken, setTaken] = useState(0);
  const full = taken >= GULPS;

  return (
    <ToolShell
      tool="voda"
      eyebrow={tools.voda.eyebrow}
      done={tools.voda.done}
      background={<RisingWater level={taken / GULPS} />}
    >
      <Text variant="title">{tools.voda.lead}</Text>
      <Text variant="body" color="textMuted">
        {tools.voda.sub}
      </Text>

      <View style={styles.centre}>
        <Text variant="label" color="textSoft">
          {taken} / {GULPS}
        </Text>
      </View>

      <Pressable
        haptic="light"
        accessibilityLabel={tools.voda.tap}
        disabled={full}
        onPress={() => setTaken((value) => Math.min(GULPS, value + 1))}
        style={[styles.gulp, full ? styles.gulpDone : null]}
      >
        <Text variant="action" style={{ color: full ? color.textMuted : color.onAccent }}>
          {tools.voda.tap}
        </Text>
      </Pressable>
    </ToolShell>
  );
}

/**
 * Moji razlozi: their own words, their reasons, their signature. No health statistic here.
 * Everything comes from the profile they wrote at onboarding, read from SQLite.
 */
export function RazloziScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let alive = true;
    void getProfile().then((row) => {
      if (alive) setProfile(row);
    });
    return () => {
      alive = false;
    };
  }, []);

  const reasons = profile?.reasons ?? [];
  const words = profile?.reasonText?.trim();

  return (
    <ToolShell tool="razlozi" eyebrow={tools.razlozi.eyebrow} done={tools.razlozi.done}>
      {words ? (
        <>
          <Text variant="body" color="textMuted">
            {tools.razlozi.lead}
          </Text>
          <Text variant="title">{`„${words}“`}</Text>
        </>
      ) : null}

      {reasons.length > 0 ? (
        <View style={styles.reasonList}>
          {reasons.map((key: string) => (
            <View key={key} style={styles.reasonChip}>
              <Text variant="label">
                {REASONS.find((reason) => reason.key === key)?.label ?? key}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {profile?.signatureData ? (
        <View style={styles.signature}>
          {/* Drawn in the pad's own coordinates, which are gutter to gutter as here. */}
          <Svg width="100%" height={180}>
            <Path
              d={profile.signatureData}
              stroke={color.text}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </View>
      ) : null}
    </ToolShell>
  );
}

/**
 * Šetam: the export's dotted trail with a dot walking along it, and M3's text as it was. No
 * pedometer: it needs a motion permission, and a prompt mid-craving is an interruption.
 */
export function SetamScreen() {
  const [startedAt] = useState(() => Date.now());
  return (
    <ToolShell tool="setam" eyebrow={tools.setam.eyebrow} done={tools.setam.done}>
      <Text variant="title">{tools.setam.lead}</Text>
      <WalkingTrail startedAt={startedAt} />
      <View style={styles.lines}>
        {tools.setam.lines.map((line) => (
          <Text key={line} variant="bodyLarge" color="textSoft">
            {line}
          </Text>
        ))}
      </View>
    </ToolShell>
  );
}

/**
 * Odlažem: its own five minutes on screen. Not forever, just these five. It sends no
 * notification: the rule for when the app may speak is still open (ROADMAP Part 4).
 */
export function OdlazemScreen() {
  const [startedAt] = useState(() => new Date().toISOString());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const label = remainingLabel(startedAt, now);
  const over = now.getTime() - Date.parse(startedAt) >= CRAVING_TOTAL_MS;

  return (
    <ToolShell tool="odlazem" eyebrow={tools.odlazem.eyebrow} done={tools.odlazem.done}>
      <Text variant="title">{tools.odlazem.lead}</Text>
      <Text variant="body" color="textMuted">
        {tools.odlazem.sub}
      </Text>
      <View style={styles.centre}>
        <Text variant="display" style={{ color: toolColor.odlazem.color }}>
          {label}
        </Text>
        {over ? <Text variant="bodyLarge">{tools.odlazem.ended}</Text> : null}
      </View>
    </ToolShell>
  );
}

/**
 * Beležim: the tool that feeds the only honest measure of whether Iskra works. One tap for
 * the trigger, a slider for the strength, and "Sačuvaj" writes both to the open craving.
 */
const STRENGTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function BelezimScreen() {
  const { craving, note } = usePorivSession();
  const [trigger, setTrigger] = useState<TriggerKey | null>(craving?.trigger ?? null);
  const [strength, setStrength] = useState<number | null>(craving?.strength ?? null);

  const save = () => {
    void note({
      ...(trigger ? { trigger } : {}),
      ...(strength ? { strength } : {}),
    });
  };

  return (
    <ToolShell
      tool="belezim"
      eyebrow={tools.belezim.eyebrow}
      done={tools.belezim.save}
      onDone={save}
      disabled={!trigger && !strength}
    >
      <Text variant="title">{tools.belezim.triggerQuestion}</Text>
      <TriggerChips value={trigger} onSelect={setTrigger} />

      <Text variant="title" style={styles.strengthTitle}>
        {tools.belezim.strengthQuestion}
      </Text>
      <View style={styles.steps}>
        {STRENGTHS.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ selected: strength === value }}
            accessibilityLabel={String(value)}
            feedback="none"
            onPress={() => {
              void Haptics.selectionAsync();
              setStrength(value);
            }}
            style={[styles.step, strength !== null && value <= strength ? styles.stepOn : null]}
          >
            <Text
              variant="tile"
              style={strength !== null && value <= strength ? { color: color.onAccent } : undefined}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.scaleEnds}>
        <Text variant="caption" color="textMuted">
          {tools.belezim.strengthLow}
        </Text>
        <Text variant="caption" color="textMuted">
          {tools.belezim.strengthHigh}
        </Text>
      </View>
    </ToolShell>
  );
}

const styles = StyleSheet.create({
  centre: { alignItems: 'center', gap: space.sm, paddingVertical: space.lg },
  gulp: {
    minHeight: 64,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.accent,
  },
  gulpDone: { backgroundColor: color.well },
  lines: { gap: space.md },
  reasonList: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  reasonChip: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.control,
    backgroundColor: toolColor.razlozi.tint,
  },
  signature: {
    borderRadius: radius.card,
    backgroundColor: color.well,
    overflow: 'hidden',
  },
  strengthTitle: { marginTop: space.md },
  steps: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  step: {
    flexGrow: 1,
    flexBasis: '15%',
    minHeight: 56,
    borderRadius: radius.badge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  stepOn: { backgroundColor: color.accent, borderColor: color.accent },
  scaleEnds: { flexDirection: 'row', justifyContent: 'space-between' },
});
