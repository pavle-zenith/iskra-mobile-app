import {
  listCheckins,
  listCravings,
  listMilestones,
  listSlips,
  unlockMilestone,
  getProfile,
  type MilestoneRow,
} from '@/data/repo';
import { progressFor } from '@/features/napredak/data';
import {
  evaluateGoals,
  mergeHistory,
  newlyReached,
  type Goal,
  type Progress,
} from '@/lib/progress';
import type { Profile } from '@/lib/sync/profileRow';

/**
 * Evaluates every goal from SQLite and writes a `milestones` row for each one crossed since the
 * last look (docs/M5-brief.md, Unlocking). Called on launch, on foreground, and whenever Home or
 * the Napredak tab comes back into view, which is after every write that can move a number:
 * a craving outcome, a check-in, a slip, a habit or quit-date edit all end there.
 *
 * Writes are idempotent (`unlockMilestone`), and a row is never removed: a reached goal stays
 * reached whatever a later slip or date edit does to the numbers.
 */
export type GoalsState = {
  profile: Profile | null;
  progress: Progress;
  goals: Goal[];
  milestones: MilestoneRow[];
  /** Crossed on this evaluation. The caller decides whether one is celebrated. */
  newly: Goal[];
  lastSlipAt: Date | null;
};

export async function syncGoals(now: Date = new Date()): Promise<GoalsState> {
  const [profile, slips, cravings, checkins, rows] = await Promise.all([
    getProfile(),
    listSlips(),
    listCravings(),
    listCheckins(),
    listMilestones(),
  ]);
  const progress = progressFor(profile, slips, now);
  const goals = evaluateGoals({
    progress,
    quitDate: profile?.quitDate ? new Date(profile.quitDate) : null,
    now,
    cravingsSurvived: cravings.filter((row) => row.outcome === 'survived').length,
    cleanCheckins: checkins.filter((row) => row.clean).length,
  });

  const known = new Set(rows.map((row) => row.key));
  // Nothing is written before consent: the gate keeps everyone without it off these screens,
  // and this check keeps it true if that ever changes.
  const newly = profile?.consentedAt ? newlyReached(goals, known) : [];
  const written: MilestoneRow[] = [];
  for (const goal of newly) {
    written.push(await unlockMilestone(goal.key, goal.category, goal.crossedAt ?? now));
  }

  const milestones = [...written, ...rows].sort((a, b) =>
    b.unlocked_at.localeCompare(a.unlocked_at),
  );
  return {
    profile,
    progress,
    goals: mergeHistory(goals, new Set(milestones.map((row) => row.key))),
    milestones,
    newly,
    lastSlipAt: slips[0] ? new Date(slips[0].created_at) : null,
  };
}
