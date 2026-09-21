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
import { GENDER_TOKENS, g, hasMissingCopy, missingCopy, TOKENS_MISSING_REWRITE } from '../gender';

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

  it('marks every token that still owes a genderless rewrite', () => {
    // 24 today. Zero is the goal; docs/M2-copy-todo.md is the list Pavle works from.
    expect(TOKENS_MISSING_REWRITE).toHaveLength(24);
    for (const token of TOKENS_MISSING_REWRITE) {
      expect(hasMissingCopy(g(token, 'x'))).toBe(true);
    }
  });
});

describe('screens read in all three genders', () => {
  it('renders male and female copy with no placeholder', () => {
    for (const gender of ['m', 'f'] as const) {
      const c = ctx({ gender });
      expect(hasMissingCopy(copy.cigarettes.question(c))).toBe(false);
      expect(hasMissingCopy(copy.fears.sub(gender))).toBe(false);
      expect(hasMissingCopy(copy.summary.header(c))).toBe(false);
      expect(hasMissingCopy(copy.date.question(gender))).toBe(false);
      expect(copy.commitment.pledges(gender).some(hasMissingCopy)).toBe(false);
    }
  });

  it('uses the rewrites the brief does supply, so those lines are clean when unset', () => {
    expect(hasMissingCopy(copy.splash.line2('x'))).toBe(false);
    expect(copy.fearReflection.cta('x')).toBe('Idemo dalje');
  });

  it('shows a marker, never a slash, where a rewrite is still owed', () => {
    const question = copy.cigarettes.question(ctx({ gender: 'x' }));
    expect(hasMissingCopy(question)).toBe(true);
    expect(question).not.toMatch(/\//);
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
    for (const key of ['zdravlje', 'porodica', 'pare', 'forma', 'sloboda', 'pritisak']) {
      expect(reasonCard(key, ctx())).not.toBeNull();
    }
    for (const key of ['porivi', 'stres', 'kafana', 'neuspeh', 'razdrazljivost', 'kilaza']) {
      expect(fearCard(key, 'f')).not.toBeNull();
    }
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
