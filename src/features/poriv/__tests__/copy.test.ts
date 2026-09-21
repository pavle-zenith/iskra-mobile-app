import { hasMissingCopy } from '@/features/onboarding/gender';

import { home, mode, slip, success, tools } from '../copy';

/**
 * Every M3 string is genderless by design, so nothing in Poriv mod calls `g()`. That is the
 * point: the person reading these is mid-craving, and the app must not stumble over grammar
 * to speak to them. These tests hold the rule in place if someone adds a line later.
 */
function everyString(): string[] {
  const counts = [0, 1, 2, 5, 11, 21, 22, 100];
  return [
    home.cta,
    home.firstDay,
    ...counts.map(home.dayCaption),
    home.preQuitDate('5. oktobar'),
    ...counts.map(home.preQuitCountdown),
    home.preQuitToday,
    home.reasonsTitle,
    ...counts.map(home.survived),
    home.postSlipLead,
    home.postSlipSub,
    ...Object.values(mode),
    ...Object.values(tools).flatMap((tool) =>
      Object.values(tool).flatMap((value) =>
        typeof value === 'string' ? [value] : Object.values(value as Record<string, string>),
      ),
    ),
    success.header,
    success.lead,
    ...counts.map(success.today),
    success.learning,
    success.triggerQuestion,
    success.home,
    ...Object.values(slip),
  ];
}

describe('M3 copy', () => {
  it('owes nothing: every M3 string is approved and in place', () => {
    expect(everyString().filter(hasMissingCopy)).toEqual([]);
  });

  it('renders identically whatever the gender, because none of it is gendered', () => {
    for (const line of everyString().filter((value) => !hasMissingCopy(value))) {
      expect({ line, missing: hasMissingCopy(line) }).toEqual({ line, missing: false });
    }
  });

  it('carries no slash, no em dash and no parenthesised hedge', () => {
    for (const line of everyString()) {
      expect(line).not.toMatch(/\//);
      expect(line).not.toMatch(/—/);
      expect(line).not.toMatch(/\(a\)|\(na\)|\(la\)/);
    }
  });

  it('carries no English, which the export’s own Poriv strings do', () => {
    const banned = /\b(mode|milestone|streak|skip|next|done|start|tip)\b/i;
    for (const line of everyString().filter((value) => !hasMissingCopy(value))) {
      expect({ line, english: banned.test(line) }).toEqual({ line, english: false });
    }
  });
});

describe('counts agree in Serbian', () => {
  it('uses all three forms for days, never n > 1', () => {
    expect(home.dayCaption(1)).toBe('dan bez cigarete');
    expect(home.dayCaption(2)).toBe('dana bez cigarete');
    expect(home.dayCaption(5)).toBe('dana bez cigarete');
    expect(home.dayCaption(21)).toBe('dan bez cigarete');
    expect(home.dayCaption(22)).toBe('dana bez cigarete');
  });

  it('uses all three forms for cravings', () => {
    expect(home.survived(1)).toBe('1 poriv iza tebe');
    expect(home.survived(3)).toBe('3 poriva iza tebe');
    expect(home.survived(7)).toBe('7 poriva iza tebe');
    expect(success.today(1)).toBe('Danas: 1 poriv iza tebe.');
    expect(success.today(11)).toBe('Danas: 11 poriva iza tebe.');
  });
});
