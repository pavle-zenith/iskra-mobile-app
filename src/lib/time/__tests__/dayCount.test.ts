import { calendarDateIn, quitProgress, resolveAnchorTimeZone, smokeFreeMs } from '../dayCount';

/**
 * The number the product is judged on. Whole calendar days in the zone the quit date was
 * chosen in (the anchor), never elapsed hours / 24.
 *
 * Europe/Belgrade DST in 2026: spring forward Sun 29 March 02:00 → 03:00,
 * fall back Sun 25 October 03:00 → 02:00.
 */
const BG = 'Europe/Belgrade';
const at = (iso: string) => new Date(iso);

describe('quitProgress: counting days', () => {
  it('quit at 23:50, checked at 00:10 the next day, is day 1', () => {
    expect(
      quitProgress(at('2026-09-01T23:50:00+02:00'), at('2026-09-02T00:10:00+02:00'), BG),
    ).toEqual({ state: 'quit', day: 1 });
  });

  it('quit earlier today is day 0', () => {
    expect(
      quitProgress(at('2026-09-18T08:00:00+02:00'), at('2026-09-18T10:00:00+02:00'), BG),
    ).toEqual({ state: 'quit', day: 0 });
  });

  it('the exact quit instant is day 0', () => {
    const t = at('2026-09-18T08:00:00+02:00');
    expect(quitProgress(t, t, BG)).toEqual({ state: 'quit', day: 0 });
  });

  it('counts a full year by the calendar', () => {
    expect(
      quitProgress(at('2026-01-01T09:00:00+01:00'), at('2026-12-31T21:00:00+01:00'), BG),
    ).toEqual({ state: 'quit', day: 364 });
  });
});

describe('quitProgress: DST', () => {
  it('spring forward: 46 elapsed hours across the lost hour is still day 2', () => {
    // 28 Mar 12:00 CET → 30 Mar 11:00 CEST is 46h; hours / 24 would say 1.
    expect(
      quitProgress(at('2026-03-28T12:00:00+01:00'), at('2026-03-30T11:00:00+02:00'), BG),
    ).toEqual({ state: 'quit', day: 2 });
  });

  it('spring forward: same calendar day across the lost hour is day 0', () => {
    expect(
      quitProgress(at('2026-03-29T00:30:00+01:00'), at('2026-03-29T23:30:00+02:00'), BG),
    ).toEqual({ state: 'quit', day: 0 });
  });

  it('fall back: 24h40m inside the 25-hour day is still day 0', () => {
    // 25 Oct 00:10 CEST → 25 Oct 23:50 CET is 24h40m; hours / 24 would say 1.
    expect(
      quitProgress(at('2026-10-25T00:10:00+02:00'), at('2026-10-25T23:50:00+01:00'), BG),
    ).toEqual({ state: 'quit', day: 0 });
  });

  it('fall back: two calendar days across the extra hour is day 2', () => {
    expect(
      quitProgress(at('2026-10-24T12:00:00+02:00'), at('2026-10-26T11:00:00+01:00'), BG),
    ).toEqual({ state: 'quit', day: 2 });
  });
});

describe('quitProgress: travel', () => {
  const quit = at('2026-09-01T12:00:00+02:00');

  it('flying west does not send the count backwards', () => {
    // 01:00 in Belgrade (day 9). An hour later the phone is in New York, where it is still
    // 9 September. Counting in the device zone would drop to 8.
    const inBelgrade = quitProgress(quit, at('2026-09-10T01:00:00+02:00'), BG);
    const inNewYork = quitProgress(quit, at('2026-09-09T20:00:00-04:00'), BG);
    expect(inBelgrade).toEqual({ state: 'quit', day: 9 });
    expect(inNewYork).toEqual({ state: 'quit', day: 9 });
  });

  it('flying east does not jump the count forward', () => {
    // 20:00 in Belgrade (day 8) is 03:00 next day in Tokyo. Device-zone counting would say 9.
    expect(quitProgress(quit, at('2026-09-10T03:00:00+09:00'), BG)).toEqual({
      state: 'quit',
      day: 8,
    });
  });

  it('never decreases and never skips, hour by hour, across a whole year', () => {
    const start = at('2026-01-01T09:00:00+01:00');
    let previous = 0;
    for (let h = 0; h < 365 * 24; h += 1) {
      const progress = quitProgress(start, new Date(start.getTime() + h * 3_600_000), BG);
      if (progress.state !== 'quit') throw new Error('expected quit state');
      expect(progress.day - previous).toBeGreaterThanOrEqual(0);
      expect(progress.day - previous).toBeLessThanOrEqual(1);
      previous = progress.day;
    }
    expect(previous).toBe(365);
  });
});

describe('quitProgress: pre-quit', () => {
  it('a quit date in the future is a countdown, never a negative day', () => {
    const progress = quitProgress(
      at('2026-09-25T00:00:00+02:00'),
      at('2026-09-18T23:00:00+02:00'),
      BG,
    );
    expect(progress).toEqual({
      state: 'pre-quit',
      daysUntil: 7,
      msUntil: 6 * 86_400_000 + 3_600_000,
    });
  });

  it('a quit time later today is zero days away', () => {
    expect(
      quitProgress(at('2026-09-18T20:00:00+02:00'), at('2026-09-18T10:00:00+02:00'), BG),
    ).toEqual({ state: 'pre-quit', daysUntil: 0, msUntil: 10 * 3_600_000 });
  });

  it('tomorrow at 00:05, seen at 23:55 today, is one day away', () => {
    expect(
      quitProgress(at('2026-09-19T00:05:00+02:00'), at('2026-09-18T23:55:00+02:00'), BG),
    ).toEqual({ state: 'pre-quit', daysUntil: 1, msUntil: 10 * 60_000 });
  });
});

describe('quitProgress: bad input', () => {
  it('rejects invalid dates instead of rendering NaN', () => {
    expect(() => quitProgress(new Date('nope'), new Date(), BG)).toThrow(RangeError);
    expect(() => quitProgress(new Date(), new Date('nope'), BG)).toThrow(RangeError);
  });

  it('rejects an unknown time zone', () => {
    expect(() => quitProgress(new Date(), new Date(), 'Mars/Olympus')).toThrow(RangeError);
  });
});

describe('calendarDateIn', () => {
  it('reads the wall-clock date in the given zone', () => {
    const instant = at('2026-09-09T22:30:00Z');
    expect(calendarDateIn(instant, BG)).toEqual({ year: 2026, month: 9, day: 10 });
    expect(calendarDateIn(instant, 'America/New_York')).toEqual({ year: 2026, month: 9, day: 9 });
  });
});

describe('resolveAnchorTimeZone', () => {
  it('prefers the zone stored with the quit date', () => {
    expect(resolveAnchorTimeZone(BG, 'Asia/Tokyo')).toBe(BG);
  });

  it('falls back to the device zone when none is stored or it is invalid', () => {
    expect(resolveAnchorTimeZone(null, 'Asia/Tokyo')).toBe('Asia/Tokyo');
    expect(resolveAnchorTimeZone('', 'Asia/Tokyo')).toBe('Asia/Tokyo');
    expect(resolveAnchorTimeZone('Mars/Olympus', 'Asia/Tokyo')).toBe('Asia/Tokyo');
  });
});

describe('smokeFreeMs', () => {
  it('is the time since the quit instant, and zero before it', () => {
    const quit = at('2026-09-01T12:00:00+02:00');
    expect(smokeFreeMs(quit, at('2026-09-02T12:00:00+02:00'))).toBe(86_400_000);
    expect(smokeFreeMs(quit, at('2026-08-31T12:00:00+02:00'))).toBe(0);
  });

  it('takes no slips: a slip never resets the total (PRODUCT.md)', () => {
    expect(smokeFreeMs.length).toBe(2);
  });
});
