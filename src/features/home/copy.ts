import { copy as onboardingCopy } from '@/features/onboarding/copy';
import { plural } from '@/lib/i18n/plural';

/**
 * Every Serbian string on Home.
 *
 * Approved by Pavle in docs/HOME-V2-brief.md, verbatim, and none of it gendered. The export's
 * own home strings are not used where the brief corrects them: "SLOBODAN SI" is gendered,
 * "uštedeno" was misspelt, "Na putu si već ... od kada si počeo/la" carried a slash and
 * repeated the timer, and the Mark Twain quote is unsourced and about failing to quit.
 */

/** Counts never use `n > 1`; Serbian has three forms. */
export const dani = (n: number) => plural(n, { one: 'dan', few: 'dana', other: 'dana' });
export const porivi = (n: number) => plural(n, { one: 'poriv', few: 'poriva', other: 'poriva' });

/** Timer unit labels, from the brief. The export is wrong at 51: it is "51 sekunda". */
export const unit = {
  days: dani,
  hours: (n: number) => plural(n, { one: 'sat', few: 'sata', other: 'sati' }),
  minutes: (n: number) => plural(n, { one: 'minut', few: 'minuta', other: 'minuta' }),
  seconds: (n: number) => plural(n, { one: 'sekunda', few: 'sekunde', other: 'sekundi' }),
} as const;

export const home = {
  cta: 'Imam poriv',
  greeting: 'Zdravo,',

  week: {
    title: 'Ova nedelja',
    count: (clean: number) => `${clean} / 7`,
    /** Onboarding's approved short weekday names, Monday first. No second Serbian list. */
    days: onboardingCopy.date.weekdays,
  },

  checkIn: {
    question: 'Kako je prošao dan?',
    clean: 'Danas bez cigarete',
    slipped: 'Desila se cigareta',
  },

  timer: {
    eyebrow: 'BEZ CIGARETE',
    preQuitEyebrow: 'DO TVOG DANA',
  },

  /**
   * Module 4 (M4). "ušteđeno" with đ; the export misspelt it. The cigarette label agrees with
   * its number: 1 cigareta odbijena, 2 cigarete odbijene, 5 cigareta odbijeno.
   */
  stats: {
    money: 'RSD ušteđeno',
    cigarettes: (n: number) =>
      plural(n, {
        one: 'cigareta odbijena',
        few: 'cigarete odbijene',
        other: 'cigareta odbijeno',
      }),
  },

  reasonsTitle: 'Tvoji razlozi',

  /** Module 6, HOME-V2's approved names (docs/HOME-V2-brief.md Copy). */
  progress: {
    title: 'Moj napredak',
    article: 'Dnevno znanje',
    read: 'Čitaj',
    nextGoal: 'Sledeći cilj',
  },

  slipLink: {
    label: 'Desila se cigareta',
    sub: 'Beležimo bez osude.',
  },

  /** The lead slot, shown only for 48 hours after a slip. M3's approved absolution copy. */
  postSlipLead: 'Jedna cigareta ne briše dane pre nje.',
  postSlipSub: 'Ukupno vreme bez cigarete ostaje. Ne krećeš od nule.',

  /** The flame chip counts cravings survived, and is hidden at zero. */
  survived: (n: number) => `${n} ${porivi(n)} iza tebe`,
} as const;
