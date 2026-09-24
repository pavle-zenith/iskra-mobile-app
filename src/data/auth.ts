import { createClient, isAuthRetryableFetchError } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import type { Database } from '@/lib/supabase/database.types';

import { kvGet, kvSet } from './db';
import { env } from './env';
import { bindProfileToUser } from './repo';
import { chunkedSecureStorage } from './secureStorage';
import { SESSION_STORAGE_KEY, supabase } from './supabase';

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

/**
 * A reinstall starts fresh (Pavle, docs/M4-copy-answers.md, decision 2). The iOS Keychain keeps a
 * session after the app is deleted, so without this a reinstall would sign straight back into the
 * old anonymous account and quietly reattach to its server data. When the local database was
 * created on this launch, that leftover session is dropped before anything can use it. Returning
 * people get their data back by signing in, once docs/ACCOUNT-brief.md exists.
 *
 * Only the session goes. A deletion queued before the uninstall keeps its own credential under
 * `account.pending-deletion` and still finishes.
 */
let launchReset: Promise<void> = Promise.resolve();

export function discardLeftoverSession(): Promise<void> {
  launchReset = (async () => {
    // Online, this also revokes the token on the server. Offline it gives up before clearing
    // anything, which is why the keychain entry is removed directly after it either way.
    await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
    await chunkedSecureStorage.removeItem(SESSION_STORAGE_KEY);
  })().catch(() => undefined);
  return launchReset;
}

/** The signed-in user id, signing in anonymously if this device has never had one. */
export function ensureSignedIn(): Promise<string | null> {
  if (!inflight) {
    // Never before a reinstall's leftover session is gone: it would be adopted.
    inflight = launchReset.then(resolveUser).finally(() => {
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
 * The account's email, or the Apple relay address, read from the session on the phone: no
 * network. Null for an anonymous account, which is every account until docs/ACCOUNT-brief.md.
 */
export async function getAccountEmail(): Promise<string | null> {
  const raw = await chunkedSecureStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const email = (JSON.parse(raw) as { user?: { email?: unknown } }).user?.email;
    return typeof email === 'string' && email.length > 0 ? email : null;
  } catch {
    return null;
  }
}

/**
 * The auth user this device's data belongs to, read from SQLite. Screens use this, never
 * `supabase.auth.getSession()`, which may refresh the token over the network.
 */
export function getBoundUserId(): Promise<string | null> {
  return kvGet(BOUND_USER_KEY);
}

// --- "Obriši sve podatke" -------------------------------------------------------------------

/**
 * A deletion that could not reach the server yet: the session that can still prove who asked.
 * It is the one thing kept after the local wipe, and it is removed the moment the server
 * confirms. Without it an offline deletion could never be finished, because the wipe removes the
 * only credential this phone had.
 */
const PENDING_DELETION_KEY = 'account.pending-deletion';

type Tokens = { access_token: string; refresh_token: string };

async function readSessionTokens(): Promise<Tokens | null> {
  const raw = await chunkedSecureStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Tokens>;
    return typeof parsed.access_token === 'string' && typeof parsed.refresh_token === 'string'
      ? { access_token: parsed.access_token, refresh_token: parsed.refresh_token }
      : null;
  } catch {
    return null;
  }
}

async function readPending(): Promise<Tokens | null> {
  const raw = await SecureStore.getItemAsync(PENDING_DELETION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

const writePending = (tokens: Tokens) =>
  SecureStore.setItemAsync(PENDING_DELETION_KEY, JSON.stringify(tokens));

const clearPending = () => SecureStore.deleteItemAsync(PENDING_DELETION_KEY);

/** Whether a deletion is still waiting for the server. For the dev harness. */
export async function hasPendingDeletion(): Promise<boolean> {
  return (await readPending()) !== null;
}

/**
 * The first, purely local step of deleting this phone's account: signs the app out by moving
 * the session out of the main client and into the pending slot. Fast and offline-safe, so the
 * local wipe can follow at once; `finishPendingDeletion()` then does the server part.
 *
 * From here only the deletion client uses that session. That matters: Supabase rotates refresh
 * tokens, and a spent one used again revokes the whole session, so two clients refreshing the
 * same session would lock the deletion out for good.
 *
 * `signOut()` is deliberately not called: it would revoke the very token the deletion needs.
 */
export async function stashSessionForDeletion(): Promise<void> {
  await supabase.auth.stopAutoRefresh();
  const tokens = await readSessionTokens();
  await chunkedSecureStorage.removeItem(SESSION_STORAGE_KEY);
  // No session means no identity ever reached the server from this phone: nothing to delete.
  if (tokens) await writePending(tokens);
}

/**
 * Finishes a queued deletion, if there is one. Safe to call at every launch and every time the
 * network returns; it is a no-op once the server has confirmed.
 *
 * Runs on its own client that persists nothing, so it can never disturb the session of whoever
 * uses the app next, including a new anonymous account made after the wipe.
 */
let finishing: Promise<'done' | 'waiting'> | null = null;

export function finishPendingDeletion(): Promise<'done' | 'waiting'> {
  // Launch, reconnect and foreground can all fire at once. Two attempts refreshing the same
  // token concurrently is exactly the reuse that revokes a session, so there is only ever one.
  if (!finishing) {
    finishing = attemptPendingDeletion().finally(() => {
      finishing = null;
    });
  }
  return finishing;
}

async function attemptPendingDeletion(): Promise<'done' | 'waiting'> {
  const pending = await readPending();
  if (!pending) return 'done';

  const client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // setSession refreshes only if the access token has expired. When it does, the rotated
  // tokens are stashed before anything else happens, so the old refresh token is never reused.
  const session = await client.auth.setSession(pending);
  if (session.error) {
    if (isAuthRetryableFetchError(session.error)) return 'waiting';
    // The token is no longer accepted: the account is already gone, or unreachable from this
    // phone for good. Either way nothing more can be done from here; the policy's email route
    // is what remains. Keeping the token would only retry forever.
    await clearPending();
    return 'done';
  }
  if (session.data.session) {
    await writePending({
      access_token: session.data.session.access_token,
      refresh_token: session.data.session.refresh_token,
    });
  }

  const { error, status } = await client.rpc('delete_my_account');
  // status 0 is a request that never reached the server; try again when there is signal.
  if (error && status === 0) return 'waiting';
  // 401 or 403: the user no longer exists, which is the outcome we wanted.
  if (error && status !== 401 && status !== 403) return 'waiting';

  await clearPending();
  return 'done';
}
