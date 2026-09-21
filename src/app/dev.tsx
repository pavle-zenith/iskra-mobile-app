import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text } from '@/components/primitives';
import { getBoundUserId, getLastAuthError } from '@/data/auth';
import { getProfile } from '@/data/repo';
import { deriveUserState } from '@/features/home/state';
import { resolveAnchorTimeZone } from '@/lib/time/dayCount';
import { listCravings, logCraving, updateCraving, type CravingRow, type Synced } from '@/data/repo';
import {
  drain,
  getSyncSnapshot,
  setSimulatedOffline,
  watchSync,
  type SyncSnapshot,
} from '@/data/sync';
import { color, radius, space } from '@/theme';

/**
 * DEV-ONLY data-spine harness for the M1 acceptance test. Not a product screen: it redirects
 * home in release builds, and its English labels are developer tooling, not app copy.
 *
 * Open with: xcrun simctl openurl booted iskra://dev
 * Scriptable, because a simulator cannot be tapped from a shell:
 *   iskra://dev?action=offline|online|log|drain|resync&n=<any unique value>
 */
export default function DevHarness() {
  if (!__DEV__) return <Redirect href="/" />;
  return <Harness />;
}

function Harness() {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SyncSnapshot | null>(null);
  const [cravings, setCravings] = useState<Synced<CravingRow>[]>([]);
  const [profileLine, setProfileLine] = useState('…');
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  useEffect(() => watchSync(() => setTick((n) => n + 1)), []);

  const { action, n } = useLocalSearchParams<{ action?: string; n?: string }>();
  useEffect(() => {
    if (!action) return;
    void runAction(action).then(() => setTick((t) => t + 1));
  }, [action, n]);

  useEffect(() => {
    let alive = true;
    void Promise.all([getBoundUserId(), getSyncSnapshot(), listCravings(), getProfile()]).then(
      ([nextUserId, nextSnapshot, nextCravings, profile]) => {
        if (!alive) return;
        setUserId(nextUserId);
        setSnapshot(nextSnapshot);
        setCravings(nextCravings);
        const state = deriveUserState({
          quitDate: profile?.quitDate ? new Date(profile.quitDate) : null,
          anchorTimeZone: resolveAnchorTimeZone(
            profile?.quitTimeZone,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          ),
          now: new Date(),
          lastSlipAt: null,
        });
        setProfileLine(
          `${state} · onboarding ${profile?.onboardingCompleted ? 'done' : 'open'} · quit ${profile?.quitDate ?? 'unset'}`,
        );
      },
    );
    return () => {
      alive = false;
    };
  }, [tick]);

  const offline = snapshot?.simulatedOffline ?? false;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + space.md,
        padding: space.gutter,
        gap: space.md,
      }}
    >
      <Text variant="title">Data spine (dev)</Text>

      <View style={styles.panel}>
        <Line label="auth user" value={userId ?? 'none yet (signs in when there is signal)'} />
        <Line label="auth error" value={getLastAuthError() ?? '—'} />
        <Line label="outbox pending" value={String(snapshot?.pending ?? '…')} />
        <Line label="outbox parked" value={String(snapshot?.dead ?? '…')} />
        <Line
          label="last drain"
          value={snapshot?.lastDrainAt ? new Date(snapshot.lastDrainAt).toISOString() : '—'}
        />
        <Line label="last error" value={snapshot?.lastError ?? '—'} />
        <Line label="network" value={offline ? 'SIMULATED OFFLINE' : 'real'} />
        <Line label="user state" value={profileLine} />
      </View>

      <Button
        label="Log test craving"
        onPress={async () => {
          await logCraving(TEST_CRAVING);
          refresh();
        }}
      />
      <Button
        variant="secondary"
        label={offline ? 'Go online' : 'Simulate offline'}
        onPress={async () => {
          await setSimulatedOffline(!offline);
          refresh();
        }}
      />
      <Button variant="secondary" label="Drain now" onPress={() => void drain()} />

      <Text variant="heading">Local cravings ({cravings.length})</Text>
      {cravings.map((craving) => (
        <View key={craving.id} style={styles.panel}>
          <Line label="id" value={craving.id} />
          <Line label="created" value={craving.created_at} />
          <Line label="tool / strength" value={`${craving.tool_used} / ${craving.strength}`} />
          <Line label="state" value={craving.pending ? 'PENDING (in outbox)' : 'synced'} />
        </View>
      ))}
    </ScrollView>
  );
}

const TEST_CRAVING = {
  strength: 6,
  trigger: 'stres',
  toolUsed: 'disem',
  durationSeconds: 60,
  outcome: 'survived',
} as const;

async function runAction(action: string) {
  switch (action) {
    case 'offline':
      return setSimulatedOffline(true);
    case 'online':
      return setSimulatedOffline(false);
    case 'log':
      return logCraving(TEST_CRAVING);
    case 'drain':
      return drain();
    case 'resync': {
      // Re-queue every local craving as if a push had succeeded but its response was lost.
      // Idempotency means Supabase must still hold exactly one row per craving.
      for (const craving of await listCravings()) {
        await updateCraving(craving.id, { strength: craving.strength });
      }
      return drain();
    }
  }
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Text variant="caption" selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  panel: {
    backgroundColor: color.surface,
    borderColor: color.line,
    borderWidth: 1,
    borderRadius: radius.control,
    padding: space.sm,
    gap: space.xxs,
  },
  line: { gap: 2 },
});
