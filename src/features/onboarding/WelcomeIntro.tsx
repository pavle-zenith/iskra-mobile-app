import { useIsFocused, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Button, Pressable, Text } from '@/components/primitives';
import { hasConsented } from '@/data/repo';
import { color, minTarget, radius, space } from '@/theme';

import { copy } from './copy';

/**
 * The welcome intro (docs/WELCOME-brief.md): three beats before consent and step 1. Uncounted,
 * like the splash it replaces. Structure: .impeccable/review/welcome/REFERENCES.md.
 *
 * One painting fills the screen and is the screen's one texture. Its lower part falls into paper,
 * and the brand tile, the words and the button sit in one centred column on it (Pavle's
 * reference, 24.09.2026: Roots' welcome, in Iskra's paper). Every word sits on the solid end of
 * the fade, so no line's contrast depends on what the painting is doing behind it; the tile
 * carries its own ground and may sit higher, in the fade. The fade is sized to the text, not to a
 * fixed share of the screen, so a small phone or the largest Dynamic Type size never puts text
 * over art.
 *
 * Nothing moves forward on its own. The painting drifts, slowly; with Reduce Motion on it holds
 * still, changes instantly, and the text only fades.
 */

/** Bundled with require, so the intro renders offline on first launch. See assets/PROVENANCE.md. */
const ART: Record<(typeof copy.welcome.beats)[number]['art'], ImageSourcePropType> = {
  zora: require('@assets/welcome/welcome-1-zora.jpg'),
  oluja: require('@assets/welcome/welcome-2-oluja.jpg'),
  put: require('@assets/welcome/welcome-3-put.jpg'),
};

/**
 * Where each painting's subject is, as a fraction of its height, measured by eye on the
 * 1080 x 1910 files. All three put their landscape in the lower half, which is the half the paper
 * covers, so each is lifted until its subject sits low in the visible art (SUBJECT_AT), with its
 * sky kept above it. Zora: the sun on the ridge. Oluja: the horizon under the passing cloud. Put:
 * the walker, a few pixels high, kept clear of the fade, as the brief asks.
 */
const SUBJECT: Record<(typeof copy.welcome.beats)[number]['art'], number> = {
  zora: 0.52,
  oluja: 0.56,
  put: 0.53,
};

/** Where the subject lands, as a share of the visible art's height from the top. */
const SUBJECT_AT = 0.72;

const BEATS = copy.welcome.beats;
const LAST = BEATS.length - 1;

/**
 * How far above the text the painting starts falling into paper, and the curve it falls along
 * (share of the ramp, opacity). Eased rather than linear, so it reads as the light going and not
 * as a band laid over the art.
 */
const FADE_RAMP = 240;
const FADE_CURVE: readonly (readonly [number, number])[] = [
  [0, 0],
  [0.3, 0.28],
  [0.6, 0.7],
  [0.85, 0.94],
  [1, 1],
];
const CROSS_FADE_MS = 400;
const DRIFT_MS = 20_000;

/** Preskoči is a 36pt pill; this brings its target to 48. */
const SKIP_SLOP = { top: (minTarget - 36) / 2, bottom: (minTarget - 36) / 2 };

/** The flame is 140 x 275; the tile is the app icon's shape at welcome size. */
const TILE = 72;
const FLAME_HEIGHT = 38;

export function WelcomeIntro({ initialBeat = 0 }: { initialBeat?: number }) {
  const router = useRouter();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const pager = useRef<ScrollView>(null);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(LAST, initialBeat)));
  // Where the pager opens, fixed at mount. Never pass it `index`: iOS writes a changed
  // contentOffset straight onto the scroll view, and mid-animation that fought scrollTo and
  // carried one Dalje from beat 1 to beat 3.
  const [startOffset] = useState(() => ({ x: index * width, y: 0 }));
  // The beat a button is scrolling to. Until the pager arrives, its scroll events are the
  // animation passing through the beats in between, not someone swiping to them.
  const scrollingTo = useRef<number | null>(null);
  const [blockHeight, setBlockHeight] = useState(height * 0.45);
  // Where the words start inside the block: everything from here down sits on solid paper.
  const [textTop, setTextTop] = useState(TILE + space.lg);

  // The painting's slow drift, 1.00 to 1.06 and back, on the UI thread.
  const scale = useSharedValue(1);
  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(scale);
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withTiming(1.06, { duration: DRIFT_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(scale);
  }, [reduceMotion, scale]);
  const drift = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // With Reduce Motion the text does not slide when the button advances; it fades in instead.
  const textOpacity = useSharedValue(1);
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  const goTo = (next: number) => {
    const target = Math.max(0, Math.min(LAST, next));
    scrollingTo.current = target;
    pager.current?.scrollTo({ x: target * width, animated: !reduceMotion });
    if (reduceMotion) {
      // .set(), not .value =: the React Compiler treats hook results as immutable in handlers.
      textOpacity.set(0);
      textOpacity.set(withTiming(1, { duration: 250 }));
    }
    setIndex(target);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    if (scrollingTo.current !== null) {
      if (Math.abs(x - scrollingTo.current * width) < 1) scrollingTo.current = null;
      return;
    }
    const page = Math.round(x / width);
    if (page !== index && page >= 0 && page <= LAST) setIndex(page);
  };

  const start = async () => {
    // Consent before step 1: nothing is stored until it is given (docs/LEGAL-brief.md).
    if (await hasConsented()) {
      router.push({ pathname: '/onboarding/[step]', params: { step: 'name' } });
    } else {
      router.push('/onboarding/consent');
    }
  };

  const beat = BEATS[index] ?? BEATS[0];
  const fadeHeight = Math.min(height, Math.max(0, blockHeight - textTop) + FADE_RAMP);
  const rampShare = Math.min(1, FADE_RAMP / fadeHeight);
  // The art that stays visible runs from the top of the screen to halfway down the ramp.
  const visibleBottom = height - fadeHeight + FADE_RAMP / 2;
  const lift = (art: keyof typeof SUBJECT) =>
    // Never lower the painting (it would uncover the top), never lift it so far that bare paper
    // shows above the fade.
    Math.min(
      0,
      Math.max(visibleBottom - height, visibleBottom * SUBJECT_AT - SUBJECT[art] * height),
    );

  return (
    <View style={styles.screen}>
      {/* Light over the sky only while this is the screen in front. The intro stays mounted
          under everything pushed after it, and a light bar left behind was white on paper. */}
      <StatusBar style={focused ? 'light' : 'dark'} />

      <Animated.View style={[StyleSheet.absoluteFill, drift]} pointerEvents="none">
        {BEATS.map((item, position) => (
          <ArtLayer
            key={item.art}
            source={ART[item.art]}
            visible={position === index}
            instant={reduceMotion}
            top={lift(item.art)}
            width={width}
            height={height}
          />
        ))}
      </Animated.View>

      <Svg
        width={width}
        height={fadeHeight}
        style={[styles.fade, { height: fadeHeight }]}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="toPaper" x1="0" y1="0" x2="0" y2="1">
            {/* One flat list: react-native-svg reads a gradient's stops from an array. The ramp,
                then solid paper to the bottom. */}
            {[...FADE_CURVE.map(([at, opacity]) => [at * rampShare, opacity]), [1, 1]].map(
              ([offset, opacity], position) => (
                <Stop key={position} offset={offset} stopColor={color.bg} stopOpacity={opacity} />
              ),
            )}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={fadeHeight} fill="url(#toPaper)" />
      </Svg>

      {/* Skipping lands on beat 3 and never past it: that beat carries the promise that keeps
          someone through a slip. A paper pill, so it reads over any sky. */}
      {index < LAST ? (
        <View style={[styles.top, { paddingTop: insets.top + space.sm }]}>
          <Pressable
            onPress={() => goTo(LAST)}
            accessibilityLabel={copy.welcome.skip}
            // The pill is drawn 36 tall; the slop keeps the target at the 48 floor.
            hitSlop={SKIP_SLOP}
            style={styles.skip}
          >
            <Text variant="bodyStrong">{copy.welcome.skip}</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        style={[styles.block, { maxHeight: height - insets.top - minTarget - space.lg }]}
        contentContainerStyle={styles.blockContent}
        onLayout={(event) => setBlockHeight(event.nativeEvent.layout.height)}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* The brand, as its app icon: white flame on ember, which is an icon and so allowed. It
            stays put while the words page beneath it. */}
        <View
          style={styles.tile}
          accessible
          accessibilityRole="image"
          accessibilityLabel={copy.welcome.wordmark}
        >
          <Image
            source={require('@assets/brand/iskra-flame-white.png')}
            style={styles.flame}
            resizeMode="contain"
          />
        </View>

        <Animated.View
          style={textStyle}
          onLayout={(event) => setTextTop(event.nativeEvent.layout.y)}
        >
          <ScrollView
            ref={pager}
            horizontal
            pagingEnabled
            contentOffset={startOffset}
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            // A finger taking over mid-animation is a swipe again.
            onScrollBeginDrag={() => {
              scrollingTo.current = null;
            }}
            scrollEventThrottle={16}
          >
            {BEATS.map((item) => (
              <View key={item.art} style={[styles.page, { width }]}>
                <Text
                  variant="title"
                  color="text"
                  accessibilityRole="header"
                  style={[styles.centred, styles.headline]}
                >
                  {item.headline[0]}
                  {'\n'}
                  {/* Ember on paper is 3.1:1, allowed from 24pt: this is 28. */}
                  <Text variant="title" style={[styles.headline, styles.ember]}>
                    {item.headline[1]}
                  </Text>
                </Text>
                <Text variant="body" color="textSoft" style={styles.centred}>
                  {item.sub}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
          <Dots count={BEATS.length} active={index} />
          <Button
            label={beat.cta}
            onPress={() => (index < LAST ? goTo(index + 1) : void start())}
          />
          {/* "Već imaš nalog? Prijavi se" belongs under this button on beat 1. It renders once
              docs/ACCOUNT-brief.md's sign-in exists: a link that leads nowhere is not shown. */}
        </View>
      </ScrollView>
    </View>
  );
}

/** One painting. They are stacked and cross-fade; only the current one is opaque. */
function ArtLayer({
  source,
  visible,
  instant,
  top,
  width,
  height,
}: {
  source: ImageSourcePropType;
  visible: boolean;
  instant: boolean;
  /** How far the painting is lifted, so its subject clears the fade. Zero or negative. */
  top: number;
  width: number;
  height: number;
}) {
  const opacity = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: instant ? 0 : CROSS_FADE_MS });
  }, [visible, instant, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Image
      source={source}
      resizeMode="cover"
      // Width is explicit: without it the image takes its intrinsic 1080pt width despite left and
      // right, and a 402pt screen shows only its left third at 2.7x, with every subject off-screen.
      style={[styles.art, { top, width, height }, style]}
      accessible={false}
    />
  );
}

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no">
      {Array.from({ length: count }, (_, position) => (
        <View key={position} style={[styles.dot, position === active ? styles.dotOn : null]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  art: { position: 'absolute', left: 0 },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space.gutter,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skip: {
    backgroundColor: color.surface,
    borderRadius: 999,
    paddingHorizontal: space.md,
    minHeight: 36,
    justifyContent: 'center',
  },
  block: { position: 'absolute', left: 0, right: 0, bottom: 0, flexGrow: 0 },
  blockContent: { flexGrow: 1, justifyContent: 'flex-end' },
  tile: {
    alignSelf: 'center',
    width: TILE,
    height: TILE,
    borderRadius: radius.card,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.lg,
  },
  flame: { width: Math.round((FLAME_HEIGHT * 140) / 275), height: FLAME_HEIGHT },
  // Top-aligned: the pager is as tall as its tallest beat, and the headline belongs right under
  // the tile. A shorter beat's slack goes above the button, not between the tile and the words.
  page: { paddingHorizontal: space.gutter, gap: space.sm },
  centred: { textAlign: 'center' },
  /**
   * `title` (28pt), not `display`: at 28 each sentence of beats 1 and 2 holds one line on a
   * 402pt phone, and the ember sentence is never broken in two. 32 (1.14) is as tight as
   * typography.ts lets a headline go: Host Grotesk draws Š, Č and Ž to 0.92 of the size.
   */
  headline: { lineHeight: 32 },
  ember: { color: color.accent },
  actions: { paddingHorizontal: space.gutter, paddingTop: space.lg, gap: space.md },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.line },
  dotOn: { width: 22, backgroundColor: color.accent },
});
