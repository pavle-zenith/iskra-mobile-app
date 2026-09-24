import { dani } from '@/features/home/copy';
import { formatDateTime } from '@/lib/i18n/date';
import { plural } from '@/lib/i18n/plural';
import { formatNumber, type TimeLeft } from '@/lib/progress';

/**
 * Every Serbian string on the four progress screens (Ušteđevina, Odbijene cigarete, Tvoje vreme,
 * Zdravlje), approved by Pavle in docs/M4-brief.md, 24.09.2026, verbatim and genderless. The time
 * goal titles are M5's approved Vreme ciljevi (docs/M5-brief.md), which the brief points to. The
 * health items live with their sources in `src/lib/progress/health.ts`.
 *
 * Counts go through `plural()`, decided on the number itself; numbers are grouped here (8.000).
 * The lines docs/M4-copy-todo.md asked for were answered in docs/M4-copy-answers.md. Dates go
 * through `formatDateTime()`: genitive month, date and time joined with "u".
 */

const cigareta = (n: number) => plural(n, { one: 'cigareta', few: 'cigarete', other: 'cigareta' });
const sati = (n: number) => plural(n, { one: 'sat', few: 'sata', other: 'sati' });

/** "za" takes the accusative: za 1 sat, za 1 dan, za 1 mesec, za 1 godinu. */
const za: Record<TimeLeft['unit'], (n: number) => string> = {
  hours: sati,
  days: dani,
  months: (n) => plural(n, { one: 'mesec', few: 'meseca', other: 'meseci' }),
  years: (n) => plural(n, { one: 'godinu', few: 'godine', other: 'godina' }),
};

const period = (days: number) => `za ${formatNumber(days)} ${dani(days)} bez cigarete`;
const upcoming = ({ value, unit }: TimeLeft) => `za ${value} ${za[unit](value)}`;

/** The "Podeli svoju pobedu" button, hidden until M5's share card (Task 1b) exists. */
const share = 'Podeli svoju pobedu';

export const progressCopy = {
  back: 'Nazad',

  money: {
    title: 'Ušteđevina',
    heroUnit: 'RSD',
    period,
    chartTitle: 'Rast ušteđevine',
    axisStart: 'Dan 1',
    axisEnd: 'Danas',
    projectionTitle: 'Ako nastaviš',
    /** The four rows: the amount on the left, the period on the right, as in the export. */
    per: { day: 'dnevno', week: 'nedeljno', month: 'mesečno', year: 'godišnje' },
    rsd: (amount: number) => `${formatNumber(amount)} RSD`,
    basis: (perDay: number, packPrice: number) =>
      `Računica: ${perDay} ${cigareta(perDay)} dnevno, pakla ${formatNumber(packPrice)} RSD.`,
    /** Opens habits in Profil (M5). Hidden until then: a link to nowhere is not shown. */
    edit: 'Promeni',
    equivalentsTitle: 'To je kao...',
    equivalentsNote: 'Poređenja se menjaju kako ušteđevina raste.',
    nextGoal: (amount: number) => `Sledeći cilj: ${formatNumber(amount)} RSD`,
    remaining: (amount: number) => `još ${formatNumber(amount)} RSD`,
    cigarettesLink: 'Uz to, nije zapaljeno',
    cigarettesCount: (n: number) => `${formatNumber(n)} ${cigareta(n)}`,
    share,
    finePrint:
      'Računica je okvirna i zavisi od broja cigareta i cene pakle. Svaki zabeležen posrtaj računamo kao zapaljene cigarete.',
  },

  cigarettes: {
    title: 'Odbijene cigarete',
    /** As Home's card: 1 cigareta odbijena, 2 cigarete odbijene, 5 cigareta odbijeno. */
    heroLabel: (n: number) =>
      plural(n, { one: 'cigareta odbijena', few: 'cigarete odbijene', other: 'cigareta odbijeno' }),
    period,
    totalTitle: 'Ukupno',
    packs: (n: number) => plural(n, { one: 'pakla', few: 'pakle', other: 'pakli' }),
    butts: (n: number) => `${plural(n, { one: 'opušak', few: 'opuška', other: 'opušaka' })} manje`,
    projectionTitle: 'Ako nastaviš',
    monthly: (n: number) => `${cigareta(n)} mesečno`,
    yearly: (n: number) => `${cigareta(n)} godišnje`,
    moneyLink: 'Uz to, ušteđeno',
    moneyAmount: (amount: number) => `${formatNumber(amount)} RSD`,
    share,
    finePrint:
      'Računica je okvirna i zavisi od broja cigareta dnevno. Pakla se računa kao 20 cigareta. Svaki zabeležen posrtaj računamo kao zapaljene cigarete.',
  },

  time: {
    title: 'Tvoje vreme',
    eyebrow: 'BEZ CIGARETE',
    /** The quit moment, under the counter: "od 15. septembra 2026. u 07:05". */
    period: (quitDate: Date) => `od ${formatDateTime(quitDate)}`,
    returnedTitle: 'Vreme koje je ostalo tebi',
    hours: (n: number) => `${formatNumber(n)} ${sati(n)}`,
    hoursSub: 'koje nije otišlo na pušenje',
    basis: 'Računamo 6 minuta po cigareti.',
    goalsTitle: 'Ciljevi',
    here: 'Ti si ovde',
    goalSub: 'bez cigarete',
    upcoming,
    share,
    finePrint:
      'Šest minuta je okvirno trajanje jedne cigarete. Ovo je vreme koje nije otišlo na pušenje, a ne procena dužine života. Svaki zabeležen posrtaj računamo kao zapaljene cigarete.',
  },

  /**
   * The CategoryScreen template's count line, "[n] / [m] dostignuto", as docs/M5-brief.md (Export
   * alignment 2) writes it. The export's own word was "postignuto".
   */
  category: {
    reached: (n: number, total: number) => `${n} / ${total} dostignuto`,
  },

  health: {
    title: 'Zdravlje',
    heading: 'Šta se dešava u telu',
    sub: 'Opšti tok oporavka prema javnim smernicama. Kod svakog je malo drugačije.',
    upcoming,
    finePrint:
      'Izvori: Svetska zdravstvena organizacija (WHO) i NHS, javno dostupne smernice. Opšti podaci, ne medicinski savet.',
  },
} as const;

/**
 * M5's Vreme goal titles, in the order of `TIME_GOAL_DAYS`, then "[n] godine" for every further
 * year (2 godine, 5 godina).
 */
const GOAL_TITLES: Record<number, string> = {
  1: 'Prvi dan',
  3: '3 dana',
  7: 'Prva nedelja',
  14: '2 nedelje',
  30: 'Prvi mesec',
  60: '2 meseca',
  90: '3 meseca',
  182: 'Pola godine',
  365: 'Godina dana',
};

export function goalTitle(days: number): string {
  const fixed = GOAL_TITLES[days];
  if (fixed) return fixed;
  const years = Math.round(days / 365);
  return `${years} ${plural(years, { one: 'godina', few: 'godine', other: 'godina' })}`;
}
