/**
 * Serbian three-form numeral agreement, per CLDR `sr` cardinal rules.
 *
 *   one:   1, 21, 31, 101 ...          (ends in 1, not in 11)
 *   few:   2-4, 22-24, 102-104 ...     (ends in 2-4, not in 12-14)
 *   other: 0, 5-20, 25-30, 111-114 ...
 *
 * Decimals follow the same rule on their fractional digits (CLDR `f`), so 1,1 takes
 * the `one` form and 2,5 takes `other`.
 *
 * Never `n > 1`. Every count that renders goes through here.
 */
export type PluralForms = {
  one: string;
  few: string;
  other: string;
};

export type PluralCategory = keyof PluralForms;

export function pluralCategory(n: number): PluralCategory {
  if (!Number.isFinite(n)) return 'other';

  const [intPart = '0', fracPart = ''] = Math.abs(n).toString().split('.');
  const i = Number(intPart);
  const hasFraction = fracPart.length > 0;
  const f = hasFraction ? Number(fracPart) : 0;

  const isOne = (x: number) => x % 10 === 1 && x % 100 !== 11;
  const isFew = (x: number) => x % 10 >= 2 && x % 10 <= 4 && (x % 100 < 12 || x % 100 > 14);

  if ((!hasFraction && isOne(i)) || (hasFraction && isOne(f))) return 'one';
  if ((!hasFraction && isFew(i)) || (hasFraction && isFew(f))) return 'few';
  return 'other';
}

export function plural(n: number, forms: PluralForms): string {
  return forms[pluralCategory(n)];
}
