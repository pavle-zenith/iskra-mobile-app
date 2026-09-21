import type { CravingRow } from '@/data/repo';
import { calendarDateIn } from '@/lib/time/dayCount';
import type { ToolKey } from '@/lib/vocab';

/**
 * The rules of a craving session, kept pure so they can be tested without a screen or a
 * database. The drivers live in `PorivSession.tsx`.
 */

/** The ring runs five minutes, the length PRODUCT.md and the copy both name. */
export const CRAVING_TOTAL_MS = 5 * 60 * 1000;

/**
 * How long an unfinished craving stays resumable. A craving is not interrupted by a phone
 * call, so reopening the app within the window drops straight back into Mode. Older open
 * rows are left null and ignored: we do not know how they ended, and we never guess.
 */
export const RESUME_WINDOW_MS = 15 * 60 * 1000;

export type OpenCraving = { id: string; createdAt: string };

/**
 * The craving to resume, if any: open (`outcome` null), recent enough, and not one the
 * person already dismissed with the X this install.
 */
export function findResumable(
  rows: readonly CravingRow[],
  now: Date,
  dismissedId?: string | null,
): OpenCraving | null {
  for (const row of rows) {
    if (row.outcome !== null) continue;
    if (row.id === dismissedId) continue;
    const started = Date.parse(row.created_at);
    if (!Number.isFinite(started)) continue;
    const age = now.getTime() - started;
    if (age < 0 || age > RESUME_WINDOW_MS) continue;
    return { id: row.id, createdAt: row.created_at };
  }
  return null;
}

/** Wall clock since the craving began, backgrounding included. Never negative. */
export function elapsedMs(createdAt: string, now: Date): number {
  const started = Date.parse(createdAt);
  if (!Number.isFinite(started)) return 0;
  return Math.max(0, now.getTime() - started);
}

/** What `duration_seconds` is written as: whole seconds from `created_at` to the outcome. */
export function durationSeconds(createdAt: string, now: Date): number {
  return Math.round(elapsedMs(createdAt, now) / 1000);
}

/**
 * The ring, 0 to 1. It fills once and stays full: at 0:00 only the line underneath changes,
 * because a craving that outlasts five minutes is not a failure and must not look like one.
 */
export function ringProgress(createdAt: string, now: Date, totalMs = CRAVING_TOTAL_MS): number {
  if (totalMs <= 0) return 1;
  return Math.min(1, elapsedMs(createdAt, now) / totalMs);
}

/** The countdown as m:ss, floored at 0:00. */
export function remainingLabel(createdAt: string, now: Date, totalMs = CRAVING_TOTAL_MS): string {
  const left = Math.max(0, totalMs - elapsedMs(createdAt, now));
  const total = Math.ceil(left / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Cravings that ended in `survived` on a given calendar day, counted in the profile's anchor
 * time zone. The device's own day is not good enough: the day counter is anchored to
 * `profiles.quit_time_zone`, and someone who travels would see Success say "Danas" for a
 * different day than Home counts.
 */
export function survivedOn(rows: readonly CravingRow[], day: Date, anchorTimeZone: string): number {
  const target = calendarDateIn(day, anchorTimeZone);
  return rows.filter((row) => {
    if (row.outcome !== 'survived') return false;
    const at = new Date(row.created_at);
    if (Number.isNaN(at.getTime())) return false;
    const date = calendarDateIn(at, anchorTimeZone);
    return date.year === target.year && date.month === target.month && date.day === target.day;
  }).length;
}

/**
 * Whether opening this tool is worth a write. `tool_used` holds the last tool opened, so
 * re-rendering the same tool must not rewrite the row: that bumps the outbox version and
 * sends a network upsert, in a loop, mid-craving and on battery.
 */
export function shouldRecordTool(craving: CravingRow | null, tool: ToolKey): boolean {
  return !!craving && craving.tool_used !== tool;
}
