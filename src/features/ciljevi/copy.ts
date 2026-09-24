import { progressCopy, goalTitle as timeGoalTitle } from '@/features/napredak/copy';
import { missingCopy } from '@/lib/i18n/missingCopy';
import { plural } from '@/lib/i18n/plural';
import { formatNumber, HEALTH_ITEMS, timeLeft, type Goal, type GoalCategory } from '@/lib/progress';

/**
 * Ciljevi's copy, approved by Pavle in docs/M5-brief.md (Copy, 24.09.2026), verbatim and
 * genderless. Titles and subs per category come from the brief's table; counts go through
 * `plural()`. A string the brief does not give is `missingCopy()`, listed in
 * docs/M5-copy-todo.md.
 */

const cigareta = (n: number) => plural(n, { one: 'cigareta', few: 'cigarete', other: 'cigareta' });
const poriva = (n: number) => plural(n, { one: 'poriv', few: 'poriva', other: 'poriva' });

export const ciljevi = {
  title: 'Napredak',
  reachedCount: (n: number) => `Dostignuto: ${n}`,
  /** The two grid sections: the count line's word, and the brief's "Sledeće". */
  reachedSection: 'Dostignuto',
  nextSection: 'Sledeće',
  categories: {
    vreme: 'Vreme',
    novac: 'Novac',
    cigarete: 'Cigarete',
    porivi: 'Porivi',
    provere: 'Provere',
    zdravlje: 'Zdravlje',
  } satisfies Record<GoalCategory, string>,
  /** The roadmap's title, the approved section name on Home. */
  roadmapTitle: 'Moj napredak',
  share: 'Podeli',
  celebration: { title: 'Cilj dostignut', cta: 'Nastavi', share: 'Podeli' },
} as const;

function healthItem(goal: Goal) {
  return HEALTH_ITEMS.find((item) => item.key === goal.healthKey);
}

/** "Prva nedelja", "10.000 RSD", "500 cigareta", "Prvi poriv", "7 zabeleženih dana", "12 sati". */
export function goalTitle(goal: Goal): string {
  const n = goal.threshold;
  switch (goal.category) {
    case 'vreme':
      return timeGoalTitle(n);
    case 'novac':
      return `${formatNumber(n)} RSD`;
    case 'cigarete':
      return `${formatNumber(n)} ${cigareta(n)}`;
    case 'porivi':
      return n === 1 ? 'Prvi poriv' : `${formatNumber(n)} ${poriva(n)}`;
    case 'provere':
      return `${formatNumber(n)} zabeleženih dana`;
    case 'zdravlje':
      return healthItem(goal)?.at ?? '';
  }
}

/** The line under the title: "bez cigarete", "ušteđeno", or a health item's text. */
export function goalSub(goal: Goal): string {
  switch (goal.category) {
    case 'vreme':
    case 'provere':
      return 'bez cigarete';
    case 'novac':
      return 'ušteđeno';
    case 'cigarete':
      return 'nije zapaljeno';
    case 'porivi':
      return 'iza tebe';
    case 'zdravlje':
      return healthItem(goal)?.text ?? '';
  }
}

/** What is still to go: "za 5 dana", "još 1.200 RSD", "još 77 poriva", "još 400 cigareta". */
export function goalLeft(goal: Goal): string {
  const { left } = goal;
  if (left.kind === 'time') return progressCopy.health.upcoming(timeLeft(left.ms));
  if (left.kind === 'rsd') return `još ${formatNumber(left.amount)} RSD`;
  switch (goal.category) {
    case 'porivi':
      return `još ${formatNumber(left.amount)} ${poriva(left.amount)}`;
    case 'cigarete':
      return `još ${formatNumber(left.amount)} ${cigareta(left.amount)}`;
    default:
      return missingCopy('još [n] provera');
  }
}
