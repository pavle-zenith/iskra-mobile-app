/**
 * Dates in Serbian, the one way the app writes them (Pavle, docs/M4-copy-answers.md).
 *
 * A date takes the month in the genitive: "15. avgusta 2026.", never "15. avgust 2026.". Date
 * and time join with "u": "15. avgusta 2026. u 07:05". The nominative names in onboarding's copy
 * stay where a month is named on its own, as in the date picker's header.
 *
 * Read in the phone's own time zone, as a clock on the wall would show it.
 */
const GENITIVE_MONTHS = [
  'januara',
  'februara',
  'marta',
  'aprila',
  'maja',
  'juna',
  'jula',
  'avgusta',
  'septembra',
  'oktobra',
  'novembra',
  'decembra',
] as const;

const pad = (n: number) => String(n).padStart(2, '0');

/** "15. avgusta", a day in a month, with no year. */
export function formatDay(date: Date): string {
  return `${date.getDate()}. ${GENITIVE_MONTHS[date.getMonth()]}`;
}

/** "15. avgusta 2026." The year closes with a dot, as it does in Serbian. */
export function formatDate(date: Date): string {
  return `${formatDay(date)} ${date.getFullYear()}.`;
}

/** "15. avgusta 2026. u 07:05" */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} u ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
