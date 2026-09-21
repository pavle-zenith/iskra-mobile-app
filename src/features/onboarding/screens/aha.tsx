import { StyleSheet } from 'react-native';

import { Text } from '@/components/primitives';
import { color, space } from '@/theme';

import { FieldScreen, Plate, Prompt, ReflectionPlate } from '../components';
import {
  annualCostRsd,
  copy,
  costEquivalent,
  fearCard,
  formatRsd,
  joinSerbianList,
  reasonCard,
  REASONS,
} from '../copy';
import { useOnboarding } from '../OnboardingProvider';

/**
 * The ember-field screens: what the answers mean, read back.
 *
 * Reflection and FearReflection are true mirrors (brief section 7.1): one card per selected
 * option, in the order it was tapped, and nothing for what was not selected. Preview is
 * deliberately not a mirror; the same three cards go to everyone.
 */

function Eyebrow({ children }: { children: string }) {
  return (
    <Text variant="caption" style={styles.eyebrow}>
      {children}
    </Text>
  );
}

export function CostStep() {
  const { goNext, goBack, copyContext } = useOnboarding();
  const annual = annualCostRsd(copyContext);

  return (
    <FieldScreen
      step="cost"
      onBack={() => goBack('cost')}
      cta={{ label: copy.cost.cta, onPress: () => void goNext('cost') }}
    >
      <Eyebrow>{copy.cost.eyebrow}</Eyebrow>
      <Text variant="title" style={styles.onField}>
        {copy.cost.lead(copyContext)}
      </Text>

      <Plate style={styles.costPlate}>
        <Text variant="display" style={{ color: color.accent }}>
          {formatRsd(annual)}
        </Text>
        <Text variant="label" color="textMuted">
          {copy.cost.currency}
        </Text>
        <Text variant="body" color="textMuted">
          {costEquivalent(annual)}
        </Text>
      </Plate>

      <Text variant="bodyLarge" style={[styles.onField, styles.closing]}>
        {copy.cost.closing}
      </Text>
    </FieldScreen>
  );
}

export function ReflectionStep() {
  const { draft, goNext, goBack, copyContext } = useOnboarding();
  const chosen = draft.reasons ?? [];
  const header = joinSerbianList(
    chosen.map((key) => REASONS.find((reason) => reason.key === key)?.listLabel ?? key),
  );

  return (
    <FieldScreen
      step="reflection"
      onBack={() => goBack('reflection')}
      cta={{ label: copy.reflection.cta, onPress: () => void goNext('reflection') }}
    >
      <Eyebrow>{copy.reflection.eyebrow}</Eyebrow>
      <Prompt title={header} sub={copy.reflection.sub} field />
      {chosen.map((key) => {
        const card = reasonCard(key, copyContext);
        return card ? <ReflectionPlate key={key} card={card} /> : null;
      })}
    </FieldScreen>
  );
}

export function FearReflectionStep() {
  const { draft, goNext, goBack, gender } = useOnboarding();
  const chosen = draft.fears ?? [];

  return (
    <FieldScreen
      step="fearReflection"
      onBack={() => goBack('fearReflection')}
      cta={{ label: copy.fearReflection.cta(gender), onPress: () => void goNext('fearReflection') }}
    >
      <Prompt title={copy.fearReflection.header} sub={copy.fearReflection.sub} field />
      {chosen.map((key) => {
        const card = fearCard(key, gender);
        return card ? <ReflectionPlate key={key} card={card} /> : null;
      })}
    </FieldScreen>
  );
}

export function PreviewStep() {
  const { goNext, goBack, copyContext, gender } = useOnboarding();
  const annual = annualCostRsd(copyContext);

  return (
    <FieldScreen
      step="preview"
      onBack={() => goBack('preview')}
      cta={{ label: copy.preview.cta, onPress: () => void goNext('preview') }}
    >
      <Prompt title={copy.preview.header} sub={copy.preview.sub} field />

      <Plate style={styles.card}>
        <Text variant="title" style={{ color: color.accent }}>
          {formatRsd(annual)} {copy.cost.currency}
        </Text>
        <Text variant="body" color="textMuted">
          {copy.preview.savingsCaption}
        </Text>
        <Text variant="caption" color="textMuted">
          {costEquivalent(annual)}
        </Text>
      </Plate>

      <Plate style={styles.card}>
        <Text variant="title">{copy.preview.healthTitle}</Text>
        <Text variant="body" color="textMuted">
          {copy.preview.healthCaption(copyContext)}
        </Text>
      </Plate>

      <Plate style={styles.card}>
        <Text variant="title">{copy.preview.freedomTitle(gender)}</Text>
        <Text variant="body" color="textMuted">
          {copy.preview.freedomCaption}
        </Text>
      </Plate>
      {/* The export's testimonial is cut: there are no real users to quote (PRODUCT.md). */}
    </FieldScreen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: color.onField,
    opacity: 0.85,
    letterSpacing: 1.6,
  },
  onField: { color: color.onField },
  closing: { marginTop: space.xs },
  costPlate: { alignItems: 'center', gap: space.xxs, paddingVertical: space.lg },
  card: { gap: space.xxs },
});
