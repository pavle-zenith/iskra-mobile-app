/**
 * The onboarding order, as a pure state machine. No React, no database.
 *
 * Order and counting come from SCREENS.md Part 3, NOT from the export's own STEPS array:
 * seventeen counted steps, with Splash, Processing, Summary and Notifications uncounted.
 *
 * The one structural move: the Panic demo sits at step 7, right after the cost AHA, instead of
 * at 17. The user tries the thing that helps before the app asks fifteen more questions.
 */

export type StepId =
  | 'name'
  | 'gender'
  | 'product'
  | 'cigarettes'
  | 'price'
  | 'cost'
  | 'panic'
  | 'reasons'
  | 'reasonText'
  | 'reflection'
  | 'fears'
  | 'fearReflection'
  | 'triggers'
  | 'timing'
  | 'date'
  | 'preview'
  | 'commitment'
  | 'processing'
  | 'summary'
  | 'notifications';

export type StepKind =
  /** A question that writes an answer. */
  | 'question'
  /** Reads back what the answers mean. Ember field, no input. */
  | 'aha'
  /** The user does something rather than answers something. */
  | 'do'
  /** Ceremony, payoff or permission: counted differently or not at all. */
  | 'ceremony';

export type Step = {
  id: StepId;
  kind: StepKind;
  /** Counted steps show "n / 17". Splash, Processing, Summary and Notifications do not. */
  counted: boolean;
  /** The commitment ceremony hides the progress bar entirely. */
  showProgress: boolean;
};

export const STEPS: readonly Step[] = [
  { id: 'name', kind: 'question', counted: true, showProgress: true },
  { id: 'gender', kind: 'question', counted: true, showProgress: true },
  { id: 'product', kind: 'question', counted: true, showProgress: true },
  { id: 'cigarettes', kind: 'question', counted: true, showProgress: true },
  { id: 'price', kind: 'question', counted: true, showProgress: true },
  { id: 'cost', kind: 'aha', counted: true, showProgress: true },
  { id: 'panic', kind: 'do', counted: true, showProgress: true },
  { id: 'reasons', kind: 'question', counted: true, showProgress: true },
  { id: 'reasonText', kind: 'question', counted: true, showProgress: true },
  { id: 'reflection', kind: 'aha', counted: true, showProgress: true },
  { id: 'fears', kind: 'question', counted: true, showProgress: true },
  { id: 'fearReflection', kind: 'aha', counted: true, showProgress: true },
  { id: 'triggers', kind: 'question', counted: true, showProgress: true },
  { id: 'timing', kind: 'question', counted: true, showProgress: true },
  { id: 'date', kind: 'question', counted: true, showProgress: true },
  { id: 'preview', kind: 'aha', counted: true, showProgress: true },
  { id: 'commitment', kind: 'ceremony', counted: true, showProgress: false },
  { id: 'processing', kind: 'ceremony', counted: false, showProgress: false },
  { id: 'summary', kind: 'ceremony', counted: false, showProgress: false },
  { id: 'notifications', kind: 'ceremony', counted: false, showProgress: false },
];

export const TOTAL_COUNTED_STEPS = STEPS.filter((step) => step.counted).length;

const INDEX = new Map(STEPS.map((step, index) => [step.id, index]));

export function stepIndex(id: StepId): number {
  const index = INDEX.get(id);
  if (index === undefined) throw new RangeError(`unknown onboarding step: ${id}`);
  return index;
}

export function stepById(id: StepId): Step {
  return STEPS[stepIndex(id)] as Step;
}

/** "n / 17" for a counted step; null where no number is shown. */
export function progressFor(id: StepId): { current: number; total: number } | null {
  const step = stepById(id);
  if (!step.counted || !step.showProgress) return null;
  const current = STEPS.slice(0, stepIndex(id) + 1).filter((s) => s.counted).length;
  return { current, total: TOTAL_COUNTED_STEPS };
}

export function nextStep(id: StepId): StepId | null {
  const next = STEPS[stepIndex(id) + 1];
  return next ? next.id : null;
}

export function previousStep(id: StepId): StepId | null {
  const index = stepIndex(id);
  const previous = index > 0 ? STEPS[index - 1] : undefined;
  return previous ? previous.id : null;
}

/** The answers collected during onboarding, before they become a profile. */
export type OnboardingDraft = {
  name?: string;
  gender?: string;
  product?: string;
  cigarettesPerDay?: number;
  packPriceRsd?: number;
  reasons?: string[];
  reasonText?: string;
  fears?: string[];
  triggers?: string[];
  timing?: string;
  /** ISO 8601. The quit day at local midnight, in the zone it was chosen in. */
  quitDate?: string;
  quitTimeZone?: string;
  committed?: boolean;
  signatureData?: string;
};

export const MAX_REASONS = 3;

/**
 * Whether a step's answer is good enough to move on. Screens that only tell the user
 * something are always satisfied; questions are not.
 */
export function canAdvance(id: StepId, draft: OnboardingDraft): boolean {
  switch (id) {
    case 'name':
      return (draft.name ?? '').trim().length > 0;
    case 'gender':
      return !!draft.gender;
    case 'product':
      return !!draft.product;
    case 'cigarettes':
      return typeof draft.cigarettesPerDay === 'number' && draft.cigarettesPerDay > 0;
    case 'price':
      return typeof draft.packPriceRsd === 'number' && draft.packPriceRsd > 0;
    case 'reasons':
      return (draft.reasons?.length ?? 0) > 0 && (draft.reasons?.length ?? 0) <= MAX_REASONS;
    case 'fears':
      return (draft.fears?.length ?? 0) > 0;
    case 'triggers':
      return (draft.triggers?.length ?? 0) > 0;
    case 'timing':
      return !!draft.timing;
    case 'date':
      return !!draft.quitDate;
    case 'commitment':
      return draft.committed === true && !!draft.signatureData;
    // reasonText is optional by design: their own words, never a gate.
    case 'reasonText':
    case 'cost':
    case 'panic':
    case 'reflection':
    case 'fearReflection':
    case 'preview':
    case 'processing':
    case 'summary':
    case 'notifications':
      return true;
  }
}

/**
 * Where to resume. A saved step is trusted only as far as its answers hold: if someone
 * force-quit on step 11, they come back to 11, but a saved step whose earlier questions are
 * unanswered (a half-written draft from an older build) falls back to the first gap.
 */
export function resumeStep(saved: StepId | null, draft: OnboardingDraft): StepId {
  const firstGap = STEPS.find((step) => !canAdvance(step.id, draft))?.id ?? 'notifications';
  if (!saved) return firstGap;
  return stepIndex(saved) <= stepIndex(firstGap) ? saved : firstGap;
}
