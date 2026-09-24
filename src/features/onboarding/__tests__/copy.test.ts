import {
  annualCostRsd,
  copy,
  costEquivalent,
  fearCard,
  formatRsd,
  joinSerbianList,
  reasonCard,
  TRIGGERS,
  type CopyContext,
} from '../copy';
import { GENDER_TOKENS, g, hasMissingCopy, missingCopy, type GenderCode } from '../gender';

const REASON_KEYS = ['zdravlje', 'porodica', 'pare', 'forma', 'sloboda', 'pritisak'] as const;
const FEAR_KEYS = ['porivi', 'stres', 'kafana', 'neuspeh', 'razdrazljivost', 'kilaza'] as const;

const ctx = (over: Partial<CopyContext> = {}): CopyContext => ({
  name: 'Pavle',
  gender: 'm',
  product: 'cigarete',
  cigarettesPerDay: 20,
  cigarettesPerPack: 20,
  packPriceRsd: 450,
  ...over,
});

describe('formatRsd', () => {
  it('groups thousands with a dot, as the brief writes them', () => {
    expect(formatRsd(7300)).toBe('7.300');
    expect(formatRsd(146000)).toBe('146.000');
    expect(formatRsd(999)).toBe('999');
    expect(formatRsd(1234567)).toBe('1.234.567');
  });

  it('never rounds up to a nicer number', () => {
    expect(formatRsd(164249.6)).toBe('164.250');
    expect(formatRsd(164249.4)).toBe('164.249');
  });
});

describe('annualCostRsd', () => {
  it('is packs a day times price times 365', () => {
    expect(annualCostRsd(ctx())).toBe(450 * 365);
    expect(annualCostRsd(ctx({ cigarettesPerDay: 10 }))).toBe(0.5 * 450 * 365);
  });
});

describe('costEquivalent', () => {
  it('picks the band and rotates its alternates', () => {
    expect(costEquivalent(164_250, 0)).toBe('= 10 dana odmora na moru');
    expect(costEquivalent(164_250, 1)).toBe('= najnoviji telefon, svake godine');
    expect(costEquivalent(164_250, 3)).toBe('= 10 dana odmora na moru');
  });

  it('changes framing when the savings story is weak instead of forcing a comparison', () => {
    expect(costEquivalent(9_000)).toBe('= mali korak koji se brzo skuplja.');
  });
});

describe('joinSerbianList', () => {
  it('joins with i before the last and capitalises only the first word', () => {
    expect(joinSerbianList(['zdravlje'])).toBe('Zdravlje.');
    expect(joinSerbianList(['zdravlje', 'porodica'])).toBe('Zdravlje i porodica.');
    expect(joinSerbianList(['zdravlje', 'porodica', 'sloboda'])).toBe(
      'Zdravlje, porodica i sloboda.',
    );
  });

  it('uses no Oxford comma, which Serbian does not take', () => {
    expect(joinSerbianList(['a', 'b', 'c', 'd'])).toBe('A, b, c i d.');
  });
});

describe('the no-slash rule', () => {
  const genders = ['m', 'f', 'x'] as const;

  it('never renders a slash or a parenthesised hedge, in any gender', () => {
    for (const token of GENDER_TOKENS) {
      for (const gender of genders) {
        expect(g(token, gender)).not.toMatch(/\//);
        expect(g(token, gender)).not.toMatch(/\(a\)|\(na\)|\(la\)/);
      }
    }
  });

  it('never falls back to the masculine form for an unset gender', () => {
    for (const token of GENDER_TOKENS) {
      expect(g(token, 'x')).not.toBe(g(token, 'm'));
    }
  });

  it('marks any gendered word reached without a branched sentence', () => {
    // The safety net. There is no genderless Serbian word, so `x` never has a form: a screen
    // supplies a whole sentence instead. A marker means someone forgot that branch.
    for (const token of GENDER_TOKENS) {
      expect(hasMissingCopy(g(token, 'x'))).toBe(true);
    }
  });
});

/**
 * The acceptance for M2: every string anyone can read, in all three genders, with no marker
 * and no slash. Pavle's answers (21.09.2026) rewrote the sentences that could not do this.
 */
describe('every onboarding string, in every gender', () => {
  const genders: readonly GenderCode[] = ['m', 'f', 'x'];

  const allStrings = (gender: GenderCode): string[] => {
    const c = ctx({ gender });
    const cards = [...REASON_KEYS.map((k) => reasonCard(k, c)), ...FEAR_KEYS.map(fearCard)];
    return [
      copy.welcome.skip,
      copy.welcome.signIn,
      ...copy.welcome.beats.flatMap((beat) => [...beat.headline, beat.sub, beat.cta]),
      copy.name.question,
      copy.gender.question,
      copy.product.question,
      copy.cigarettes.question(c),
      copy.price.question,
      copy.cost.lead(c),
      copy.cost.lead({ ...c, alreadyQuit: true }),
      copy.cost.closing,
      copy.panic.header,
      copy.panic.body(gender),
      copy.reasons.question,
      copy.reasonText.question,
      copy.reflection.sub,
      copy.fears.question,
      copy.fears.sub,
      copy.fearReflection.header,
      copy.fearReflection.cta(gender),
      copy.triggers.question,
      copy.timing.question,
      ...copy.timing.options(gender).map((option) => `${option.label} ${option.sub ?? ''}`),
      copy.date.question,
      copy.preview.header,
      copy.preview.healthCaption(c),
      copy.preview.freedomTitle,
      copy.commitment.header(c.name),
      ...copy.commitment.pledges,
      copy.commitment.finePrint,
      copy.processing.header,
      copy.summary.header(c),
      copy.summary.sub,
      ...copy.summary.milestones.map((milestone) => milestone.text),
      copy.notifications.sub,
      ...copy.notifications.samples.map((sample) => `${sample.title} ${sample.body}`),
      ...cards.flatMap((card) => (card ? [card.title, card.body, card.takeaway] : [])),
    ];
  };

  it.each(genders)('reads clean for %s, with no marker', (gender) => {
    for (const line of allStrings(gender)) {
      expect({ gender, line, missing: hasMissingCopy(line) }).toEqual({
        gender,
        line,
        missing: false,
      });
    }
  });

  it.each(genders)('never shows a slash or a parenthesised hedge for %s', (gender) => {
    for (const line of allStrings(gender)) {
      expect(line).not.toMatch(/\//);
      expect(line).not.toMatch(/\(a\)|\(na\)|\(la\)/);
    }
  });

  it.each(genders)('carries no em dash for %s, which PRODUCT.md bans', (gender) => {
    for (const line of allStrings(gender)) {
      expect(line).not.toMatch(/\u2014/);
    }
  });

  it('gives an unset gender its own sentence, never the masculine one', () => {
    const male = ctx({ gender: 'm' });
    const unset = ctx({ gender: 'x' });
    expect(copy.cigarettes.question(unset)).not.toBe(copy.cigarettes.question(male));
    expect(copy.summary.header(unset)).not.toBe(copy.summary.header(male));
    expect(copy.panic.body('x')).not.toBe(copy.panic.body('m'));
    expect(copy.timing.options('x')[2]?.label).not.toBe(copy.timing.options('m')[2]?.label);
    expect(copy.cost.lead({ ...unset, alreadyQuit: true })).not.toBe(
      copy.cost.lead({ ...male, alreadyQuit: true }),
    );
  });
});

describe('the sentences that branch for an unset gender', () => {
  it('keeps the rewrite the brief supplied itself', () => {
    expect(copy.fearReflection.cta('x')).toBe('Idemo dalje');
  });

  it('keeps the product noun in the branched sentences, so IQOS still reads right', () => {
    const iqos = ctx({ gender: 'x', product: 'iqos' });
    expect(copy.cigarettes.question(iqos)).toContain('štapića');
    expect(copy.cost.lead({ ...iqos, alreadyQuit: true })).toContain('štapiće');
  });
});

describe('reflection cards mirror the selection', () => {
  it('puts real numbers in the money card', () => {
    const card = reasonCard('pare', ctx());
    expect(card?.title).toBe('Pare');
    expect(card?.body).toContain('164.250');
    expect(card?.body).toContain('cigarete');
  });

  it('has a card for every reason and every fear', () => {
    for (const key of REASON_KEYS) expect(reasonCard(key, ctx())).not.toBeNull();
    for (const key of FEAR_KEYS) expect(fearCard(key)).not.toBeNull();
  });

  it('keeps cigarette nouns out of what an IQOS user reads', () => {
    expect(reasonCard('pare', ctx({ product: 'iqos' }))?.body).not.toContain('cigaret');
  });
});

describe('triggers', () => {
  it('offers the ten shared keys in display order', () => {
    expect(TRIGGERS.map((t) => t.key)).toEqual([
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
    ]);
  });
});

describe('missingCopy', () => {
  it('is unmistakable and carries no Serbian of its own', () => {
    expect(missingCopy('x')).toBe('«TODO(copy): x»');
    expect(hasMissingCopy(missingCopy('x'))).toBe(true);
  });
});

/** The welcome intro (docs/WELCOME-brief.md): three beats, in order, with the promise last. */
describe('the welcome intro', () => {
  it('has three beats in the brief’s order, the slip promise last', () => {
    expect(copy.welcome.beats.map((beat) => beat.art)).toEqual(['zora', 'oluja', 'put']);
    expect(copy.welcome.beats[2]?.headline[1]).toBe('Ne propadne.');
  });

  it('gives every beat a two-line headline: ink first, ember second', () => {
    for (const beat of copy.welcome.beats) expect(beat.headline).toHaveLength(2);
  });

  it('advances with Dalje twice and starts with Počnimo', () => {
    expect(copy.welcome.beats.map((beat) => beat.cta)).toEqual(['Dalje', 'Dalje', 'Počnimo']);
  });

  it('invents no number: the only figures are the brief’s own', () => {
    const figures = copy.welcome.beats
      .flatMap((beat) => [...beat.headline, beat.sub])
      .join(' ')
      .match(/\d+/g);
    expect(figures).toEqual(['3', '5']);
  });

  it('closes the quote the Serbian way', () => {
    const sub = copy.welcome.beats[1]?.sub ?? '';
    expect(sub).toContain('„Imam poriv“');
    expect(sub).not.toContain('"');
  });
});
