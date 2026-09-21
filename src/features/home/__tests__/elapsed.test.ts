import { hasMissingCopy } from '@/lib/i18n/missingCopy';

import { home, unit } from '../copy';
import { breakdown, columns, sinceQuit } from '../elapsed';

describe('breakdown', () => {
  it('splits milliseconds into days, hours, minutes and seconds', () => {
    const ms = ((2 * 24 + 3) * 60 + 4) * 60 * 1000 + 5000;
    expect(breakdown(ms)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it('is all zeros at the quit moment, and never negative', () => {
    expect(breakdown(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(breakdown(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('rolls hours and minutes rather than letting them run past their unit', () => {
    const almostTwoDays = 2 * 86_400_000 - 1000;
    expect(breakdown(almostTwoDays)).toEqual({ days: 1, hours: 23, minutes: 59, seconds: 59 });
  });
});

/**
 * The export gets Serbian agreement wrong on this card: it renders "51 sekunde". Every unit
 * goes through `plural()`, which has all three forms.
 */
describe('unit labels agree in Serbian', () => {
  it('uses the one-form for 1, 21, 51 and the rest', () => {
    expect(unit.seconds(51)).toBe('sekunda');
    expect(unit.seconds(1)).toBe('sekunda');
    expect(unit.seconds(21)).toBe('sekunda');
    expect(unit.days(21)).toBe('dan');
    expect(unit.hours(1)).toBe('sat');
    expect(unit.minutes(101)).toBe('minut');
  });

  it('uses the few-form for 2 to 4 and the other-form for 5 to 20', () => {
    expect(unit.seconds(3)).toBe('sekunde');
    expect(unit.seconds(11)).toBe('sekundi');
    expect(unit.days(3)).toBe('dana');
    expect(unit.days(11)).toBe('dana');
    expect(unit.hours(2)).toBe('sata');
    expect(unit.hours(7)).toBe('sati');
    expect(unit.minutes(4)).toBe('minuta');
  });

  it('never falls back to one plural for everything above one', () => {
    expect(unit.seconds(2)).not.toBe(unit.seconds(5));
    expect(unit.hours(2)).not.toBe(unit.hours(5));
  });
});

describe('columns', () => {
  it('gives four columns, uppercased, each agreeing with its own number', () => {
    const value = columns({ days: 1, hours: 2, minutes: 5, seconds: 51 });
    expect(value.map((column) => column.label)).toEqual(['DAN', 'SATA', 'MINUTA', 'SEKUNDA']);
    expect(value.map((column) => column.value)).toEqual([1, 2, 5, 51]);
  });
});

describe('sinceQuit', () => {
  it('is positive after the quit moment and negative before it', () => {
    const quit = new Date('2026-10-05T00:00:00.000Z');
    expect(sinceQuit(quit, new Date('2026-10-05T00:01:00.000Z'))).toBe(60_000);
    expect(sinceQuit(quit, new Date('2026-10-04T23:59:00.000Z'))).toBe(-60_000);
  });

  it('is null with no quit date, so the card is not rendered at all', () => {
    expect(sinceQuit(null, new Date())).toBeNull();
    expect(sinceQuit(new Date('not a date'), new Date())).toBeNull();
  });
});

describe('Home copy', () => {
  const strings = [
    home.cta,
    home.greeting,
    home.week.title,
    home.week.count(3),
    home.checkIn.question,
    home.checkIn.clean,
    home.checkIn.slipped,
    home.timer.eyebrow,
    home.timer.preQuitEyebrow,
    home.reasonsTitle,
    home.slipLink.label,
    home.slipLink.sub,
    home.postSlipLead,
    home.postSlipSub,
    ...[0, 1, 2, 5, 21].map(home.survived),
    ...home.week.days,
  ];

  it('owes nothing and is never gendered, so it reads the same for everyone', () => {
    for (const line of strings) {
      expect({ line, missing: hasMissingCopy(line) }).toEqual({ line, missing: false });
    }
  });

  it('carries no gendered slash, no em dash and no English', () => {
    // The banned slash is the one joining two word forms ("prestao/la"), not the fraction in
    // "3 / 7", which is the brief's own approved copy.
    const genderedSlash = /\p{L}\s*\/\s*\p{L}/u;
    const english = /\b(week|day|streak|check|save|skip|free|milestone)\b/i;
    for (const line of strings) {
      expect({ line, slash: genderedSlash.test(line) }).toEqual({ line, slash: false });
      expect(line).not.toMatch(/—/);
      expect({ line, english: english.test(line) }).toEqual({ line, english: false });
    }
  });

  it('drops the export’s gendered timer eyebrow', () => {
    expect(home.timer.eyebrow).toBe('BEZ CIGARETE');
    expect(home.timer.eyebrow).not.toMatch(/SLOBODAN/i);
  });

  it('starts the week on Monday, matching weekFor', () => {
    expect(home.week.days[0]).toBe('Pon');
    expect(home.week.days).toHaveLength(7);
  });
});
