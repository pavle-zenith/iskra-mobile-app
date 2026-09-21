import { getDb, kvGet, kvSet } from './db';
import { deriveUserState } from '@/features/home/state';
import { resolveAnchorTimeZone } from '@/lib/time/dayCount';

import { finishCraving } from '@/features/poriv/outcome';
import { findResumable } from '@/features/poriv/session';

import {
  getProfile,
  listCravings,
  listSlips,
  logCraving,
  updateCraving,
  updateProfile,
  updateSlip,
} from './repo';
import { drain, getSyncSnapshot, setSimulatedOffline } from './sync';

/**
 * DEV ONLY. Lets a test script drive the data spine without touching the screen, because a
 * simulator cannot be tapped from a shell. The script writes a command into the app's own
 * SQLite file from the host:
 *
 *   sqlite3 "$(xcrun simctl get_app_container booted com.iskraclub.iskra data)/Documents/SQLite/iskra.db" \
 *     "INSERT OR REPLACE INTO kv (key, value) VALUES ('dev.command', 'log')"
 *
 * Commands: offline | online | log | drain | resync | report | state | profile |
 * poriv:start | poriv:survive | poriv:slip | poriv:report. Every one goes through the same
 * repository and sync engine the app uses; nothing here is a shortcut around them.
 * `report` prints the app's own view of the data to the Metro log.
 */
const COMMAND_KEY = 'dev.command';
const POLL_MS = 1_000;

const TEST_CRAVING = {
  strength: 6,
  trigger: 'stres',
  toolUsed: 'disem',
  durationSeconds: 60,
  outcome: 'survived',
} as const;

async function run(command: string) {
  switch (command) {
    case 'offline':
      return setSimulatedOffline(true);
    case 'online':
      return setSimulatedOffline(false);
    case 'log': {
      const craving = await logCraving(TEST_CRAVING);
      console.log(`[dev] logged craving ${craving.id}`);
      return;
    }
    case 'drain':
      return drain();
    case 'poriv:start': {
      // Exactly what Home does before it navigates to Mode.
      const craving = await logCraving();
      console.log(`[dev] poriv started ${craving.id}`);
      return;
    }
    case 'poriv:survive':
    case 'poriv:slip': {
      // The same finishCraving() the "Prošlo je" button and the slip link call.
      const open = findResumable(await listCravings(), new Date());
      if (!open) return console.warn('[dev] no open craving');
      const rows = await listCravings();
      const row = rows.find((candidate) => candidate.id === open.id);
      if (!row) return console.warn('[dev] open craving vanished');
      const updated = await finishCraving(row, command === 'poriv:slip' ? 'slipped' : 'survived');
      console.log(`[dev] poriv ${JSON.stringify(updated)}`);
      return;
    }
    case 'poriv:twice': {
      // Two endings on one craving, as a double tap on the slip link would produce.
      const rows = await listCravings();
      const open = findResumable(rows, new Date());
      if (!open) return console.warn('[dev] no open craving');
      const row = rows.find((candidate) => candidate.id === open.id);
      if (!row) return;
      const first = await finishCraving(row, 'slipped');
      const second = await finishCraving(row, 'slipped');
      console.log(`[dev] twice first=${!!first} second=${!!second}`);
      return;
    }
    case 'poriv:note': {
      // The one optional tap after a slip. It must land on the slips row too.
      const row = (await listCravings())[0];
      if (!row) return console.warn('[dev] no craving');
      await updateCraving(row.id, { trigger: 'kafa' });
      const slip = (await listSlips())[0];
      if (slip) await updateSlip(slip.id, { trigger: 'kafa' });
      console.log('[dev] noted kafa on both rows');
      return;
    }
    case 'poriv:report': {
      const [cravings, slips, profile] = await Promise.all([
        listCravings(),
        listSlips(),
        getProfile(),
      ]);
      console.log(
        `[dev] poriv report ${JSON.stringify({
          cravings: cravings.map(
            ({ id, tool_used, duration_seconds, outcome, trigger, strength }) => ({
              id: id.slice(0, 8),
              tool_used,
              duration_seconds,
              outcome,
              trigger,
              strength,
            }),
          ),
          slips: slips.map(({ id, trigger }) => ({ id: id.slice(0, 8), trigger })),
          outbox: await getDb().getAllAsync<{ table_name: string; version: number }>(
            'SELECT table_name, version FROM outbox ORDER BY table_name',
          ),
          quitDate: profile?.quitDate,
        })}`,
      );
      return;
    }
    case 'resync':
      // As if a push succeeded but its response was lost: queue every craving again.
      for (const craving of await listCravings()) {
        await updateCraving(craving.id, { strength: craving.strength });
      }
      return drain();
    case 'profile': {
      // Exercises the real onboarding write path: SQLite plus an outbox entry, no network.
      const stamp = new Date().toISOString().slice(11, 19);
      await updateProfile({ reasonText: `offline test ${stamp}` });
      console.log(`[dev] profile reason_text set to offline test ${stamp}`);
      return;
    }
    case 'state': {
      const profile = await getProfile();
      const state = deriveUserState({
        quitDate: profile?.quitDate ? new Date(profile.quitDate) : null,
        anchorTimeZone: resolveAnchorTimeZone(
          profile?.quitTimeZone,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        ),
        now: new Date(),
        lastSlipAt: null,
      });
      console.log(
        `[dev] state ${JSON.stringify({
          userState: state,
          onboardingCompleted: profile?.onboardingCompleted,
          quitDate: profile?.quitDate,
          quitTimeZone: profile?.quitTimeZone,
          timing: profile?.timing,
          name: profile?.name,
          gender: profile?.gender,
          reasons: profile?.reasons,
          triggers: profile?.triggers,
          committed: profile?.committed,
          signature: profile?.signatureData ? 'present' : 'none',
        })}`,
      );
      return;
    }
    case 'report': {
      const [cravings, snapshot] = await Promise.all([listCravings(), getSyncSnapshot()]);
      console.log(
        `[dev] report ${JSON.stringify({
          cravings: cravings.map(({ id, pending }) => ({ id, pending })),
          outbox: { pending: snapshot.pending, parked: snapshot.dead },
          simulatedOffline: snapshot.simulatedOffline,
          lastError: snapshot.lastError,
        })}`,
      );
      return;
    }
    default:
      console.warn(`[dev] unknown command ${command}`);
  }
}

export function startDevCommandPoller(): () => void {
  if (!__DEV__) return () => {};
  getDb();
  let busy = false;
  const timer = setInterval(() => {
    if (busy) return;
    busy = true;
    void (async () => {
      try {
        const command = await kvGet(COMMAND_KEY);
        if (!command) return;
        await kvSet(COMMAND_KEY, null);
        console.log(`[dev] command ${command}`);
        await run(command);
      } catch (cause) {
        console.warn(`[dev] command failed: ${String(cause)}`);
      } finally {
        busy = false;
      }
    })();
  }, POLL_MS);
  return () => clearInterval(timer);
}
