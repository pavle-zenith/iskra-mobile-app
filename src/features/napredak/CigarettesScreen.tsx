import { useRouter } from 'expo-router';
import { CigaretteOff, Coins } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/primitives';
import { formatNumber } from '@/lib/progress';
import { color, progressColor, space } from '@/theme';

import {
  DetailScreen,
  FigureRow,
  FinePrint,
  Hero,
  LinkCard,
  Section,
  ShareBox,
  ShareButton,
  useProgressSource,
} from './components';
import { useShareCard } from '@/features/share/ShareCard';

import { progressCopy } from './copy';
import { progressFor } from './data';

/**
 * Odbijene cigarete, the export's CigarettesScreen (docs/M4-brief.md Task 3): hero, "Ukupno",
 * "Ako nastaviš", the link to Ušteđevina, share, fine print.
 *
 * The export paints this screen in red, which is `negative` exactly, and `negative` is never
 * pointed at the user. It takes the violet Home's cigarette card already uses. Tar and nicotine
 * grams are cut: label yields are not what reaches the lungs, so they would be invented figures.
 */

const TICK_MS = 60_000;

export function CigarettesScreen() {
  const router = useRouter();
  const { source, now } = useProgressSource(TICK_MS);
  const { share, host } = useShareCard();
  const copy = progressCopy.cigarettes;
  const tone = progressColor.time.base;

  if (!source) return <DetailScreen title={copy.title}>{null}</DetailScreen>;

  const progress = progressFor(source.profile, source.slips, now);
  const count = progress.cigarettesNotSmoked;

  const shareIt = () => share({ title: formatNumber(count), sub: copy.heroLabel(count) });
  return (
    <DetailScreen title={copy.title} right={<ShareBox label={copy.share} onPress={shareIt} />}>
      <Hero
        icon={CigaretteOff}
        iconColor={tone}
        value={formatNumber(count)}
        label={copy.heroLabel(count)}
        period={progress.smokeFreeDays > 0 ? copy.period(progress.smokeFreeDays) : null}
        tone={tone}
      />

      {/* The export's count card: figures side by side, a hairline between them. */}
      <Section title={copy.totalTitle}>
        <View style={styles.counts}>
          <Count value={progress.packsNotSmoked} label={copy.packs(progress.packsNotSmoked)} />
          <View style={styles.divider} />
          <Count value={count} label={copy.butts(count)} />
        </View>
      </Section>

      {progress.nextYearCigarettes > 0 ? (
        <Section title={copy.projectionTitle}>
          <View>
            <FigureRow
              value={formatNumber(progress.next30DaysCigarettes)}
              label={copy.monthly(progress.next30DaysCigarettes)}
              tone={tone}
              first
            />
            <FigureRow
              value={formatNumber(progress.nextYearCigarettes)}
              label={copy.yearly(progress.nextYearCigarettes)}
              tone={tone}
              first={false}
            />
          </View>
        </Section>
      ) : null}

      {progress.rsdSaved > 0 ? (
        <LinkCard
          icon={Coins}
          tone={progressColor.money.base}
          label={copy.moneyLink}
          value={copy.moneyAmount(progress.rsdSaved)}
          onPress={() => router.push('/napredak/novac')}
        />
      ) : null}

      <ShareButton label={copy.share} onPress={shareIt} />

      <FinePrint>{copy.finePrint}</FinePrint>
      {host}
    </DetailScreen>
  );
}

function Count({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.count}>
      <Text variant="title" style={styles.countValue}>
        {formatNumber(value)}
      </Text>
      <Text variant="caption" color="textMuted" style={styles.centred}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  counts: { flexDirection: 'row', alignItems: 'stretch' },
  count: { flex: 1, alignItems: 'center', gap: space.xxs, paddingVertical: space.xs },
  countValue: { fontVariant: ['tabular-nums'] },
  centred: { textAlign: 'center' },
  divider: { width: StyleSheet.hairlineWidth, backgroundColor: color.line },
});
