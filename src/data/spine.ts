import { getDb } from './db';
import { startDevCommandPoller } from './devCommands';
import { ensureLocalProfile } from './repo';
import { bindAuthRefreshToAppState } from './supabase';
import { startSyncEngine } from './sync';

/**
 * Starts the data spine: local database, token refresh, and the sync engine (which signs in
 * anonymously when there is signal and creates the profiles row).
 *
 * Called once from the root layout, and never awaited: the first screen renders from SQLite
 * whether or not any of this has reached the network.
 */
export function startDataSpine(): () => void {
  getDb();
  void ensureLocalProfile();
  const stopAuthRefresh = bindAuthRefreshToAppState();
  const stopSync = startSyncEngine();
  const stopDevCommands = startDevCommandPoller();
  return () => {
    stopAuthRefresh();
    stopSync();
    stopDevCommands();
  };
}
