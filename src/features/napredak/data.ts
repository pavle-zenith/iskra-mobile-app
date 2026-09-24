import { getProfile, listSlips, type SlipRow } from '@/data/repo';
import { computeProgress, type Progress, type ProgressInput } from '@/lib/progress';
import type { Profile } from '@/lib/sync/profileRow';

/**
 * The one bridge from stored rows to the progress engine, used by Home and by the four progress
 * screens, so they always show the same figures.
 */
export function progressInputFor(
  profile: Profile | null,
  slips: readonly Pick<SlipRow, 'created_at'>[],
  now: Date,
): ProgressInput {
  return {
    quitDate: profile?.quitDate ? new Date(profile.quitDate) : null,
    cigarettesPerDay: profile?.cigarettesPerDay ?? null,
    packPriceRsd: profile?.packPriceRsd ?? null,
    cigarettesPerPack: profile?.cigarettesPerPack ?? null,
    // No count on a slip row yet: the engine counts each as one until the M5 slip flow adds it.
    slips: slips.map((slip) => ({ createdAt: slip.created_at })),
    now,
  };
}

export function progressFor(
  profile: Profile | null,
  slips: readonly Pick<SlipRow, 'created_at'>[],
  now: Date,
): Progress {
  return computeProgress(progressInputFor(profile, slips, now));
}

export type ProgressSource = {
  profile: Profile | null;
  slips: SlipRow[];
};

/** Reads from SQLite only. Napredak renders offline. */
export async function loadProgressSource(): Promise<ProgressSource> {
  const [profile, slips] = await Promise.all([getProfile(), listSlips()]);
  return { profile, slips };
}
