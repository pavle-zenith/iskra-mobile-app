import { logSlip, updateCraving, type CravingRow } from '@/data/repo';
import type { CravingOutcome } from '@/lib/vocab';

import { durationSeconds } from './session';

/**
 * How a craving ends. One function, so the button, the slip link and the dev harness all
 * take the identical path and none of them can drift from the others.
 *
 * `duration_seconds` is wall clock from `created_at` to this moment, backgrounding included.
 * A slip additionally writes its own `slips` row, carrying the craving's trigger if it has
 * one. Neither branch touches `quit_date`: the total smoke-free time never resets
 * (PRODUCT.md), which is exactly why slips are their own table.
 */
export async function finishCraving(
  craving: CravingRow,
  outcome: CravingOutcome,
  now = new Date(),
): Promise<CravingRow | null> {
  const updated = await updateCraving(craving.id, {
    outcome,
    durationSeconds: durationSeconds(craving.created_at, now),
  });
  if (outcome === 'slipped') {
    await logSlip({ trigger: updated?.trigger ?? craving.trigger });
  }
  return updated;
}
