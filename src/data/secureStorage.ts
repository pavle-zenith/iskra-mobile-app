import * as SecureStore from 'expo-secure-store';

import { splitUtf8 } from '@/lib/storage/chunks';

/**
 * Supabase's session storage, backed by the iOS Keychain / Android Keystore.
 *
 * SecureStore caps a value at 2048 bytes and a session is larger, so each value is stored as
 * `<key>.count` plus `<key>.0 … <key>.n`. A missing chunk reads as "no session", which makes
 * the app sign in again rather than use a corrupt token.
 *
 * AFTER_FIRST_UNLOCK lets the token refresh while the phone is locked in a pocket, which is
 * where it will be when a craving starts.
 */
const OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

const countKey = (key: string) => `${key}.count`;
const chunkKey = (key: string, index: number) => `${key}.${index}`;

async function readCount(key: string): Promise<number> {
  const raw = await SecureStore.getItemAsync(countKey(key), OPTIONS);
  const count = raw === null ? 0 : Number.parseInt(raw, 10);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

async function removeChunks(key: string, from: number, to: number) {
  for (let index = from; index < to; index += 1) {
    await SecureStore.deleteItemAsync(chunkKey(key, index), OPTIONS);
  }
}

export const chunkedSecureStorage = {
  async getItem(key: string): Promise<string | null> {
    const count = await readCount(key);
    if (count === 0) return null;
    const parts: string[] = [];
    for (let index = 0; index < count; index += 1) {
      const part = await SecureStore.getItemAsync(chunkKey(key, index), OPTIONS);
      if (part === null) return null;
      parts.push(part);
    }
    return parts.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    const previous = await readCount(key);
    const chunks = splitUtf8(value);
    for (const [index, chunk] of chunks.entries()) {
      await SecureStore.setItemAsync(chunkKey(key, index), chunk, OPTIONS);
    }
    await SecureStore.setItemAsync(countKey(key), String(chunks.length), OPTIONS);
    await removeChunks(key, chunks.length, previous);
  },

  async removeItem(key: string): Promise<void> {
    const count = await readCount(key);
    await SecureStore.deleteItemAsync(countKey(key), OPTIONS);
    await removeChunks(key, 0, count);
  },
};
