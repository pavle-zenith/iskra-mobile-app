import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { recordConsent } from '@/data/repo';
import { startAccountServices } from '@/data/spine';
import { copy as onboardingCopy } from '@/features/onboarding/copy';
import { color, minTarget, space } from '@/theme';

import { CheckRow } from './CheckRow';
import { canAccept, INITIAL_CHOICES, type ConsentChoices } from './consent';
import { consent, legalLinks } from './copy';
import { openLegal } from './links';

/**
 * "Pre nego što počnemo": consent before the first stored row (docs/LEGAL-brief.md Task 1).
 *
 * Onboarding writes every answer the moment it is given, so this sits before step 1. Until the
 * button is pressed nothing is written to SQLite or the outbox and no anonymous sign-in happens;
 * pressing it writes the consent itself, which is the first row the app ever stores, and only
 * then starts sign-in and sync.
 *
 * Structure: .impeccable/review/consent/REFERENCES.md (Ada, Flo, World App).
 */
export function ConsentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [choices, setChoices] = useState<ConsentChoices>(INITIAL_CHOICES);
  const [saving, setSaving] = useState(false);
  // A ref too: two taps in one frame both pass a state flag.
  const savingRef = useRef(false);

  const toggle = (key: keyof ConsentChoices) =>
    setChoices((current) => ({ ...current, [key]: !current[key] }));

  const accept = async () => {
    if (!canAccept(choices) || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      await recordConsent({ analytics: choices.analytics });
      startAccountServices();
      // The gate decides where to go: step 1 for someone new, Home for someone who had already
      // finished onboarding before consent existed.
      router.replace('/');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top + space.xs, paddingHorizontal: space.gutter }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={onboardingCopy.back}
          hitSlop={space.xs}
          style={styles.back}
        >
          <Icon as={ChevronLeft} size={26} color={color.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text variant="title" accessibilityRole="header">
          {consent.title}
        </Text>
        <Text variant="body" color="textSoft">
          {consent.body}
        </Text>

        <View style={styles.boxes}>
          <CheckRow label={consent.age} checked={choices.age} onToggle={() => toggle('age')} />
          <CheckRow label={consent.data} checked={choices.data} onToggle={() => toggle('data')} />
          <CheckRow
            label={consent.analytics}
            checked={choices.analytics}
            onToggle={() => toggle('analytics')}
          />
        </View>

        <View style={styles.links}>
          <Pressable
            onPress={() => openLegal('privacy')}
            accessibilityRole="link"
            accessibilityLabel={legalLinks.privacy}
            feedback="none"
            style={styles.link}
          >
            <Text variant="bodyStrong" style={styles.linkText}>
              {legalLinks.privacy}
            </Text>
          </Pressable>
          <Text variant="body" color="textMuted" accessibilityElementsHidden>
            ·
          </Text>
          <Pressable
            onPress={() => openLegal('terms')}
            accessibilityRole="link"
            accessibilityLabel={legalLinks.terms}
            feedback="none"
            style={styles.link}
          >
            <Text variant="bodyStrong" style={styles.linkText}>
              {legalLinks.terms}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        <Button
          label={consent.cta}
          disabled={!canAccept(choices) || saving}
          onPress={() => void accept()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  back: {
    width: minTarget,
    height: minTarget,
    justifyContent: 'center',
    marginLeft: -space.sm,
  },
  content: {
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    paddingBottom: space.xl,
    gap: space.md,
  },
  boxes: { marginTop: space.xs },
  links: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.xs },
  link: { minHeight: minTarget, justifyContent: 'center' },
  linkText: { color: color.text, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.sm },
});
