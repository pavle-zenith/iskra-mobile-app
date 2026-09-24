import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';
import { AppState, type AppStateStatus } from 'react-native';

import type { Database } from '@/lib/supabase/database.types';

import { env } from './env';
import { chunkedSecureStorage } from './secureStorage';

/**
 * Where the session lives in the keychain. This is supabase-js's own default, spelled out, so
 * "Obriši sve podatke" can remove the session directly when signing out cannot: offline, with an
 * expired access token, `signOut()` gives up before it clears anything. Same value as before, so
 * no existing session is lost by naming it.
 */
export const SESSION_STORAGE_KEY = `sb-${new URL(env.supabaseUrl).hostname.split('.')[0]}-auth-token`;

/**
 * The one Supabase client. Screens never import it: they read and write SQLite through
 * src/data/repo.ts, and only the sync engine and auth talk to the network.
 *
 * Key: the public publishable key. The service role key never goes near this app.
 */
export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: chunkedSecureStorage,
    storageKey: SESSION_STORAGE_KEY,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Token refresh runs only while the app is in the foreground; a backgrounded app cannot keep
 * timers alive. Returns the unsubscribe.
 */
export function bindAuthRefreshToAppState(): () => void {
  const apply = (state: AppStateStatus) => {
    if (state === 'active') void supabase.auth.startAutoRefresh();
    else void supabase.auth.stopAutoRefresh();
  };
  apply(AppState.currentState);
  const subscription = AppState.addEventListener('change', apply);
  return () => subscription.remove();
}
