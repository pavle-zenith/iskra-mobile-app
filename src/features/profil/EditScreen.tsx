import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, Text } from '@/components/primitives';
import { getProfile, updateProfile } from '@/data/repo';
import { rescheduleNotifications } from '@/features/notifications/scheduler';
import { DetailScreen } from '@/features/napredak/components';
import { ChoiceCard, Prompt } from '@/features/onboarding/components';
import { copy, type ProductKey } from '@/features/onboarding/copy';
import { genderCode } from '@/features/onboarding/gender';
import { Calendar, NumberField, Stepper } from '@/features/onboarding/inputs';
import type { Profile } from '@/lib/sync/profileRow';
import { color, fontFamily, minTarget, radius, space, textVariants } from '@/theme';

import { profilCopy } from './copy';

/**
 * Editing one part of the plan from Profil (docs/M5-brief.md Task 4): name and gender, the old
 * habits, or the quit date. Each asks onboarding's own approved question with onboarding's own
 * input, and writes only on "Sačuvaj".
 *
 * Every figure recomputes from the new values (the engine keeps no running total), and the
 * notifications are rebuilt. A new quit date keeps every slip, and every goal already reached
 * stays reached: `milestones` rows are history.
 */
export type EditField = 'ime' | 'navike' | 'datum';

export function isEditField(value: unknown): value is EditField {
  return value === 'ime' || value === 'navike' || value === 'datum';
}

const TITLES: Record<EditField, string> = {
  ime: profilCopy.rows.nameGender,
  navike: profilCopy.rows.habits,
  datum: profilCopy.rows.quitDate,
};

export function EditScreen({ field }: { field: EditField }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    void getProfile().then((next) => {
      if (alive) setProfile(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  const save = async (patch: Parameters<typeof updateProfile>[0]) => {
    await updateProfile(patch);
    void rescheduleNotifications();
    router.back();
  };

  return (
    <DetailScreen title={TITLES[field]}>
      {profile === undefined ? null : field === 'ime' ? (
        <NameAndGender profile={profile} onSave={save} />
      ) : field === 'navike' ? (
        <Habits profile={profile} onSave={save} />
      ) : (
        <QuitDate profile={profile} onSave={save} />
      )}
    </DetailScreen>
  );
}

type SaveProps = {
  profile: Profile | null;
  onSave: (patch: Parameters<typeof updateProfile>[0]) => Promise<void>;
};

function NameAndGender({ profile, onSave }: SaveProps) {
  const [name, setName] = useState(profile?.name ?? '');
  const [gender, setGender] = useState(profile?.gender ?? null);
  const options = [
    { value: 'muško', label: copy.gender.male },
    { value: 'žensko', label: copy.gender.female },
    { value: 'drugo', label: copy.gender.unspecified },
  ];
  return (
    <View style={styles.body}>
      <Prompt title={copy.name.question} sub={copy.name.sub} />
      <View style={styles.field}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={copy.name.placeholder}
          placeholderTextColor={color.textMuted}
          accessibilityLabel={copy.name.question}
          autoCapitalize="words"
          autoCorrect={false}
          style={styles.input}
        />
      </View>
      <Prompt title={copy.gender.question} />
      <View style={styles.stack}>
        {options.map((option) => (
          <ChoiceCard
            key={option.value}
            label={option.label}
            selected={gender === option.value}
            onPress={() => setGender(option.value)}
          />
        ))}
      </View>
      <Button
        label={profilCopy.save}
        disabled={!name.trim()}
        onPress={() => void onSave({ name: name.trim(), gender })}
      />
    </View>
  );
}

function Habits({ profile, onSave }: SaveProps) {
  const [perDay, setPerDay] = useState(profile?.cigarettesPerDay ?? copy.cigarettes.default);
  const [price, setPrice] = useState<number | null>(profile?.packPriceRsd ?? null);
  const context = {
    name: profile?.name ?? '',
    gender: genderCode(profile?.gender),
    product: (profile?.product as ProductKey) ?? 'cigarete',
    cigarettesPerDay: perDay,
    cigarettesPerPack: profile?.cigarettesPerPack ?? copy.cigarettes.packDefault,
    packPriceRsd: price ?? 0,
  };
  return (
    <View style={styles.body}>
      <Prompt title={copy.cigarettes.question(context)} sub={copy.cigarettes.sub} />
      <Stepper
        value={perDay}
        unit={copy.cigarettes.unit(context)}
        min={copy.cigarettes.min}
        max={copy.cigarettes.max}
        onChange={setPerDay}
      />
      <Prompt title={copy.price.question} sub={copy.price.sub} />
      <NumberField
        value={price}
        onChange={setPrice}
        suffix={copy.price.currency}
        placeholder={String(copy.price.default)}
        accessibilityLabel={copy.price.question}
      />
      <Button
        label={profilCopy.save}
        disabled={!price}
        onPress={() => void onSave({ cigarettesPerDay: perDay, packPriceRsd: price ?? undefined })}
      />
    </View>
  );
}

function QuitDate({ profile, onSave }: SaveProps) {
  const current = profile?.quitDate ? new Date(profile.quitDate) : null;
  const [picked, setPicked] = useState<Date | null>(
    current && current.getTime() >= new Date().setHours(0, 0, 0, 0) ? current : null,
  );
  return (
    <View style={styles.body}>
      <Prompt title={copy.date.question} sub={profilCopy.quitConfirm.body} />
      <Calendar value={picked} onChange={setPicked} />
      <Button
        label={profilCopy.save}
        disabled={!picked}
        onPress={() => {
          if (!picked) return;
          // Local midnight of the chosen day and the zone it was chosen in, as onboarding sets it.
          const midnight = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate());
          void onSave({
            quitDate: midnight.toISOString(),
            quitTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
        }}
      />
      <Text variant="caption" color="textMuted">
        {copy.date.sub}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { gap: space.md, paddingTop: space.sm },
  stack: { gap: space.sm },
  field: {
    minHeight: minTarget + 8,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
    justifyContent: 'center',
  },
  input: {
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: textVariants.bodyLarge.fontSize,
    paddingVertical: space.sm,
  },
});
