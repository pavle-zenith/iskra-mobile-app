/**
 * The day counter. The number the product is judged on.
 *
 * Rule: count whole CALENDAR days between the quit instant and now, both read as wall-clock
 * dates in one anchor time zone: the zone the quit date was chosen in
 * (`profiles.quit_time_zone`). Never elapsed hours / 24.
 *
 * Why an anchor and not the device zone: a flight west would otherwise send the count
 * backwards and a flight east would jump it forward. With a fixed anchor, travel changes
 * nothing, and DST cannot either, because calendar dates are compared, not durations.
 * The cost is that someone who moves abroad for good sees the day roll over at home-midnight
 * until they set a new quit date.
 *
 * Slips never enter this file. The total smoke-free time does not reset (PRODUCT.md), which
 * is why `slips` is its own table and never touches `quit_date`.
 */

export type CalendarDate = { year: number; month: number; day: number };

export type QuitProgress =
  /** Quit date still ahead: the Pre-quit state. `daysUntil` is 0 when it is later today. */
  | { state: 'pre-quit'; daysUntil: number; msUntil: number }
  /** Day 0 is the quit day itself. */
  | { state: 'quit'; day: number };

const MS_PER_DAY = 86_400_000;
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    // Throws RangeError for an unknown zone, which is what callers should see.
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

function assertValid(date: Date, name: string) {
  if (Number.isNaN(date.getTime())) throw new RangeError(`${name} is not a valid date`);
}

/** The wall-clock date of `instant` in `timeZone`. */
export function calendarDateIn(instant: Date, timeZone: string): CalendarDate {
  assertValid(instant, 'instant');
  const parts = formatterFor(timeZone).formatToParts(instant);
  const read = (type: 'year' | 'month' | 'day') =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: read('year'), month: read('month'), day: read('day') };
}

/** Whole days from `a` to `b`. UTC has no DST, so every day here is exactly 24h. */
function daysBetween(a: CalendarDate, b: CalendarDate): number {
  const utcA = Date.UTC(a.year, a.month - 1, a.day);
  const utcB = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((utcB - utcA) / MS_PER_DAY);
}

export function quitProgress(quitDate: Date, now: Date, anchorTimeZone: string): QuitProgress {
  assertValid(quitDate, 'quitDate');
  assertValid(now, 'now');

  const quitDay = calendarDateIn(quitDate, anchorTimeZone);
  const today = calendarDateIn(now, anchorTimeZone);
  const msUntil = quitDate.getTime() - now.getTime();

  if (msUntil > 0) {
    return { state: 'pre-quit', daysUntil: daysBetween(today, quitDay), msUntil };
  }
  return { state: 'quit', day: daysBetween(quitDay, today) };
}

/** Total smoke-free time. Takes no slips, by design. */
export function smokeFreeMs(quitDate: Date, now: Date): number {
  return Math.max(0, now.getTime() - quitDate.getTime());
}

export function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    formatterFor(timeZone);
    return true;
  } catch {
    return false;
  }
}

/** The stored quit zone when it is usable, otherwise the device's current zone. */
export function resolveAnchorTimeZone(stored: string | null | undefined, deviceTimeZone: string) {
  return stored && isValidTimeZone(stored) ? stored : deviceTimeZone;
}
