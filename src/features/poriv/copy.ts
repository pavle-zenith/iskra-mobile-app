import { missingCopy } from '@/lib/i18n/missingCopy';
import { plural } from '@/lib/i18n/plural';

/**
 * Every Serbian string in Poriv mod, the slip minimum and the first home screen.
 *
 * Final v1.0 copy from docs/M3-brief.md, approved by Pavle. Every line is genderless by
 * design, so nothing here calls `g()`: M3 needs no gendered form at all. The export's own
 * Poriv strings are NOT approved (slashes, em dashes, "PORIV MODE", "milestone", an
 * unsourced health figure) and are not used.
 *
 * Nothing here is written, translated or paraphrased by an agent. A string that does not
 * exist renders the `missingCopy()` marker and goes in docs/M3-copy-todo.md.
 */

/** Counts never use `n > 1`; Serbian has three forms. */
export const dani = (n: number) => plural(n, { one: 'dan', few: 'dana', other: 'dana' });
export const porivi = (n: number) => plural(n, { one: 'poriv', few: 'poriva', other: 'poriva' });

export const home = {
  cta: 'Imam poriv',
  firstDay: 'Prvi dan bez cigarete.',
  /** Under the big number. The number itself is rendered separately, in display type. */
  dayCaption: (n: number) => `${dani(n)} bez cigarete`,
  preQuitDate: (date: string) => `Tvoj dan: ${date}`,
  preQuitCountdown: (n: number) => `Još ${n} ${dani(n)}`,
  preQuitToday: 'Danas je tvoj dan.',
  reasonsTitle: 'Tvoji razlozi',
  survived: (n: number) => `${n} ${porivi(n)} iza tebe`,
  postSlipLead: 'Jedna cigareta ne briše dane pre nje.',
  postSlipSub: 'Ukupno vreme bez cigarete ostaje. Ne krećeš od nule.',
} as const;

export const mode = {
  eyebrow: 'PORIV',
  minutes: 'minuta',
  breathingHint: 'Udahni.',
  /** At 0:00 the ring stays full and only this line changes. Nothing else happens. */
  elapsed: 'Pet minuta je iza tebe.',
  toolsTitle: 'IZABERI ALAT',
  footer: 'Porivi traju 3 do 5 minuta.',
  survived: 'Prošlo je',
  slipped: 'Desila se cigareta',
  /** Shown in Mode after Beležim saves. */
  noted: 'Zabeleženo.',
  /**
   * The X's screen-reader label. The brief gives no word for it and an agent may not invent
   * Serbian, so it renders a marker. docs/M3-copy-todo.md carries it.
   */
  close: missingCopy('Mode, oznaka za X'),
} as const;

export const tools = {
  disem: {
    eyebrow: 'DIŠEM',
    lead: '4 runde, oko jednog minuta',
    phases: { inhale: 'Udahni', hold: 'Zadrži', exhale: 'Izdahni' },
    done: 'Gotovo',
  },
  voda: {
    eyebrow: 'PIJEM VODU',
    lead: 'Popij čašu. Polako.',
    sub: 'Gutljaj po gutljaj, do dna.',
    tap: 'Gutljaj',
    done: 'Gotovo',
  },
  razlozi: {
    eyebrow: 'MOJI RAZLOZI',
    lead: 'Ovo su tvoje reči.',
    done: 'Ostajem na putu',
  },
  setam: {
    eyebrow: 'ŠETAM',
    lead: 'Izađi napolje.',
    lines: [
      'Svaki korak je korak dalje od cigarete.',
      'Ako ne možeš napolje, promeni sobu.',
      'Ostavi telefon na par minuta.',
    ],
    done: 'Gotovo',
  },
  odlazem: {
    eyebrow: 'ODLAŽEM',
    lead: 'Samo pet minuta.',
    sub: 'Ne zauvek. Samo ovih pet minuta. Posle toga odlučuješ ponovo.',
    ended: 'Pet minuta je prošlo.',
    done: 'Gotovo',
  },
  belezim: {
    eyebrow: 'BELEŽIM',
    triggerQuestion: 'Šta te navelo?',
    strengthQuestion: 'Koliko jak je poriv?',
    strengthLow: 'Blag',
    strengthHigh: 'Nepodnošljiv',
    save: 'Sačuvaj',
  },
} as const;

export const success = {
  header: 'Prošlo je.',
  lead: 'Porivi traju 3 do 5 minuta. Tvoj je upravo prošao.',
  today: (n: number) => `Danas: ${n} ${porivi(n)} iza tebe.`,
  learning: 'Svaki put kad odolevaš, mozak uči da porivi prolaze.',
  /** Offered only when no trigger was logged during the craving. */
  triggerQuestion: 'Šta te navelo?',
  home: 'Nazad na početnu',
} as const;

export const slip = {
  header: 'Desilo se. U redu je.',
  lead: 'Jedna cigareta ne briše dane pre nje. Ukupno vreme bez cigarete ostaje.',
  triggerQuestion: 'Šta te navelo?',
  home: 'Nazad na početnu',
} as const;
