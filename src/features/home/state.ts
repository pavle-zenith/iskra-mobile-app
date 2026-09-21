import { quitProgress, type QuitProgress } from '@/lib/time/dayCount';

/**
 * Which of PRODUCT.md's six states a person is in. The home screen is not one layout with
 * variable data: each state leads with something different, and M3 builds those. M2 only has
 * to hand off correctly, above all so a quit date in the future lands in Pre-quit rather than
 * on a counter sitting at zero.
 */
export type UserState =
  'pre-quit' | 'acute' | 'first-week' | 'consolidating' | 'established' | 'post-slip';

export type UserStateInput = {
  quitDate: Date | null;
  anchorTimeZone: string;
  now: Date;
  /** The most recent slip, if any. A slip in the last 48h leads with absolution. */
  lastSlipAt?: Date | null;
};

export const POST_SLIP_WINDOW_MS = 48 * 60 * 60 * 1000;

export function deriveUserState(input: UserStateInput): UserState {
  const { quitDate, anchorTimeZone, now, lastSlipAt } = input;

  // No quit date yet is Pre-quit: the screen leads with the date, the plan and their reasons.
  if (!quitDate) return 'pre-quit';

  const progress: QuitProgress = quitProgress(quitDate, now, anchorTimeZone);
  if (progress.state === 'pre-quit') return 'pre-quit';

  // Absolution first, mechanism second. Checked before the day count, because a slip
  // yesterday matters more than which week it is. It never resets the total.
  if (lastSlipAt && now.getTime() - lastSlipAt.getTime() <= POST_SLIP_WINDOW_MS) {
    return 'post-slip';
  }

  const { day } = progress;
  if (day <= 3) return 'acute';
  if (day <= 7) return 'first-week';
  if (day <= 27) return 'consolidating';
  return 'established';
}
