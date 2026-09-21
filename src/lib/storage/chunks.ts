/**
 * Splitting a string into pieces that each fit a byte budget, for expo-secure-store.
 *
 * SecureStore values are limited to 2048 bytes, and a Supabase session (access token, refresh
 * token and user object) is usually larger. Measured in UTF-8 bytes, not string length, and
 * never cutting a character in half.
 */

export const SECURE_STORE_CHUNK_BYTES = 1_800;

export function utf8ByteLength(codePoint: number): number {
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  if (codePoint < 0x10000) return 3;
  return 4;
}

export function splitUtf8(value: string, maxBytes: number = SECURE_STORE_CHUNK_BYTES): string[] {
  if (maxBytes < 4) throw new RangeError('maxBytes must fit at least one character');
  if (value === '') return [''];

  const chunks: string[] = [];
  let current = '';
  let currentBytes = 0;

  // for..of iterates code points, so surrogate pairs stay together.
  for (const char of value) {
    const bytes = utf8ByteLength(char.codePointAt(0) ?? 0);
    if (currentBytes + bytes > maxBytes) {
      chunks.push(current);
      current = '';
      currentBytes = 0;
    }
    current += char;
    currentBytes += bytes;
  }
  chunks.push(current);
  return chunks;
}
