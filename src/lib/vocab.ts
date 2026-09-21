/**
 * Every closed vocabulary the app writes to Supabase, in one file.
 *
 * These are storage keys, not copy. Serbian labels live with the screens that show them.
 * Adding a value here is a product decision: flag it for Pavle, and if the column has a
 * server-side CHECK, ship a migration in supabase/migrations/ in the same change.
 */

/**
 * `cravings.tool_used`. The six Poriv tools, in PRODUCT.md order.
 * Server CHECK: cravings_tool_used_check (supabase/migrations/20260918180000_...). Keep equal.
 */
export const TOOL_KEYS = ['disem', 'voda', 'razlozi', 'setam', 'odlazem', 'belezim'] as const;
export type ToolKey = (typeof TOOL_KEYS)[number];

/** `cravings.outcome`. Server CHECK: cravings_outcome_check. */
export const CRAVING_OUTCOMES = ['survived', 'slipped'] as const;
export type CravingOutcome = (typeof CRAVING_OUTCOMES)[number];

/**
 * `cravings.trigger` and `slips.trigger`: what was happening when the urge or the slip came.
 * Keys from the design export's PorivEntry and SlipReflectScreen, which share one set.
 * No server CHECK; this list is the only guard.
 *
 * Not the same list as `profiles.triggers[]` (onboarding habits). That set is decided in M2:
 * the export's OnboardingTriggers screen and ONBOARDING_COPY_BRIEF.md disagree on its keys.
 */
export const TRIGGER_KEYS = [
  'kafa',
  'budjenje',
  'okolina',
  'stres',
  'jelo',
  'alkohol',
  'dosada',
  'drugo',
] as const;
export type TriggerKey = (typeof TRIGGER_KEYS)[number];

/** `cravings.strength`. Server CHECK: 1 to 10 inclusive. */
export const STRENGTH_MIN = 1;
export const STRENGTH_MAX = 10;

/** `profiles.gender`. Server CHECK. Unset means: use the genderless rewrite, never masculine. */
export const GENDERS = ['muško', 'žensko', 'drugo'] as const;
export type Gender = (typeof GENDERS)[number];

/** `profiles.product`. Server CHECK. v1 is cigarettes; iqos is a label-only variant. */
export const PRODUCTS = ['cigarete', 'iqos'] as const;
export type Product = (typeof PRODUCTS)[number];

/** `profiles.timing`. Server CHECK. */
export const TIMINGS = ['odmah', 'uskoro', 'vec_prestao'] as const;
export type Timing = (typeof TIMINGS)[number];

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value);
}

export const isToolKey = (v: unknown): v is ToolKey => isOneOf(TOOL_KEYS, v);
export const isCravingOutcome = (v: unknown): v is CravingOutcome => isOneOf(CRAVING_OUTCOMES, v);
export const isTriggerKey = (v: unknown): v is TriggerKey => isOneOf(TRIGGER_KEYS, v);
export const isGender = (v: unknown): v is Gender => isOneOf(GENDERS, v);
export const isProduct = (v: unknown): v is Product => isOneOf(PRODUCTS, v);
export const isTiming = (v: unknown): v is Timing => isOneOf(TIMINGS, v);

export const isStrength = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= STRENGTH_MIN && v <= STRENGTH_MAX;
