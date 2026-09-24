import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { goalTitle, progressCopy } from '../copy';

/**
 * Guards on M4's four progress screens (docs/M4-brief.md): the copy, the export's structure (four
 * stack screens, no segmented control), and what may not be on them yet. Source checks strip
 * comments first, the same convention as the other screen guards.
 */
const read = (...path: string[]) =>
  readFileSync(join(__dirname, '..', '..', '..', ...path), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s\/\/.*$/gm, '');

const SCREENS = ['MoneyScreen', 'CigarettesScreen', 'TimeScreen', 'HealthScreen'] as const;
const screen = (name: (typeof SCREENS)[number]) => read('features', 'napredak', `${name}.tsx`);

/** Every string the copy can produce, functions called with sample arguments of each kind. */
const SAMPLES: unknown[][] = [[5, 5], [{ value: 5, unit: 'days' }], [new Date(2026, 8, 15, 7, 5)]];
const call = (fn: (...args: never[]) => unknown): string => {
  for (const args of SAMPLES) {
    try {
      const out = (fn as (...a: unknown[]) => unknown)(...args);
      if (typeof out === 'string') return out;
    } catch {
      // Not this kind of argument; try the next.
    }
  }
  throw new Error('a copy function took none of the sample arguments');
};
const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : typeof value === 'function'
      ? [call(value as (...args: never[]) => unknown)]
      : value && typeof value === 'object'
        ? Object.values(value).flatMap(strings)
        : [];

describe('the progress copy', () => {
  it('has no slashes, em dashes or gendered forms', () => {
    for (const line of strings(progressCopy)) {
      expect(line).not.toMatch(/[—–]/);
      // A gendered slash is a letter on each side ("o/la"); "7 / 11 dostignuto" is a fraction.
      expect(line).not.toMatch(/[a-zčćšžđ]\/[a-zčćšžđ]/i);
      expect(line).not.toMatch(/\b(uštedeo|zapalio|nisi uneo|preživeo|slobodan|povratio)/i);
    }
  });

  it('agrees every count with its number', () => {
    const odbijeno = progressCopy.cigarettes.heroLabel;
    expect([1, 2, 5, 21, 12].map(odbijeno)).toEqual([
      'cigareta odbijena',
      'cigarete odbijene',
      'cigareta odbijeno',
      'cigareta odbijena',
      'cigareta odbijeno',
    ]);
    expect([1, 3, 40].map(progressCopy.cigarettes.packs)).toEqual(['pakla', 'pakle', 'pakli']);
    expect(progressCopy.cigarettes.butts(805)).toBe('opušaka manje');
    expect(progressCopy.cigarettes.butts(63)).toBe('opuška manje');
    expect(progressCopy.money.cigarettesCount(8008)).toBe('8.008 cigareta');
    expect(progressCopy.money.period(1)).toBe('za 1 dan bez cigarete');
    expect(progressCopy.time.hours(21)).toBe('21 sat');
  });

  it('says "za" in the accusative, unit by unit', () => {
    const za = progressCopy.health.upcoming;
    expect(za({ value: 5, unit: 'hours' })).toBe('za 5 sati');
    expect(za({ value: 1, unit: 'days' })).toBe('za 1 dan');
    expect(za({ value: 2, unit: 'months' })).toBe('za 2 meseca');
    expect(za({ value: 11, unit: 'months' })).toBe('za 11 meseci');
    expect(za({ value: 1, unit: 'years' })).toBe('za 1 godinu');
    expect(za({ value: 4, unit: 'years' })).toBe('za 4 godine');
  });

  it("titles the time goals with M5's approved names", () => {
    expect([1, 7, 182, 365].map(goalTitle)).toEqual([
      'Prvi dan',
      'Prva nedelja',
      'Pola godine',
      'Godina dana',
    ]);
    expect(goalTitle(730)).toBe('2 godine');
    expect(goalTitle(5 * 365)).toBe('5 godina');
  });

  it('writes the quit moment with the genitive month and "u"', () => {
    expect(progressCopy.time.period(new Date(2026, 8, 15, 7, 5))).toBe(
      'od 15. septembra 2026. u 07:05',
    );
  });

  it('has no copy still missing', () => {
    for (const line of strings(progressCopy)) expect(line).not.toContain('TODO(copy)');
  });
});

describe('the four screens', () => {
  it('are four stack routes, and the segmented screen is gone', () => {
    for (const route of ['novac', 'cigarete', 'vreme', 'zdravlje']) {
      expect(existsSync(join(__dirname, '..', '..', '..', 'app', 'napredak', `${route}.tsx`))).toBe(
        true,
      );
    }
    expect(existsSync(join(__dirname, '..', '..', '..', 'app', 'napredak.tsx'))).toBe(false);
    for (const name of SCREENS) expect(screen(name)).not.toContain('SegmentedControl');
  });

  it('open from Home: the two stat cards and the timer', () => {
    const home = read('features', 'home', 'HomeScreen.tsx');
    expect(home).toContain("router.push('/napredak/novac')");
    expect(home).toContain("router.push('/napredak/cigarete')");
    expect(home).toMatch(
      /onPress=\{preQuit \? undefined : \(\) => router\.push\('\/napredak\/vreme'\)\}/,
    );
  });

  it('link Ušteđevina and Odbijene cigarete to each other', () => {
    expect(screen('MoneyScreen')).toContain("router.push('/napredak/cigarete')");
    expect(screen('CigarettesScreen')).toContain("router.push('/napredak/novac')");
  });

  it('share their own figure on the export card, in the header and at the foot (M5 1b)', () => {
    for (const name of ['MoneyScreen', 'CigarettesScreen', 'TimeScreen'] as const) {
      const source = screen(name);
      expect(source).toContain('<ShareBox label={copy.share} onPress={shareIt} />');
      expect(source).toContain('<ShareButton label={copy.share} onPress={shareIt} />');
      expect(source).toMatch(/const shareIt = \(\) =>\s*share\(/);
    }
  });

  it('take every figure from the engine and every colour from the theme', () => {
    for (const name of SCREENS) {
      const source = screen(name);
      expect(source).toMatch(/progressFor\(/);
      expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source).not.toMatch(/rgba?\(/);
      // No arithmetic on habits in a screen: cigarettes a day and the pack price only reach
      // the engine, or the basis line that states them.
      expect(source).not.toMatch(/cigarettesPerDay\s*\*|packPriceRsd\s*\*/);
    }
  });

  it('never paint the cigarette count in `negative`', () => {
    for (const name of SCREENS) expect(screen(name)).not.toMatch(/negative/);
  });

  it('plot the real savings series, point to point', () => {
    const money = screen('MoneyScreen');
    expect(money).toContain('savingsSeries(');
    // Straight segments only: no curve commands in the path.
    expect(money).toMatch(/\$\{index === 0 \? 'M' : 'L'\}/);
    expect(money).not.toMatch(/[`'"]\s*[CQSTA]\s/);
  });

  it('show every health item, none sliced away, on the CategoryScreen template', () => {
    const health = screen('HealthScreen');
    expect(health).toContain('items.map(');
    expect(health).not.toMatch(/items\.slice|health\.slice/);
    expect(health).toContain('<CategoryDetail');
    expect(read('features', 'napredak', 'CategoryDetail.tsx')).toContain('rows.map(');
  });
});
