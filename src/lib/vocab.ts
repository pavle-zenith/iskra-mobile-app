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
 * Triggers: the situations a craving or a slip happens in. ONE list, used by
 * `cravings.trigger`, `slips.trigger` AND `profiles.triggers[]`, in display order.
 *
 * One list is the point. It is what will eventually let the app say "you told us it was
 * coffee, but your cravings come under stress": that comparison only exists if what someone
 * answered in onboarding and what they logged in Beležim share keys.
 *
 * `posao` and `kafana` come from the website's own hero copy („pauza na poslu", „kafana") and
 * had no key before. `kafana` deliberately overlaps `okolina` and `alkohol`: someone sitting in
 * a kafana should not have to decide which one it was.
 *
 * Server CHECKs: cravings_trigger_check and slips_trigger_check
 * (supabase/migrations/20260921120100_...). Keep equal.
 *
 * Not the quiz's four drivers (stress, habit, social, nicotine). Those are motivations and
 * they order the personal plan; triggers are situations and they tag events.
 */
export const TRIGGER_KEYS = [
  'kafa',
  'budjenje',
  'posao',
  'kafana',
  'okolina',
  'alkohol',
  'stres',
  'jelo',
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
