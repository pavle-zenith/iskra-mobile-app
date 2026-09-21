import {
  MAX_REASONS,
  STEPS,
  TOTAL_COUNTED_STEPS,
  canAdvance,
  nextStep,
  previousStep,
  progressFor,
  resumeStep,
  type OnboardingDraft,
} from '../steps';

const complete: OnboardingDraft = {
  name: 'Pavle',
  gender: 'muško',
  product: 'cigarete',
  cigarettesPerDay: 20,
  packPriceRsd: 450,
  reasons: ['zdravlje'],
  reasonText: '',
  fears: ['porivi'],
  triggers: ['kafa'],
  timing: 'odmah',
  quitDate: '2026-10-01T00:00:00+02:00',
  quitTimeZone: 'Europe/Belgrade',
  committed: true,
  signatureData: 'M0,0 L10,10',
};

describe('the order from SCREENS.md Part 3', () => {
  it('counts seventeen steps, and the panic demo is the seventh', () => {
    expect(TOTAL_COUNTED_STEPS).toBe(17);
    expect(STEPS.filter((s) => s.counted)[6]?.id).toBe('panic');
  });

  it('puts the panic demo straight after the cost AHA, not at the end', () => {
    expect(nextStep('cost')).toBe('panic');
    expect(previousStep('panic')).toBe('cost');
  });

  it('ends commitment → processing → summary → notifications, none of them counted', () => {
    expect(nextStep('commitment')).toBe('processing');
    expect(nextStep('processing')).toBe('summary');
    expect(nextStep('summary')).toBe('notifications');
    expect(nextStep('notifications')).toBeNull();
    for (const id of ['processing', 'summary', 'notifications'] as const) {
      expect(STEPS.find((s) => s.id === id)?.counted).toBe(false);
    }
  });

  it('numbers every counted step out of 17, once each', () => {
    const numbers = STEPS.filter((s) => s.showProgress && s.counted).map((s) => progressFor(s.id));
    expect(numbers.map((n) => n?.current)).toEqual([...Array(16).keys()].map((i) => i + 1));
    for (const n of numbers) expect(n?.total).toBe(17);
  });

  it('shows no progress bar on the commitment ceremony', () => {
    expect(progressFor('commitment')).toBeNull();
    expect(progressFor('processing')).toBeNull();
  });
});

describe('canAdvance', () => {
  it('holds a question until it is answered', () => {
    expect(canAdvance('name', {})).toBe(false);
    expect(canAdvance('name', { name: '   ' })).toBe(false);
    expect(canAdvance('name', { name: 'Pavle' })).toBe(true);
    expect(canAdvance('cigarettes', { cigarettesPerDay: 0 })).toBe(false);
    expect(canAdvance('price', { packPriceRsd: 450 })).toBe(true);
    expect(canAdvance('date', {})).toBe(false);
  });

  it('caps reasons at three', () => {
    expect(canAdvance('reasons', { reasons: [] })).toBe(false);
    expect(canAdvance('reasons', { reasons: ['a', 'b', 'c'] })).toBe(true);
    expect(canAdvance('reasons', { reasons: ['a', 'b', 'c', 'd'] })).toBe(false);
    expect(MAX_REASONS).toBe(3);
  });

  it('never gates on their own words', () => {
    expect(canAdvance('reasonText', {})).toBe(true);
  });

  it('lets the reading screens and the panic demo through', () => {
    for (const id of ['cost', 'panic', 'reflection', 'fearReflection', 'preview'] as const) {
      expect(canAdvance(id, {})).toBe(true);
    }
  });

  it('needs both the boolean and the signature to leave the commitment', () => {
    expect(canAdvance('commitment', { committed: true })).toBe(false);
    expect(canAdvance('commitment', { signatureData: 'M0,0' })).toBe(false);
    expect(canAdvance('commitment', { committed: true, signatureData: 'M0,0' })).toBe(true);
  });
});

describe('resumeStep', () => {
  it('returns to the step the app was killed on', () => {
    const draft: OnboardingDraft = { ...complete, fears: undefined, triggers: undefined };
    expect(resumeStep('fears', draft)).toBe('fears');
  });

  it('starts at the beginning with nothing saved', () => {
    expect(resumeStep(null, {})).toBe('name');
  });

  it('falls back to the first unanswered question when the saved step is too far ahead', () => {
    expect(resumeStep('date', { name: 'Pavle' })).toBe('gender');
  });

  it('allows the uncounted tail once everything is answered', () => {
    expect(resumeStep('summary', complete)).toBe('summary');
  });
});
