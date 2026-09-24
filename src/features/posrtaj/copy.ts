import { dani, home } from '@/features/home/copy';
import { slip as m3Slip } from '@/features/poriv/copy';
import { missingCopy } from '@/lib/i18n/missingCopy';
import { plural } from '@/lib/i18n/plural';
import { formatNumber } from '@/lib/progress';
import type { TriggerKey } from '@/lib/vocab';

/**
 * The slip flow's copy (docs/M5-brief.md Task 6 and Export alignment 8). Pavle's approved lines:
 * M3's slip screen, Home's absolution line, the M5 count, note and recap lines, and the two
 * buttons the brief names for the export's Slip screen. The explanatory card per trigger is
 * Pavle's to write: `missingCopy()`, listed in docs/M5-copy-todo.md.
 */

const cigareta = (n: number) => plural(n, { one: 'cigareta', few: 'cigarete', other: 'cigareta' });

export const posrtaj = {
  header: m3Slip.header,
  lead: m3Slip.lead,
  totalEyebrow: home.timer.eyebrow,
  /** The line under the total: it never resets. */
  totalNote: home.postSlipSub,
  count: 'Koliko cigareta?',
  countUnit: (n: number) => cigareta(n),
  continue: 'Nastavljam',
  reflect: 'Šta me je nateralo?',

  reflectTitle: m3Slip.triggerQuestion,
  notePlaceholder: 'Šta se desilo? Nije obavezno.',
  /** One card per trigger, as in the export. The export's lines are gendered and unsourced. */
  explanation: (trigger: TriggerKey) => missingCopy(`objašnjenje za okidač „${trigger}"`),

  recap: (days: number) => `Ukupno ${formatNumber(days)} ${dani(days)} bez cigarete.`,
  recapLead: 'Ne krećeš od nule.',
  reasonsTitle: home.reasonsTitle,
  next: 'Nastavi',
} as const;
