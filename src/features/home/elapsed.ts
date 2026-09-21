import { unit } from './copy';

/**
 * The live timer: how long since the quit moment, or how long until it.
 *
 * It counts from `quit_date` and nothing else, so a slip never moves it. This is the only day
 * figure on Home: the export repeated the same number in the header chip, the timer and a
 * third "Na putu si već" card, and the brief cuts that down to one.
 */
export type Elapsed = { days: number; hours: number; minutes: number; seconds: number };

export function breakdown(ms: number): Elapsed {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor(total / 3_600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}

/** The four columns, each with its own Serbian agreement. Uppercased for display. */
export function columns(value: Elapsed): { value: number; label: string }[] {
  return [
    { value: value.days, label: unit.days(value.days).toUpperCase() },
    { value: value.hours, label: unit.hours(value.hours).toUpperCase() },
    { value: value.minutes, label: unit.minutes(value.minutes).toUpperCase() },
    { value: value.seconds, label: unit.seconds(value.seconds).toUpperCase() },
  ];
}

/** Signed milliseconds to the quit moment: positive once it has passed. */
export function sinceQuit(quitDate: Date | null, now: Date): number | null {
  if (!quitDate || Number.isNaN(quitDate.getTime())) return null;
  return now.getTime() - quitDate.getTime();
}
