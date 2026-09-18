import { plural, pluralCategory } from '../plural';

const dan = { one: 'dan', few: 'dana', other: 'dana' };
const cigareta = { one: 'cigareta', few: 'cigarete', other: 'cigareta' };

describe('pluralCategory (sr)', () => {
  it.each([
    [0, 'other'],
    [1, 'one'],
    [2, 'few'],
    [4, 'few'],
    [5, 'other'],
    [11, 'other'],
    [12, 'other'],
    [14, 'other'],
    [15, 'other'],
    [21, 'one'],
    [22, 'few'],
    [25, 'other'],
    [101, 'one'],
    [111, 'other'],
    [112, 'other'],
    [192, 'few'],
    [1001, 'one'],
  ] as const)('%d → %s', (n, expected) => {
    expect(pluralCategory(n)).toBe(expected);
  });

  it('uses the fractional digits for decimals', () => {
    expect(pluralCategory(1.1)).toBe('one');
    expect(pluralCategory(2.3)).toBe('few');
    expect(pluralCategory(2.5)).toBe('other');
  });

  it('treats negatives by magnitude and non-finite as other', () => {
    expect(pluralCategory(-21)).toBe('one');
    expect(pluralCategory(Number.NaN)).toBe('other');
    expect(pluralCategory(Number.POSITIVE_INFINITY)).toBe('other');
  });
});

describe('plural', () => {
  it('never falls back to n > 1 logic', () => {
    expect(plural(21, dan)).toBe('dan');
    expect(plural(21, cigareta)).toBe('cigareta');
    expect(plural(22, cigareta)).toBe('cigarete');
    expect(plural(25, cigareta)).toBe('cigareta');
    expect(plural(1, cigareta)).toBe('cigareta');
    expect(plural(3, cigareta)).toBe('cigarete');
  });
});
