import { isAuthRetryableFetchError } from '@supabase/supabase-js';

import { kvGet, kvSet } from './db';
import { bindProfileToUser } from './repo';
import { supabase } from './supabase';

/**
 * Anonymous sign-in: a real `auth.users` row with no signup screen, so RLS works unchanged and
 * the user is inside the app in seconds. Email linking comes later, and only when someone wants
 * their data on a second device (`supabase.auth.updateUser({ email })` keeps the same user id).
 *
 * Nothing waits on this. It runs from the sync engine when there is signal, and every local
 * write works before, during and without it.
 */

const BOUND_USER_KEY = 'auth.bound_user_id';

let inflight: Promise<string | null> | null = null;
let lastAuthError: string | null = null;

export function getLastAuthError(): string | null {
  return lastAuthError;
}

/** The signed-in user id, signing in anonymously if this device has never had one. */
export function ensureSignedIn(): Promise<string | null> {
  if (!inflight) {
    inflight = resolveUser().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

async function resolveUser(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();

  if (data.session) {
    await adopt(data.session.user.id);
    return data.session.user.id;
  }

  // A stored session that could not refresh for lack of signal is still this user's. Minting a
  // new anonymous identity here would orphan everything they have logged, so wait instead.
  if (error && isAuthRetryableFetchError(error)) {
    lastAuthError = error.message;
    return null;
  }

  const result = await supabase.auth.signInAnonymously();
  if (result.error || !result.data.user) {
    lastAuthError = result.error?.message ?? 'anonymous sign-in returned no user';
    return null;
  }
  lastAuthError = null;
  await adopt(result.data.user.id);
  return result.data.user.id;
}

/** Once per identity: point the local profile at it and queue the server `profiles` row. */
async function adopt(userId: string): Promise<void> {
  if ((await kvGet(BOUND_USER_KEY)) === userId) return;
  await bindProfileToUser(userId);
  await kvSet(BOUND_USER_KEY, userId);
}

/**
 * The auth user this device's data belongs to, read from SQLite. Screens use this, never
 * `supabase.auth.getSession()`, which may refresh the token over the network.
 */
export function getBoundUserId(): Promise<string | null> {
  return kvGet(BOUND_USER_KEY);
}
