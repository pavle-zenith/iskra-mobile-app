import type { CheckinRow, SlipRow } from '@/data/repo';
import { calendarDateIn, type CalendarDate } from '@/lib/time/dayCount';

/**
 * "Ova nedelja": the seven days of the current week, Monday first, in the profile's anchor
 * time zone.
 *
 * Nothing on this card punishes. A day someone slipped is filled and neutral, never red and
 * never an X; a day with no answer is simply faint, because the app does not know and never
 * guesses. Days before the quit date are not misses either: there was nothing to keep yet.
 */
export type DayState =
  /** A check-in saying the day was clean. */
  | 'clean'
  /** A slip that day, or a check-in saying so. Neutral, never a failure mark. */
  | 'slip'
  /** Today, not yet answered: the one tappable circle. */
  | 'today'
  /** A past day nobody answered. Unknown, not missed. */
  | 'none'
  /** Later this week. */
  | 'future'
  /** Before the quit date: the week had not started. */
  | 'before';

export type WeekDay = { date: string; label: string; state: DayState; today: boolean };

const DAY_MS = 86_400_000;

function iso(date: CalendarDate): string {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

/** Monday of the week containing `now`, as seven ISO dates in the anchor zone. */
export function weekDates(now: Date, anchorTimeZone: string): string[] {
  const today = calendarDateIn(now, anchorTimeZone);
  // Anchor at noon UTC so a day step never lands on a DST seam.
  const noon = Date.UTC(today.year, today.month - 1, today.day, 12);
  const weekday = new Date(noon).getUTCDay(); // 0 Sunday
  const backToMonday = (weekday + 6) % 7;
  return Array.from({ length: 7 }, (_, index) => {
    const at = new Date(noon - backToMonday * DAY_MS + index * DAY_MS);
    return iso({ year: at.getUTCFullYear(), month: at.getUTCMonth() + 1, day: at.getUTCDate() });
  });
}

export function weekFor(input: {
  now: Date;
  anchorTimeZone: string;
  quitDate: Date | null;
  checkins: readonly CheckinRow[];
  slips: readonly SlipRow[];
  labels: readonly string[];
}): { days: WeekDay[]; clean: number } {
  const { now, anchorTimeZone, quitDate, checkins, slips, labels } = input;
  const dates = weekDates(now, anchorTimeZone);
  const todayIso = iso(calendarDateIn(now, anchorTimeZone));
  const quitIso = quitDate ? iso(calendarDateIn(quitDate, anchorTimeZone)) : null;

  const checkinByDate = new Map(checkins.map((row) => [row.date, row]));
  const slipDates = new Set(
    slips
      .map((row) => new Date(row.created_at))
      .filter((at) => !Number.isNaN(at.getTime()))
      .map((at) => iso(calendarDateIn(at, anchorTimeZone))),
  );

  const days = dates.map((date, index): WeekDay => {
    const today = date === todayIso;
    const label = labels[index] ?? '';

    if (date > todayIso) return { date, label, state: 'future', today };
    if (quitIso && date < quitIso) return { date, label, state: 'before', today };

    const checkin = checkinByDate.get(date);
    if (slipDates.has(date) || checkin?.clean === false) {
      return { date, label, state: 'slip', today };
    }
    if (checkin?.clean === true) return { date, label, state: 'clean', today };
    return { date, label, state: today ? 'today' : 'none', today };
  });

  return { days, clean: days.filter((day) => day.state === 'clean').length };
}

/** Today's date in the anchor zone, the key `recordCheckin` writes under. */
export function todayIso(now: Date, anchorTimeZone: string): string {
  return iso(calendarDateIn(now, anchorTimeZone));
}
