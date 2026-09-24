import * as Sharing from 'expo-sharing';
import { useCallback, useRef, useState } from 'react';
import { Image, PixelRatio, Platform, StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Text } from '@/components/primitives';
import { markMilestoneShared } from '@/data/repo';
import { copy as onboardingCopy } from '@/features/onboarding/copy';
import { color, radius, space } from '@/theme';

/**
 * The share image: the export's `Iskra Share Card.html` (docs/M5-brief.md 1b and Export
 * alignment 4), a 9:16 story card. The sky under a warm paper wash, the flame and the wordmark
 * at the top, the person's own number in the middle, iskraclub.com at the foot.
 *
 * Only their own number. The export's tagline ("Nije bilo lako. Bilo je vredno.") is invented and
 * cut, and its footer's domain is not Iskra's. No name unless they add it, and nothing leaves the
 * phone but the image, through the system share sheet.
 */

export type ShareContent = {
  /** The figure, first line in ink: "Prva nedelja", "14.087 RSD", a Misao dana line. */
  title: string;
  /** The second line in ember: "bez cigarete", "ušteđeno". */
  sub?: string;
  /** A goal's key, so its row is marked shared once the sheet has opened. */
  milestoneKey?: string;
};

/** Laid out at 360 x 640 and captured at 3x: 1080 x 1920, the story size. */
const WIDTH = 360;
const HEIGHT = 640;
const SITE = 'iskraclub.com';

/** A short figure at display size; a sentence (a health item, a daily line) one step down. */
const sizeFor = (line: string) => (line.length > 24 ? 'title' : 'display');

/** The sky and the flame. The card is captured only once both have drawn. */
const IMAGES = 2;

function Card({ content, onImage }: { content: ShareContent; onImage: () => void }) {
  return (
    <View style={styles.card}>
      <Image
        source={require('@assets/napredak/sky-hero.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        onLoadEnd={onImage}
      />
      <View style={styles.wash} />
      <View style={styles.brand}>
        <View style={styles.tile}>
          <Image
            source={require('@assets/brand/iskra-flame-white.png')}
            style={styles.flame}
            resizeMode="contain"
            onLoadEnd={onImage}
          />
        </View>
        <Text variant="label" style={styles.wordmark} allowFontScaling={false}>
          {onboardingCopy.welcome.wordmark}
        </Text>
      </View>
      <View style={styles.content}>
        <Text variant={sizeFor(content.title)} style={styles.title} allowFontScaling={false}>
          {content.title}
        </Text>
        {content.sub ? (
          <Text
            variant={sizeFor(content.sub)}
            style={[styles.title, styles.sub]}
            allowFontScaling={false}
          >
            {content.sub}
          </Text>
        ) : null}
      </View>
      <Text variant="caption" color="textMuted" style={styles.footer} allowFontScaling={false}>
        {SITE}
      </Text>
    </View>
  );
}

/**
 * `share(content)` renders the card off screen, captures it and opens the share sheet. Render
 * `host` anywhere in the screen: it is the off-screen stage the card is drawn on.
 */
export function useShareCard(): { share: (content: ShareContent) => void; host: React.ReactNode } {
  const [content, setContent] = useState<ShareContent | null>(null);
  const stage = useRef<View>(null);
  const loaded = useRef(0);
  const capturing = useRef(false);

  const capture = useCallback(async () => {
    if (!content || !stage.current || capturing.current) return;
    capturing.current = true;
    try {
      // view-shot reads the size in pixels on Android and in points on iOS, where it renders
      // at the screen's scale: without this an iPhone writes a 3240 x 5760 image.
      const unit = Platform.OS === 'ios' ? PixelRatio.get() : 1;
      const uri = await captureRef(stage, {
        format: 'png',
        width: (WIDTH * 3) / unit,
        height: (HEIGHT * 3) / unit,
        result: 'tmpfile',
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
        if (content.milestoneKey) await markMilestoneShared(content.milestoneKey);
      }
    } finally {
      capturing.current = false;
      setContent(null);
    }
  }, [content]);

  // Images load after layout: capturing on layout drew the card without the sky or the flame.
  // The frame after the last one loads is the first that has both on it.
  const onImage = useCallback(() => {
    loaded.current += 1;
    if (loaded.current === IMAGES) requestAnimationFrame(() => void capture());
  }, [capture]);

  const share = useCallback((next: ShareContent) => {
    if (capturing.current) return;
    loaded.current = 0;
    setContent(next);
  }, []);

  const host = content ? (
    <View
      ref={stage}
      collapsable={false}
      style={styles.stage}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Card content={content} onImage={onImage} />
    </View>
  ) : null;

  return { share, host };
}

const styles = StyleSheet.create({
  // Off screen, but laid out, so it can be captured.
  stage: { position: 'absolute', left: -WIDTH * 4, top: 0, width: WIDTH, height: HEIGHT },
  card: { width: WIDTH, height: HEIGHT, overflow: 'hidden', backgroundColor: color.bg },
  wash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: color.bg,
    opacity: 0.7,
  },
  brand: { position: 'absolute', top: 24, left: 0, right: 0, alignItems: 'center', gap: space.xs },
  tile: {
    width: 44,
    height: 44,
    borderRadius: radius.control,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flame: { width: 12, height: 24 },
  wordmark: { letterSpacing: 4 },
  content: {
    position: 'absolute',
    top: HEIGHT * 0.2,
    left: 0,
    right: 0,
    height: HEIGHT * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
  },
  title: { textAlign: 'center' },
  sub: { color: color.accent },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    textAlign: 'center',
    letterSpacing: 3,
  },
});
