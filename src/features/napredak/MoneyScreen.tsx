import { useRouter } from 'expo-router';
import {
  CigaretteOff,
  Coffee,
  Coins,
  Dumbbell,
  Fuel,
  House,
  Laptop,
  Plane,
  Ticket,
  Trophy,
  Utensils,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Icon, Text } from '@/components/primitives';
import { equivalents, formatNumber, savingsSeries, type EquivalentIcon } from '@/lib/progress';
import { color, progressColor, space } from '@/theme';

import {
  Bar,
  DetailScreen,
  FigureRow,
  FinePrint,
  Hero,
  LinkCard,
  Section,
  ShareBox,
  ShareButton,
  styles as shared,
  useProgressSource,
} from './components';
import { useShareCard } from '@/features/share/ShareCard';

import { progressCopy } from './copy';
import { progressFor, progressInputFor } from './data';

/**
 * Ušteđevina, the export's MoneyScreen (docs/M4-brief.md Task 1), in its order: hero, the savings
 * chart, "Ako nastaviš", "To je kao...", the next goal, the link to Odbijene cigarete, share, fine
 * print. What changed from the export, and why, is in `.impeccable/review/m4/REFERENCES.md`.
 *
 * Colours are the export's mapped to the nearest token: its green is `money` exactly, its gold
 * coin and its ember goal are ember, and the cigarette link's red is Odbijene cigarete's violet,
 * because `negative` is never pointed at the user.
 */

const EQUIVALENT_GLYPHS: Record<EquivalentIcon, LucideIcon> = {
  coffee: Coffee,
  ticket: Ticket,
  utensils: Utensils,
  dumbbell: Dumbbell,
  fuel: Fuel,
  house: House,
  laptop: Laptop,
  plane: Plane,
};

const TICK_MS = 60_000;
const DAY_MS = 86_400_000;

export function MoneyScreen() {
  const router = useRouter();
  const { source, now } = useProgressSource(TICK_MS);
  const { share, host } = useShareCard();
  const copy = progressCopy.money;
  const money = progressColor.money;

  if (!source) return <DetailScreen title={copy.title}>{null}</DetailScreen>;

  const progress = progressFor(source.profile, source.slips, now);
  const series = savingsSeries(progressInputFor(source.profile, source.slips, now));
  const rows = equivalents(progress.rsdSaved).filter((row) => row.count > 0);
  const goal = progress.nextMoneyThreshold;
  const perDay = source.profile?.cigarettesPerDay;
  const price = source.profile?.packPriceRsd;

  const shareIt = () => share({ title: copy.rsd(progress.rsdSaved), sub: copy.shareSub });
  return (
    <DetailScreen title={copy.title} right={<ShareBox label={copy.share} onPress={shareIt} />}>
      <Hero
        icon={Coins}
        iconColor={color.accent}
        value={formatNumber(progress.rsdSaved)}
        unit={copy.heroUnit}
        period={progress.smokeFreeDays > 0 ? copy.period(progress.smokeFreeDays) : null}
        tone={money.base}
      />

      {/* Before a whole day has passed, "Dan 1" and "Danas" are the same day: no chart yet. */}
      {progress.smokeFreeMs >= DAY_MS && series.length > 1 ? (
        <Section title={copy.chartTitle}>
          <SavingsChart points={series} />
          <View style={styles.axis}>
            <Text variant="caption" color="textMuted">
              {copy.axisStart}
            </Text>
            <Text variant="caption" color="textMuted">
              {copy.axisEnd}
            </Text>
          </View>
        </Section>
      ) : null}

      {progress.dailyCostRsd > 0 ? (
        <Section title={copy.projectionTitle}>
          <View>
            {[
              [progress.dailyCostRsd, copy.per.day],
              [progress.next7DaysRsd, copy.per.week],
              [progress.next30DaysRsd, copy.per.month],
              [progress.nextYearRsd, copy.per.year],
            ].map(([amount, label], index) => (
              <FigureRow
                key={String(label)}
                value={copy.rsd(Number(amount))}
                label={String(label)}
                tone={money.base}
                first={index === 0}
              />
            ))}
          </View>
          {perDay && price ? (
            <Text variant="caption" color="textMuted">
              {copy.basis(perDay, price)}
            </Text>
          ) : null}
          {/* "Promeni" opens habits in Profil, which arrives with M5. Until then it is not shown. */}
        </Section>
      ) : null}

      {rows.length > 0 ? (
        <Section title={copy.equivalentsTitle}>
          <View>
            {rows.map((row, index) => (
              <View key={row.icon} style={[styles.equivalent, index > 0 ? shared.rule : null]}>
                <Icon as={EQUIVALENT_GLYPHS[row.icon]} size={20} color={money.base} />
                <Text variant="body" color="textSoft" style={shared.grow}>
                  {`${formatNumber(row.count)} ${row.label}`}
                </Text>
              </View>
            ))}
          </View>
          <Text variant="caption" color="textMuted">
            {copy.equivalentsNote}
          </Text>
        </Section>
      ) : null}

      <Section>
        <View style={styles.goal}>
          <Icon as={Trophy} size={24} color={color.accent} />
          <View style={shared.grow}>
            <Text variant="bodyStrong">{copy.nextGoal(goal.target)}</Text>
            <Text variant="caption" color="textMuted">
              {copy.remaining(goal.remaining)}
            </Text>
          </View>
        </View>
        <Bar fraction={goal.fraction} tone={color.accent} />
      </Section>

      {progress.cigarettesNotSmoked > 0 ? (
        <LinkCard
          icon={CigaretteOff}
          tone={progressColor.time.base}
          label={copy.cigarettesLink}
          value={copy.cigarettesCount(progress.cigarettesNotSmoked)}
          onPress={() => router.push('/napredak/cigarete')}
        />
      ) : null}

      <ShareButton label={copy.share} onPress={shareIt} />

      <FinePrint>{copy.finePrint}</FinePrint>
      {host}
    </DetailScreen>
  );
}

/**
 * The real series, point to point: a straight rise that steps down where a slip was logged. No
 * smoothing, no invented curve. The last point is the hero figure.
 */
function SavingsChart({ points }: { points: { atMs: number; rsd: number }[] }) {
  const [width, setWidth] = useState(0);
  const height = 120;
  const pad = 6;
  const money = progressColor.money;

  const last = points[points.length - 1];
  const spanX = Math.max(1, last?.atMs ?? 1);
  const maxY = Math.max(1, ...points.map((point) => point.rsd));
  const x = (atMs: number) => pad + (atMs / spanX) * (width - pad * 2);
  const y = (rsd: number) => height - pad - (rsd / maxY) * (height - pad * 2);

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.atMs)} ${y(point.rsd)}`)
    .join(' ');
  const area = `${line} L ${x(spanX)} ${height} L ${x(0)} ${height} Z`;

  return (
    <View
      style={styles.chart}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {width > 0 && last ? (
        <Svg width={width} height={height}>
          <Path d={area} fill={money.tint} />
          <Path
            d={line}
            fill="none"
            stroke={money.base}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <Circle cx={x(last.atMs)} cy={y(last.rsd)} r={4.5} fill={money.base} />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: 120 },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
  equivalent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  goal: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
