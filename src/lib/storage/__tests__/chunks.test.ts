import { splitUtf8 } from '../chunks';

// UTF-8 length without Node's Buffer: every %XX escape is one byte.
const bytes = (s: string) => encodeURIComponent(s).replace(/%[0-9A-F]{2}/g, '_').length;

describe('splitUtf8', () => {
  it('keeps short values whole', () => {
    expect(splitUtf8('abc', 10)).toEqual(['abc']);
    expect(splitUtf8('', 10)).toEqual(['']);
  });

  it('splits a session-sized value into chunks under the budget that rejoin exactly', () => {
    const session = JSON.stringify({ access_token: 'x'.repeat(3_000), user: { id: 'u' } });
    const chunks = splitUtf8(session, 1_800);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(bytes(chunk)).toBeLessThanOrEqual(1_800);
    expect(chunks.join('')).toBe(session);
  });

  it('measures bytes, not characters: š č ž ć đ are two bytes each', () => {
    const chunks = splitUtf8('šččžćđ'.repeat(10), 7);
    for (const chunk of chunks) expect(bytes(chunk)).toBeLessThanOrEqual(7);
    expect(chunks.join('')).toBe('šččžćđ'.repeat(10));
  });

  it('never splits a surrogate pair', () => {
    const value = 'a🔥'.repeat(20);
    const chunks = splitUtf8(value, 5);
    for (const chunk of chunks) {
      expect(bytes(chunk)).toBeLessThanOrEqual(5);
      expect(chunk).not.toMatch(/[\uD800-\uDBFF]$/);
    }
    expect(chunks.join('')).toBe(value);
  });
});
