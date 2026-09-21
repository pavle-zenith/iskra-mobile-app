import { getDb, kvGet, kvSet } from './db';
import { listCravings, logCraving, updateCraving } from './repo';
import { drain, getSyncSnapshot, setSimulatedOffline } from './sync';

/**
 * DEV ONLY. Lets a test script drive the data spine without touching the screen, because a
 * simulator cannot be tapped from a shell. The script writes a command into the app's own
 * SQLite file from the host:
 *
 *   sqlite3 "$(xcrun simctl get_app_container booted com.iskraclub.iskra data)/Documents/SQLite/iskra.db" \
 *     "INSERT OR REPLACE INTO kv (key, value) VALUES ('dev.command', 'log')"
 *
 * Commands: offline | online | log | drain | resync | report. Every one goes through the same
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
    case 'resync':
      // As if a push succeeded but its response was lost: queue every craving again.
      for (const craving of await listCravings()) {
        await updateCraving(craving.id, { strength: craving.strength });
      }
      return drain();
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
