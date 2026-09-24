import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { getProfile, listSlips, updateCraving, updateSlip } from '@/data/repo';
import { breakdown } from '@/features/home/elapsed';
import { unit } from '@/features/home/copy';
import { progressFor } from '@/features/napredak/data';
import { TRIGGERS } from '@/features/onboarding/copy';
import { TRIGGER_GLYPHS } from '@/features/onboarding/glyphs';
import { Stepper } from '@/features/onboarding/inputs';
import type { Profile } from '@/lib/sync/profileRow';
import { SLIP_CIGARETTES, type TriggerKey } from '@/lib/vocab';
import { color, fontFamily, radius, space, textVariants } from '@/theme';

import { posrtaj } from './copy';

/**
 * The slip flow, the export's SlipScreen → SlipReflectScreen → SlipRecapScreen (docs/M5-brief.md,
 * Export alignment 8), reached from Poriv mod and from the check-in.
 *
 * It lives outside the Poriv stack on purpose. That stack's provider opens a craving when there
 * is none, so a slip logged from the check-in used to write a craving that never happened, into
 * the one table that measures whether Iskra works. The slip's id travels in the route instead,
 * and the craving's too when there was one: a trigger logged here lands on both rows (M3).
 *
 * Nothing resets. The total on each screen is the same engine figure as Home's timer.
 */

type SlipParams = { slip?: string; craving?: string };

function useSlipParams() {
  const { slip, craving } = useLocalSearchParams<SlipParams>();
  return { slipId: slip || null, cravingId: craving || null };
}

/** The total smoke-free time and the person's profile, for the total card and the recap. */
function useTotal() {
  const [state, setState] = useState<{ profile: Profile | null; ms: number; days: number } | null>(
    null,
  );
  useEffect(() => {
    let alive = true;
    void (async () => {
      const [profile, slips] = await Promise.all([getProfile(), listSlips()]);
      if (!alive) return;
      const progress = progressFor(profile, slips, new Date());
      setState({ profile, ms: progress.smokeFreeMs, days: progress.smokeFreeDays });
    })();
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

function Frame({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        {footer}
      </View>
    </View>
  );
}

// --- 1. Slip -------------------------------------------------------------------

export function SlipScreen() {
  const router = useRouter();
  const { slipId, cravingId } = useSlipParams();
  const total = useTotal();
  const [count, setCount] = useState<number>(SLIP_CIGARETTES.default);

  const leave = async (to: 'razlog' | 'rekap') => {
    if (slipId) await updateSlip(slipId, { cigarettes: count });
    router.replace({
      pathname: to === 'razlog' ? '/posrtaj/razlog' : '/posrtaj/rekap',
      params: { slip: slipId ?? '', craving: cravingId ?? '' },
    });
  };

  const parts = total ? breakdown(total.ms) : null;

  return (
    <Frame
      footer={
        <>
          <Button label={posrtaj.continue} onPress={() => void leave('rekap')} />
          <Button
            variant="secondary"
            label={posrtaj.reflect}
            onPress={() => void leave('razlog')}
          />
        </>
      }
    >
      {/* The export's flame on a soft glow. */}
      <View style={styles.glow} accessibilityElementsHidden importantForAccessibility="no">
        <Icon as={Flame} size={44} color={color.accent} />
      </View>
      <Text variant="display" style={styles.centred}>
        {posrtaj.header}
      </Text>
      <Text variant="bodyLarge" color="textSoft" style={styles.centred}>
        {posrtaj.lead}
      </Text>

      {parts ? (
        <View style={styles.card}>
          <Text variant="caption" color="textMuted" style={styles.eyebrow}>
            {posrtaj.totalEyebrow}
          </Text>
          <Text variant="heading">
            {[
              `${parts.days} ${unit.days(parts.days)}`,
              `${parts.hours} ${unit.hours(parts.hours)}`,
              `${parts.minutes} ${unit.minutes(parts.minutes)}`,
            ].join(' · ')}
          </Text>
          <Text variant="caption" color="textMuted">
            {posrtaj.totalNote}
          </Text>
        </View>
      ) : null}

      <View style={styles.count}>
        <Text variant="label">{posrtaj.count}</Text>
        <Stepper
          value={count}
          unit={posrtaj.countUnit(count)}
          min={SLIP_CIGARETTES.min}
          max={SLIP_CIGARETTES.max}
          onChange={setCount}
        />
      </View>
    </Frame>
  );
}

// --- 2. Reflect ----------------------------------------------------------------

export function SlipReflectScreen() {
  const router = useRouter();
  const { slipId, cravingId } = useSlipParams();
  const [chosen, setChosen] = useState<TriggerKey | null>(null);
  const [notes, setNotes] = useState('');

  const choose = (trigger: TriggerKey) => {
    setChosen(trigger);
    if (slipId) void updateSlip(slipId, { trigger });
    // The craving and the slip carry the same trigger, so the two can be compared (M3).
    if (cravingId) void updateCraving(cravingId, { trigger });
  };

  const next = async () => {
    if (slipId && notes.trim()) await updateSlip(slipId, { notes: notes.trim() });
    router.replace({
      pathname: '/posrtaj/rekap',
      params: { slip: slipId ?? '', craving: cravingId ?? '' },
    });
  };

  return (
    <Frame footer={<Button label={posrtaj.next} onPress={() => void next()} />}>
      <Text variant="title" accessibilityRole="header">
        {posrtaj.reflectTitle}
      </Text>
      <View style={styles.list}>
        {TRIGGERS.map((trigger) => {
          const key = trigger.key as TriggerKey;
          const glyph = TRIGGER_GLYPHS[key];
          const selected = chosen === key;
          return (
            <View key={key} style={styles.gap}>
              <Pressable
                haptic="light"
                onPress={() => choose(key)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={trigger.label}
                style={[styles.option, selected ? styles.optionSelected : null]}
              >
                {glyph ? (
                  <View style={[styles.glyph, { backgroundColor: glyph.tint }]}>
                    <Icon as={glyph.icon} size={20} color={glyph.color} />
                  </View>
                ) : null}
                <Text variant="body" style={styles.grow}>
                  {trigger.label}
                </Text>
              </Pressable>
              {selected ? (
                <View style={styles.explanation}>
                  <Text variant="body" color="textSoft">
                    {posrtaj.explanation(key)}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <View style={styles.field}>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={posrtaj.notePlaceholder}
          placeholderTextColor={color.textMuted}
          accessibilityLabel={posrtaj.notePlaceholder}
          multiline
          style={styles.input}
        />
      </View>
    </Frame>
  );
}

// --- 3. Recap ------------------------------------------------------------------

export function SlipRecapScreen() {
  const router = useRouter();
  const total = useTotal();
  const words = total?.profile?.reasonText?.trim();
  const signature = total?.profile?.signatureData;

  return (
    <Frame footer={<Button label={posrtaj.next} onPress={() => router.replace('/')} />}>
      {total ? (
        <>
          <Text variant="display" style={styles.centred}>
            {posrtaj.recap(total.days)}
          </Text>
          <Text variant="bodyLarge" color="textSoft" style={styles.centred}>
            {posrtaj.recapLead}
          </Text>
        </>
      ) : null}

      {words || signature ? (
        <View style={styles.card}>
          <Text variant="caption" color="textMuted" style={styles.eyebrow}>
            {posrtaj.reasonsTitle.toUpperCase()}
          </Text>
          {words ? <Text variant="title">{`„${words}“`}</Text> : null}
          {signature ? (
            // Drawn in the pad's own coordinates, as the Moji razlozi tool draws it.
            <Svg width="100%" height={180}>
              <Path
                d={signature}
                stroke={color.text}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          ) : null}
        </View>
      ) : null}
    </Frame>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: space.gutter, paddingBottom: space.lg, gap: space.md },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm, gap: space.sm },
  centred: { textAlign: 'center' },
  glow: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: color.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: { flex: 1 },
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.line,
    padding: space.md,
    gap: space.xs,
  },
  eyebrow: { letterSpacing: 1 },
  count: { gap: space.sm, marginTop: space.sm },
  list: { gap: space.xs },
  gap: { gap: space.xs },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
  },
  optionSelected: { borderColor: color.accent, borderWidth: 2 },
  glyph: {
    width: 36,
    height: 36,
    borderRadius: radius.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanation: {
    backgroundColor: color.well,
    borderRadius: radius.control,
    padding: space.md,
  },
  field: {
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
    paddingHorizontal: space.md,
    minHeight: 96,
  },
  input: {
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: textVariants.body.fontSize,
    paddingVertical: space.sm,
  },
});
