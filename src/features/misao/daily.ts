import { calendarDateIn } from '@/lib/time/dayCount';

/**
 * Which line a day shows (docs/M5-brief.md Task 3): one per calendar day in the anchor time zone,
 * the same all day, deterministic (the day's index modulo the list's length), fully offline.
 */
const MS_PER_DAY = 86_400_000;

/** Days since 1 January 1970 for the calendar date `at` falls on in `timeZone`. */
export function dayIndex(at: Date, timeZone: string): number {
  const { year, month, day } = calendarDateIn(at, timeZone);
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

export function lineFor<T>(lines: readonly T[], at: Date, timeZone: string): T | null {
  if (lines.length === 0) return null;
  const index = dayIndex(at, timeZone) % lines.length;
  return lines[index] ?? null;
}

/**
 * The last `count` days' lines, today last: the detail screen's dots swipe back through them,
 * never ahead. Fewer when the list is shorter, so no line shows twice.
 */
export function recentLines<T>(
  lines: readonly T[],
  at: Date,
  timeZone: string,
  count = 5,
): { line: T; daysAgo: number }[] {
  if (lines.length === 0) return [];
  const today = dayIndex(at, timeZone);
  const span = Math.min(count, lines.length);
  return Array.from({ length: span }, (_, i) => span - 1 - i).map((daysAgo) => ({
    line: lines[(today - daysAgo) % lines.length] as T,
    daysAgo,
  }));
}
