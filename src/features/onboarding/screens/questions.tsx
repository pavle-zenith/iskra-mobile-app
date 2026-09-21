import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Pressable, Text } from '@/components/primitives';
import { MAX_REASONS } from '@/lib/onboarding/steps';
import type { TriggerKey } from '@/lib/vocab';
import { color, fontFamily, minTarget, radius, space, textVariants } from '@/theme';

import { ChoiceCard, ChoicePill, Prompt, QuestionScreen } from '../components';
import { copy, FEARS, REASONS, TRIGGERS } from '../copy';
import { FEAR_GLYPHS, REASON_GLYPHS, TRIGGER_GLYPHS } from '../glyphs';
import { useOnboarding } from '../OnboardingProvider';
import { Calendar, NumberField, Stepper, TextArea } from '../inputs';

/** Steps 1 to 5 and 8 to 15: the questions, one per screen, on paper. */

export function NameStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();
  const [focused, setFocused] = useState(false);

  return (
    <QuestionScreen
      step="name"
      onBack={() => goBack('name')}
      cta={{
        label: copy.name.cta,
        disabled: !canAdvanceFrom('name'),
        onPress: () => void goNext('name'),
      }}
    >
      <Prompt title={copy.name.question} sub={copy.name.sub} />
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          value={draft.name ?? ''}
          onChangeText={(text) => void answer({ name: text })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={copy.name.placeholder}
          placeholderTextColor={color.textMuted}
          accessibilityLabel={copy.name.question}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          style={styles.input}
        />
      </View>
    </QuestionScreen>
  );
}

export function GenderStep() {
  const { draft, answer, goNext, goBack } = useOnboarding();
  const choose = async (gender: string) => {
    await answer({ gender });
    await goNext('gender');
  };

  return (
    <QuestionScreen step="gender" onBack={() => goBack('gender')}>
      <Prompt title={copy.gender.question} sub={copy.gender.sub} />
      <View style={styles.stack}>
        <ChoiceCard
          label={copy.gender.male}
          selected={draft.gender === 'muško'}
          onPress={() => void choose('muško')}
        />
        <ChoiceCard
          label={copy.gender.female}
          selected={draft.gender === 'žensko'}
          onPress={() => void choose('žensko')}
        />
        <ChoiceCard
          label={copy.gender.unspecified}
          selected={draft.gender === 'drugo'}
          onPress={() => void choose('drugo')}
        />
      </View>
    </QuestionScreen>
  );
}

export function ProductStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();

  return (
    <QuestionScreen
      step="product"
      onBack={() => goBack('product')}
      cta={{
        label: copy.product.cta,
        disabled: !canAdvanceFrom('product'),
        onPress: () => void goNext('product'),
      }}
    >
      <Prompt title={copy.product.question} sub={copy.product.sub} />
      <View style={styles.stack}>
        {copy.product.options.map((option) => (
          <ChoiceCard
            key={option.key}
            label={option.label}
            sub={option.sub}
            selected={draft.product === option.key}
            onPress={() => void answer({ product: option.key })}
          />
        ))}
      </View>
    </QuestionScreen>
  );
}

export function CigarettesStep() {
  const { draft, answer, goNext, goBack, copyContext } = useOnboarding();
  const perDay = draft.cigarettesPerDay ?? copy.cigarettes.default;

  return (
    <QuestionScreen
      step="cigarettes"
      onBack={() => goBack('cigarettes')}
      cta={{ label: copy.cigarettes.cta, onPress: () => void goNext('cigarettes') }}
    >
      <Prompt title={copy.cigarettes.question(copyContext)} sub={copy.cigarettes.sub} />
      <Stepper
        value={perDay}
        unit={copy.cigarettes.unit(copyContext)}
        min={copy.cigarettes.min}
        max={copy.cigarettes.max}
        onChange={(next) => void answer({ cigarettesPerDay: next })}
      />
      <Text variant="caption" color="textMuted">
        {copy.cigarettes.note}
      </Text>
    </QuestionScreen>
  );
}

export function PriceStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();

  return (
    <QuestionScreen
      step="price"
      onBack={() => goBack('price')}
      cta={{
        label: copy.price.cta,
        disabled: !canAdvanceFrom('price'),
        onPress: () => void goNext('price'),
      }}
    >
      <Prompt title={copy.price.question} sub={copy.price.sub} />
      <NumberField
        value={draft.packPriceRsd ?? null}
        onChange={(next) => void answer({ packPriceRsd: next ?? undefined })}
        suffix={copy.price.currency}
        placeholder={String(copy.price.default)}
        accessibilityLabel={copy.price.question}
      />
      <Text variant="caption" color="textMuted">
        {copy.price.note}
      </Text>
    </QuestionScreen>
  );
}

export function ReasonsStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();
  const chosen = draft.reasons ?? [];
  const full = chosen.length >= MAX_REASONS;

  const toggle = (key: string) => {
    const next = chosen.includes(key) ? chosen.filter((item) => item !== key) : [...chosen, key];
    // Selection order is kept: it is the order the mirrors and the craving tool read back.
    void answer({ reasons: next.slice(0, MAX_REASONS) });
  };

  return (
    <QuestionScreen
      step="reasons"
      onBack={() => goBack('reasons')}
      cta={{
        label: copy.reasons.cta,
        disabled: !canAdvanceFrom('reasons'),
        onPress: () => void goNext('reasons'),
      }}
    >
      <Prompt title={copy.reasons.question} sub={copy.reasons.sub} />
      <View style={styles.pills}>
        {REASONS.map((reason) => (
          <ChoicePill
            key={reason.key}
            label={reason.label}
            glyph={REASON_GLYPHS[reason.key]}
            selected={chosen.includes(reason.key)}
            disabled={full && !chosen.includes(reason.key)}
            onPress={() => toggle(reason.key)}
          />
        ))}
      </View>
    </QuestionScreen>
  );
}

export function ReasonTextStep() {
  const { draft, answer, goNext, goBack } = useOnboarding();

  return (
    <QuestionScreen
      step="reasonText"
      onBack={() => goBack('reasonText')}
      cta={{ label: copy.reasonText.cta, onPress: () => void goNext('reasonText') }}
    >
      <Prompt title={copy.reasonText.question} sub={copy.reasonText.sub} />
      <TextArea
        value={draft.reasonText ?? ''}
        onChange={(text) => void answer({ reasonText: text })}
        placeholder={copy.reasonText.placeholder}
        accessibilityLabel={copy.reasonText.question}
      />
      <View style={styles.pills}>
        {copy.reasonText.chips.map((chip) => (
          <Pressable
            key={chip}
            haptic="light"
            accessibilityLabel={chip}
            onPress={() => void answer({ reasonText: chip })}
            style={styles.chip}
          >
            <Text variant="caption">{chip}</Text>
          </Pressable>
        ))}
      </View>
      <Text variant="caption" color="textMuted">
        {copy.reasonText.privacy}
      </Text>
    </QuestionScreen>
  );
}

export function FearsStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();
  const chosen = draft.fears ?? [];

  return (
    <QuestionScreen
      step="fears"
      onBack={() => goBack('fears')}
      cta={{
        label: copy.fears.cta,
        disabled: !canAdvanceFrom('fears'),
        onPress: () => void goNext('fears'),
      }}
    >
      <Prompt title={copy.fears.question} sub={copy.fears.sub} />
      <View style={styles.pills}>
        {FEARS.map((fear) => (
          <ChoicePill
            key={fear.key}
            label={fear.label}
            glyph={FEAR_GLYPHS[fear.key]}
            selected={chosen.includes(fear.key)}
            onPress={() =>
              void answer({
                fears: chosen.includes(fear.key)
                  ? chosen.filter((item) => item !== fear.key)
                  : [...chosen, fear.key],
              })
            }
          />
        ))}
      </View>
    </QuestionScreen>
  );
}

export function TriggersStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();
  const chosen = draft.triggers ?? [];

  return (
    <QuestionScreen
      step="triggers"
      onBack={() => goBack('triggers')}
      cta={{
        label: copy.triggers.cta,
        disabled: !canAdvanceFrom('triggers'),
        onPress: () => void goNext('triggers'),
      }}
    >
      <Prompt title={copy.triggers.question} sub={copy.triggers.sub} />
      <View style={styles.pills}>
        {TRIGGERS.map((trigger) => (
          <ChoicePill
            key={trigger.key}
            label={trigger.label}
            glyph={TRIGGER_GLYPHS[trigger.key as TriggerKey]}
            selected={chosen.includes(trigger.key)}
            onPress={() =>
              void answer({
                triggers: chosen.includes(trigger.key)
                  ? chosen.filter((item) => item !== trigger.key)
                  : [...chosen, trigger.key],
              })
            }
          />
        ))}
      </View>
    </QuestionScreen>
  );
}

export function TimingStep() {
  const { draft, answer, goNext, goBack, gender } = useOnboarding();
  const choose = async (key: string) => {
    await answer({ timing: key });
    await goNext('timing');
  };

  return (
    <QuestionScreen step="timing" onBack={() => goBack('timing')}>
      <Prompt title={copy.timing.question} sub={copy.timing.sub} />
      <View style={styles.stack}>
        {copy.timing.options(gender).map((option) => (
          <ChoiceCard
            key={option.key}
            label={option.label}
            sub={option.sub}
            selected={draft.timing === option.key}
            onPress={() => void choose(option.key)}
          />
        ))}
      </View>
    </QuestionScreen>
  );
}

export function DateStep() {
  const { draft, answer, goNext, goBack, canAdvanceFrom } = useOnboarding();
  const selected = draft.quitDate ? new Date(draft.quitDate) : null;

  const pick = (date: Date) => {
    // Local midnight of the chosen day, plus the zone it was chosen in. The day counter
    // counts calendar days in that zone, so travel never moves the number (M1).
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    void answer({
      quitDate: midnight.toISOString(),
      quitTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  return (
    <QuestionScreen
      step="date"
      onBack={() => goBack('date')}
      cta={{
        label: copy.date.cta,
        disabled: !canAdvanceFrom('date'),
        onPress: () => void goNext('date'),
      }}
    >
      <Prompt title={copy.date.question} sub={copy.date.sub} />
      <Calendar value={selected} onChange={pick} />
      <View style={{ gap: 2 }}>
        <Text variant="caption" color="textMuted">
          {copy.date.footnote}
        </Text>
        <Text variant="caption" color="textMuted" style={styles.citation}>
          {copy.date.citation}
        </Text>
      </View>
    </QuestionScreen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  field: {
    minHeight: minTarget + 8,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface,
    justifyContent: 'center',
  },
  fieldFocused: { borderColor: color.accent },
  input: {
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: textVariants.bodyLarge.fontSize,
    paddingVertical: space.sm,
  },
  chip: {
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.well,
    paddingHorizontal: space.sm,
    minHeight: minTarget,
    justifyContent: 'center',
  },
  citation: { fontStyle: 'italic' },
});
