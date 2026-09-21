import { useRouter } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import { copy } from '@/features/onboarding/copy';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { color, space } from '@/theme';

/**
 * Splash: one promise, then start. Uncounted, so no progress bar.
 * The export flags its own splash as a concept sketch; this is the brief's copy on the
 * ember field, with no account link, because there are no accounts to log in to.
 */
export default function OnboardingSplash() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { gender } = useOnboarding();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.xl }]}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <Image
            source={require('@assets/brand/iskra-flame-white.png')}
            style={styles.flame}
            resizeMode="contain"
          />
        </View>
        <Text variant="heading" style={styles.wordmark}>
          {copy.splash.wordmark}
        </Text>
      </View>

      <View style={styles.lines}>
        <Text variant="display" style={styles.line}>
          {copy.splash.line1}
        </Text>
        <Text variant="display" style={styles.line}>
          {copy.splash.line2(gender)}
        </Text>
      </View>

      <View style={{ paddingBottom: Math.max(insets.bottom, space.sm) }}>
        <Button
          variant="onField"
          label={copy.splash.cta}
          onPress={() => router.push({ pathname: '/onboarding/[step]', params: { step: 'name' } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.field,
    paddingHorizontal: space.gutter,
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm - 2 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flame: { width: 12, height: 22 },
  wordmark: { color: color.onField, fontSize: 20, lineHeight: 24, letterSpacing: 0.6 },
  lines: { gap: space.xs, paddingBottom: space.xxl },
  line: { color: color.onField },
});
