import { completeCraving, logSlip, type CravingRow } from '@/data/repo';
import type { CravingOutcome } from '@/lib/vocab';

import { durationSeconds } from './session';

/** What a finished craving leaves behind. `slipId` is set only when it ended in a cigarette. */
export type FinishedCraving = { craving: CravingRow; slipId: string | null };

/**
 * How a craving ends. One function, so the button, the slip link and the dev harness all take
 * the identical path and none of them can drift from the others.
 *
 * It is idempotent: `completeCraving` writes the outcome only if there is not one already, in
 * a single exclusive transaction, so a double tap cannot record two endings or two slips. A
 * second slip would be a false fact about someone's relapse.
 *
 * `duration_seconds` is wall clock from `created_at`, backgrounding included. Neither branch
 * touches `quit_date`: the total smoke-free time never resets (PRODUCT.md), which is exactly
 * why slips are their own table.
 */
export async function finishCraving(
  craving: CravingRow,
  outcome: CravingOutcome,
  now = new Date(),
): Promise<FinishedCraving | null> {
  const updated = await completeCraving(craving.id, {
    outcome,
    durationSeconds: durationSeconds(craving.created_at, now),
  });
  if (!updated) return null;

  if (outcome === 'slipped') {
    const slip = await logSlip({ trigger: updated.trigger });
    return { craving: updated, slipId: slip.id };
  }
  return { craving: updated, slipId: null };
}
