import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Share, type LucideIcon } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Pressable, Text } from '@/components/primitives';
import { Card } from '@/features/home/components';
import { color, minTarget, radius, space } from '@/theme';

import { progressCopy } from './copy';
import { loadProgressSource, type ProgressSource } from './data';

/** The export's boxed header buttons: 44 drawn, 48 to touch through the slop. */
const BOX = 44;
const BOX_SLOP = (minTarget - BOX) / 2;

/**
 * The frame the export gives all four progress screens (MoneyScreen, CigarettesScreen, TimeScreen,
 * CategoryScreen): a boxed back button on the left, the title centred, a share button on the
 * right, then one scrolling column of cards on paper.
 *
 * The share button is not drawn until M5's share card exists (docs/M4-brief.md): a button that
 * leads nowhere is not shown. An empty box of the same size keeps the title centred.
 */
export function DetailScreen({
  title,
  right,
  children,
}: {
  title?: string;
  /** What sits where the export's share button is. Zdravlje puts its countdown pill here. */
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scroller = useRef<ScrollView>(null);
  // Dev builds only: `?scroll=end` opens a screen at its bottom, so a script can photograph the
  // cards below the fold. A simulator cannot be scrolled from a shell.
  const { scroll } = useLocalSearchParams<{ scroll?: string }>();
  const toEnd = __DEV__ && scroll === 'end';

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + space.xs }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel={progressCopy.back}
          hitSlop={BOX_SLOP}
          style={styles.boxButton}
        >
          <Icon as={ChevronLeft} size={22} color={color.textMuted} />
        </Pressable>
        {title ? (
          <Text
            variant="bodyStrong"
            accessibilityRole="header"
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View style={styles.title} />
        )}
        {right ?? <View style={styles.boxSpacer} />}
      </View>

      <ScrollView
        ref={scroller}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xl }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={
          toEnd ? () => scroller.current?.scrollToEnd({ animated: false }) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
}

/** The export's share box, top right of the header, the same size as the back box. */
export function ShareBox({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      hitSlop={BOX_SLOP}
      style={styles.boxButton}
    >
      <Icon as={Share} size={20} color={color.textMuted} />
    </Pressable>
  );
}

/** "Podeli svoju pobedu", the export's outlined button at the foot of each progress screen. */
export function ShareButton({ label, onPress }: { label: string; onPress: () => void }) {
  return <Button variant="secondary" icon={Share} label={label} onPress={onPress} />;
}

/** The export's hero: a glyph, the big number, its label, and the period line under them. */
export function Hero({
  icon,
  iconColor,
  value,
  unit,
  label,
  period,
  tone,
}: {
  icon: LucideIcon;
  iconColor: string;
  value: string;
  /** "RSD", set beside the number on its baseline, as the export does. */
  unit?: string;
  label?: string;
  period?: string | null;
  tone: string;
}) {
  return (
    <View
      style={styles.hero}
      accessible
      accessibilityLabel={[value, unit, label, period].filter(Boolean).join(' ')}
    >
      <Icon as={icon} size={40} color={iconColor} />
      <View style={styles.heroFigure}>
        <Text variant="display" style={[styles.heroValue, { color: tone }]}>
          {value}
        </Text>
        {unit ? (
          <Text variant="heading" style={{ color: tone }}>
            {unit}
          </Text>
        ) : null}
      </View>
      {label ? (
        <Text variant="label" style={[styles.centred, { color: tone }]}>
          {label}
        </Text>
      ) : null}
      {period ? (
        <Text variant="body" color="textMuted" style={styles.centred}>
          {period}
        </Text>
      ) : null}
    </View>
  );
}

/** A white card with the export's small title. */
export function Section({
  title,
  children,
  style,
}: {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Card style={[styles.section, style]}>
      {title ? <Text variant="bodyStrong">{title}</Text> : null}
      {children}
    </Card>
  );
}

/** "Ako nastaviš" rows: the figure on the left in the screen's colour, the period on the right. */
export function FigureRow({
  value,
  label,
  tone,
  first,
}: {
  value: string;
  label: string;
  tone: string;
  first: boolean;
}) {
  return (
    <View style={[styles.figureRow, first ? null : styles.rule]}>
      <Text variant="label" style={[styles.grow, { color: tone }]}>
        {value}
      </Text>
      <Text variant="body" color="textMuted">
        {label}
      </Text>
    </View>
  );
}

/** The cross-link card between Ušteđevina and Odbijene cigarete: glyph, line, figure, chevron. */
export function LinkCard({
  icon,
  tone,
  label,
  value,
  onPress,
}: {
  icon: LucideIcon;
  tone: string;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${label} ${value}`} style={styles.link}>
      <Icon as={icon} size={24} color={tone} />
      <View style={styles.grow}>
        <Text variant="caption" color="textMuted">
          {label}
        </Text>
        <Text variant="label" style={{ color: tone }}>
          {value}
        </Text>
      </View>
      <Icon as={ChevronRight} size={20} color={color.textMuted} />
    </Card>
  );
}

export function Bar({ fraction, tone }: { fraction: number; tone: string }) {
  const share = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  return (
    <View style={styles.track} accessibilityElementsHidden importantForAccessibility="no">
      <View style={[styles.fill, { width: `${share}%`, backgroundColor: tone }]} />
    </View>
  );
}

export function FinePrint({ children }: { children: string }) {
  return (
    <Text variant="caption" color="textMuted" style={styles.finePrint}>
      {children}
    </Text>
  );
}

/**
 * The profile and slips, read from SQLite on focus and on return to the foreground, and `now`
 * ticking at the screen's own pace. The figures themselves come from the engine.
 */
export function useProgressSource(tickMs: number): { source: ProgressSource | null; now: Date } {
  const [source, setSource] = useState<ProgressSource | null>(null);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async (alive: () => boolean) => {
    const next = await loadProgressSource();
    if (!alive()) return;
    setSource(next);
    setNow(new Date());
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void load(() => alive);
      return () => {
        alive = false;
      };
    }, [load]),
  );

  useEffect(() => {
    let alive = true;
    const subscription = AppState.addEventListener('change', (next) => {
      if (next === 'active') void load(() => alive);
    });
    const timer = setInterval(() => setNow(new Date()), tickMs);
    return () => {
      alive = false;
      subscription.remove();
      clearInterval(timer);
    };
  }, [load, tickMs]);

  return { source, now };
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.gutter,
    paddingBottom: space.xs,
    gap: space.sm,
  },
  boxButton: {
    width: BOX,
    height: BOX,
    minHeight: BOX,
    minWidth: BOX,
    borderRadius: radius.control - 3,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxSpacer: { width: BOX, height: BOX },
  title: { flex: 1, textAlign: 'center' },
  content: { paddingHorizontal: space.gutter, paddingTop: space.xs, gap: space.sm },
  hero: { alignItems: 'center', gap: space.xs, paddingTop: space.md, paddingBottom: space.lg },
  heroFigure: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.xs,
    marginTop: space.xs,
  },
  heroValue: { fontVariant: ['tabular-nums'] },
  centred: { textAlign: 'center' },
  grow: { flex: 1 },
  section: { gap: space.sm },
  figureRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  rule: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
  link: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: color.well,
  },
  fill: { height: '100%', borderRadius: 3 },
  finePrint: { marginTop: space.xs },
});
