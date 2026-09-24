/**
 * Cigarette cost calculator. Ported from the website, `iskra-website-final/src/lib/calc.ts`
 * (docs/M4-brief.md Task 0: port, do not rewrite). Its comments and sources are kept as the
 * site has them; the changes for the app are marked "App:".
 *
 * PRICES ARE CLAIMS. One visibly wrong figure discredits the number the page is
 * built on. Re-check before each campaign: cigarettes move with the excise
 * calendar, fuel weekly. Last verified: 12 September 2026.
 *
 * Pack prices, Serbia, September 2026, roughly 400 to 620 RSD:
 *   L&M Loft XL ~390, L&M First Cut ~400 (cheapest mainstream)
 *   Pall Mall Select 410 (Aug 2026)
 *   Karelia Slims 450, Winston Eclipse 460 (Jun 2026)
 *   Marlboro ~490–540, Parliament ~540
 *   Mercata VT range quoted as 400 to 620 (Jun 2026)
 * A specific-excise rise took effect early July 2026 (~+10 per pack retail).
 * The default 450 is mid-market and slightly conservative, so the figure
 * under-claims: a Marlboro smoker thinks „mine is worse", the right direction.
 *
 * App: every figure a person sees is floored, never rounded. The site's `Math.round` could
 * turn 164.249,6 into 164.250, and PRODUCT.md forbids rounding a saving up.
 */

import { plural, type PluralForms } from '@/lib/i18n/plural';

export const CIGS_MIN = 1;
export const CIGS_MAX = 40;
export const CIGS_DEFAULT = 20;

export const PRICE_MIN = 350;
export const PRICE_MAX = 700;
export const PRICE_STEP = 10;
export const PRICE_DEFAULT = 450;

export const CIGS_PER_PACK = 20;
/** Minutes actually spent smoking one cigarette. Conservative end of the 5-7 min range. */
export const MINUTES_PER_CIG = 6;

/**
 * Daily spend in RSD. App: the pack size is a parameter, `profiles.cigarettes_per_pack`, which
 * defaults to the site's 20.
 */
export function dailyCost(cigsPerDay: number, packPrice: number, perPack = CIGS_PER_PACK): number {
  return (cigsPerDay / Math.max(1, perPack)) * packPrice;
}

/** Annual spend in RSD. 365 days, so a reader can check it in their head. */
export function annualCost(cigsPerDay: number, packPrice: number, perPack = CIGS_PER_PACK): number {
  return Math.floor(dailyCost(cigsPerDay, packPrice, perPack) * 365);
}

export function annualCigarettes(cigsPerDay: number): number {
  return cigsPerDay * 365;
}

export function annualHours(cigsPerDay: number): number {
  return Math.floor((cigsPerDay * MINUTES_PER_CIG * 365) / 60);
}

/**
 * sr-RS groups with a dot, which is what a Serbian reader expects: 164.250.
 * App: grouped by hand, not through `toLocaleString('sr-RS')`, whose separator varies by
 * engine (Hermes on two platforms, Node in tests). Floored, never rounded.
 */
export function formatNumber(n: number): string {
  const whole = Math.floor(Math.abs(n));
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return n < 0 ? `-${grouped}` : grouped;
}

/**
 * The glyph for each catalogue item. App: named here and mapped to Lucide in the screen, so this
 * module stays pure.
 */
export type EquivalentIcon =
  'coffee' | 'ticket' | 'utensils' | 'dumbbell' | 'fuel' | 'house' | 'laptop' | 'plane';

type Item = { price: number; forms: PluralForms; icon: EquivalentIcon };

/**
 * Everyday Serbian prices, September 2026, with sources so they can be defended:
 *   250     espresso, central Belgrade café (New Belgrade ~190, Ada ~210).
 *   1.000   cinema ticket. Danas, 12 Sep 2026: two tickets ≈ 2.000 RSD.
 *   4.200   dinner for two. Danas, 12 Sep 2026: main ~1.500, half-litre beer ~450.
 *   6.000   month of gym. Belgrade 2026 mid-market 4.500–7.500.
 *   11.000  full tank. 11 Sep 2026: BMB 95 at 205/l, diesel 234/l; a ~50 l tank is 10.250–11.700.
 *   52.000  month of rent. Belgrade one-bed, mid-range €450–600; €450 at ~117 RSD/EUR.
 *   95.000  a new laptop (~€810). Softest figure: a category, not a quoted price.
 *   130.000 a week away for two (~€1.110), Greece 2026, including fuel and food.
 *
 * App: the site's labels, verbatim, in the app's `plural()` form object.
 */
const CATALOG = (
  [
    { price: 250, forms: { one: 'kafa', few: 'kafe', other: 'kafa' }, icon: 'coffee' },
    {
      price: 1000,
      forms: { one: 'bioskopska karta', few: 'bioskopske karte', other: 'bioskopskih karata' },
      icon: 'ticket',
    },
    {
      price: 4200,
      forms: { one: 'večera za dvoje', few: 'večere za dvoje', other: 'večera za dvoje' },
      icon: 'utensils',
    },
    {
      price: 6000,
      forms: { one: 'mesec teretane', few: 'meseca teretane', other: 'meseci teretane' },
      icon: 'dumbbell',
    },
    {
      price: 11000,
      forms: {
        one: 'pun rezervoar goriva',
        few: 'puna rezervoara goriva',
        other: 'punih rezervoara goriva',
      },
      icon: 'fuel',
    },
    {
      price: 52000,
      forms: { one: 'mesec kirije', few: 'meseca kirije', other: 'meseci kirije' },
      icon: 'house',
    },
    {
      price: 95000,
      forms: { one: 'nov laptop', few: 'nova laptopa', other: 'novih laptopova' },
      icon: 'laptop',
    },
    {
      price: 130000,
      forms: { one: 'letovanje za dvoje', few: 'letovanja za dvoje', other: 'letovanja za dvoje' },
      icon: 'plane',
    },
  ] satisfies Item[]
).sort((a, b) => a.price - b.price);

const COFFEE = CATALOG[0] as Item;
const MID_MIN = 2;
const MID_MAX_RATIO = 0.5;

export type Equivalent = { count: number; label: string; icon: EquivalentIcon };

/**
 * Three equivalents at different scales: the biggest single thing the money
 * buys, a mid-sized thing it buys several of (at most half the big one's price,
 * so the rows never say the same thing twice), and coffees.
 */
export function equivalents(amount: number): Equivalent[] {
  const desc = [...CATALOG].reverse();
  const affords = (i: Item, n: number) => Math.floor(amount / i.price) >= n;

  const big = desc.find((i) => affords(i, 1)) ?? COFFEE;
  const mid =
    desc.find((i) => i.price <= big.price * MID_MAX_RATIO && affords(i, MID_MIN)) ??
    desc.find((i) => i.price < big.price && affords(i, MID_MIN)) ??
    desc.find((i) => i.price < big.price && affords(i, 1));

  const picked: Item[] = [big];
  if (mid && mid !== big) picked.push(mid);
  if (!picked.includes(COFFEE)) picked.push(COFFEE);

  if (picked.length < 3) {
    for (const i of desc) {
      if (picked.length >= 3) break;
      if (!picked.includes(i) && affords(i, 1)) picked.push(i);
    }
  }

  return picked.slice(0, 3).map((i) => {
    const count = Math.floor(amount / i.price);
    return { count, label: plural(count, i.forms), icon: i.icon };
  });
}
