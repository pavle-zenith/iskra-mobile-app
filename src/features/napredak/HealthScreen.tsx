import { HeartPulse } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/primitives';
import { formatDateTime } from '@/lib/i18n/date';
import { timeLeft } from '@/lib/progress';
import { progressColor, space } from '@/theme';

import { CategoryDetail, type TimelineRow } from './CategoryDetail';
import { DetailScreen, useProgressSource } from './components';
import { progressCopy } from './copy';
import { progressFor } from './data';

/**
 * Zdravlje (docs/M4-brief.md Task 2): the Zdravlje instance of the export's CategoryScreen
 * template. Exactly the eleven sourced items from `src/lib/progress/health.ts`, each with its WHO
 * or NHS tag; the export's unsourced items ("funkcija pluća poboljšana za 30%" and the rest) are
 * cut. The brief's heading and sub sit between the count line and the timeline, and the info
 * card carries the sources.
 */

const TICK_MS = 60_000;

export function HealthScreen() {
  const { source, now } = useProgressSource(TICK_MS);
  const copy = progressCopy.health;
  const health = progressColor.health;

  if (!source) return <DetailScreen>{null}</DetailScreen>;

  const items = progressFor(source.profile, source.slips, now).health;
  const next = items.find((item) => item.status !== 'reached');
  const rows: TimelineRow[] = items.map((item) => ({
    key: item.key,
    status: item.status,
    label: item.at,
    tag: item.source,
    text: item.text,
    reachedOn: formatDateTime(item.reachedAt),
    fraction: item.fraction,
    left: copy.upcoming(timeLeft(item.msLeft)),
  }));

  return (
    <CategoryDetail
      title={copy.title}
      icon={HeartPulse}
      tone={health.base}
      deep={health.deep}
      next={next ? copy.upcoming(timeLeft(next.msLeft)) : undefined}
      intro={
        <View style={styles.intro}>
          <Text variant="heading">{copy.heading}</Text>
          <Text variant="body" color="textSoft">
            {copy.sub}
          </Text>
        </View>
      }
      rows={rows}
      info={copy.finePrint}
    />
  );
}

const styles = StyleSheet.create({
  intro: { gap: space.xs, marginTop: space.sm },
});
