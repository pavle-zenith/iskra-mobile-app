import { Banknote, Clock, Flame, HeartPulse } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedControl, type Segment } from '@/components/SegmentedControl';
import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { porivTools, type PorivTool } from '@/features/poriv/tools';
import { color, progressColor, radius, space, toolColor, type ProgressKey } from '@/theme';

/**
 * M0 acceptance screen: "Šta te tačno vraća cigareti?" in Host Grotesk on paper,
 * installed on a real iPhone and a real Android.
 *
 * It doubles as the foundations specimen: the type ramp, every colour family, the
 * primitives, the site's tool cards and segmented control, and š č ž ć đ in both faces.
 * This is NOT the home screen. The home screen leads with a different thing in each
 * user state (PRODUCT.md) and is designed in M3.
 *
 * Every Serbian string below is lifted verbatim from iskraclub.com or PRODUCT.md.
 */

const FOOTER_HEIGHT = 60 + space.sm * 2;

/**
 * Above this text scale a tool card stacks its badge over the label. Side by side, the
 * label gets ~91pt on a 375pt phone, and "Odlažem" outgrows that at 1.26x, which would
 * break it mid-word.
 */
const STACK_CARD_ABOVE_FONT_SCALE = 1.2;

const PROGRESS_SEGMENTS: readonly Segment<ProgressKey>[] = [
  {
    key: 'money',
    label: 'Novac',
    icon: Banknote,
    selectedColor: progressColor.money.base,
    iconColor: progressColor.money.deep,
  },
  {
    key: 'health',
    label: 'Zdravlje',
    icon: HeartPulse,
    selectedColor: progressColor.health.base,
    iconColor: progressColor.health.deep,
  },
  {
    key: 'time',
    label: 'Vreme',
    icon: Clock,
    selectedColor: progressColor.time.base,
    iconColor: progressColor.time.deep,
  },
];

export default function FoundationsScreen() {
  const insets = useSafeAreaInsets();
  const [progressTab, setProgressTab] = useState<ProgressKey>('money');
  const footerInset = Math.max(insets.bottom, space.sm);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + space.sm,
          paddingBottom: FOOTER_HEIGHT + footerInset + space.xl,
          paddingHorizontal: space.gutter,
        }}
      >
        <BrandLockup />

        <Text variant="display" style={styles.question}>
          Šta te tačno vraća cigareti?
        </Text>
        <Text variant="bodyLarge" color="textSoft" style={styles.lede}>
          Jutarnja kafa, pauza na poslu, kafana, stres i ona misao: „samo jednu“. Cigareta se retko
          pojavi sama od sebe. Pojavi se u trenutku koji već znaš napamet.
        </Text>

        {/* Line break as on iskraclub.com's tools section. */}
        <Text variant="heading" style={styles.sectionHeading}>
          Šest alata za trenutak{'\n'}kad ti se najviše puši.
        </Text>
        <View style={styles.toolGrid}>
          {porivTools.map((tool) => (
            <ToolCard key={tool.key} tool={tool} />
          ))}
        </View>

        <Text variant="heading" style={styles.sectionHeading}>
          Gledaj kako napreduješ.{'\n'}
          <Text variant="heading" color="accent">
            Tvoja pakla, tvoje brojke.
          </Text>
        </Text>
        <SegmentedControl
          segments={PROGRESS_SEGMENTS}
          value={progressTab}
          onChange={setProgressTab}
          style={styles.segmented}
        />
      </ScrollView>

      {/* Paper behind the status bar, so scrolled text never runs under the clock. */}
      <View style={[styles.statusScrim, { height: insets.top }]} />

      <View style={[styles.footer, { paddingBottom: footerInset }]}>
        <Button label="Imam poriv" icon={Flame} haptic="medium" />
      </View>
    </View>
  );
}

function BrandLockup() {
  return (
    <View style={styles.lockup} accessible accessibilityRole="image" accessibilityLabel="Iskra">
      <View style={styles.markTile}>
        <Image
          source={require('@assets/brand/iskra-flame-white.png')}
          style={styles.flame}
          resizeMode="contain"
        />
      </View>
      <Text variant="heading" style={styles.wordmark} accessibilityRole="none">
        ISKRA
      </Text>
    </View>
  );
}

/**
 * The site's tool card at phone size: the tool's painted panel inset in a white card,
 * then its glyph on the tool tint beside the one-word label. The glyph is supplementary
 * (the label names the tool), so razlozi's 2.78:1 glyph on tint follows the site.
 */
function ToolCard({ tool }: { tool: PorivTool }) {
  const { color: toolTone, tint } = toolColor[tool.key];
  const stacked = useWindowDimensions().fontScale > STACK_CARD_ABOVE_FONT_SCALE;

  return (
    <Pressable haptic="light" accessibilityLabel={tool.label} style={styles.card}>
      <Image source={tool.texture} style={styles.texture} resizeMode="cover" />
      <View style={[styles.cardLabelRow, stacked && styles.cardLabelStacked]}>
        <View style={[styles.badge, { backgroundColor: tint }]}>
          <Icon as={tool.icon} size={20} color={toolTone} />
        </View>
        <Text variant="label" numberOfLines={2} style={styles.cardLabel}>
          {tool.label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bg,
  },
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm - 2,
    alignSelf: 'flex-start',
    minHeight: 48,
  },
  markTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flame: {
    width: 12,
    height: 22,
  },
  wordmark: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.6,
  },
  question: {
    marginTop: space.xl + space.xs,
  },
  lede: {
    marginTop: space.md,
  },
  sectionHeading: {
    marginTop: space.xxl,
  },
  toolGrid: {
    marginTop: space.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  card: {
    flexGrow: 1,
    flexBasis: '40%',
    padding: 6,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  texture: {
    width: '100%',
    height: 84,
    borderRadius: radius.card - 6,
    backgroundColor: color.well,
  },
  // Fills the rest of the card, so cards stretched by a neighbour's two-line label
  // still share one label centre line with it.
  cardLabelRow: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    paddingHorizontal: 6,
    paddingTop: space.sm,
    paddingBottom: 6,
  },
  cardLabelStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    flexShrink: 1,
  },
  segmented: {
    marginTop: space.md,
  },
  statusScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: color.bg,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: space.sm,
    paddingHorizontal: space.gutter,
    backgroundColor: color.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.line,
  },
});
