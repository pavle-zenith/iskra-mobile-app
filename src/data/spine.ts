import * as Network from 'expo-network';
import { AppState } from 'react-native';

import { discardLeftoverSession, finishPendingDeletion } from './auth';
import { getDb, wasCreatedThisLaunch } from './db';
import { startDevCommandPoller } from './devCommands';
import { hasConsented } from './repo';
import { bindAuthRefreshToAppState } from './supabase';
import { startSyncEngine } from './sync';

/**
 * Starts the data spine, in two halves, because consent sits between them (docs/LEGAL-brief.md).
 *
 * Always, at launch: the local database's schema and nothing else. Empty tables are not data;
 * no row is written, and nothing reaches the network, until the person has agreed.
 *
 * Only after consent: token refresh and the sync engine, which is what signs in anonymously
 * and pushes rows. On a launch where consent is already on the phone they start straight away;
 * on first launch the consent screen starts them the moment both boxes are ticked.
 *
 * Called once from the root layout, and never awaited: the first screen renders from SQLite
 * whether or not any of this has reached the network.
 */
let stopServices: (() => void) | null = null;

/** Sign-in, token refresh and sync. Idempotent; never called before consent. */
export function startAccountServices(): void {
  if (stopServices) return;
  const stopAuthRefresh = bindAuthRefreshToAppState();
  const stopSync = startSyncEngine();
  stopServices = () => {
    stopAuthRefresh();
    stopSync();
  };
}

/** Halts them, so nothing syncs or refreshes while "Obriši sve podatke" pulls the ground out. */
export function stopAccountServices(): void {
  stopServices?.();
  stopServices = null;
}

export function startDataSpine(): () => void {
  getDb();
  // A database made on this launch means a new install: never reattach to an old session.
  if (wasCreatedThisLaunch()) void discardLeftoverSession();
  const stopDevCommands = startDevCommandPoller();

  // A deletion queued offline finishes on its own isolated client, whatever else is going on:
  // the person asked for it. Tried now, whenever the network returns and whenever the app comes
  // back to the foreground; each try is one keychain read when nothing is pending.
  void finishPendingDeletion();
  const network = Network.addNetworkStateListener((state) => {
    if (state.isConnected && state.isInternetReachable !== false) void finishPendingDeletion();
  });
  const foreground = AppState.addEventListener('change', (state) => {
    if (state === 'active') void finishPendingDeletion();
  });

  void hasConsented().then((consented) => {
    if (consented) startAccountServices();
  });

  return () => {
    stopDevCommands();
    network.remove();
    foreground.remove();
    stopAccountServices();
  };
}
