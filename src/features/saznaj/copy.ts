import { missingCopy } from '@/lib/i18n/missingCopy';

/**
 * Saznaj's copy, approved by Pavle in docs/M5-brief.md (Copy, 24.09.2026), verbatim. The section
 * names are the brief's own ("the 2-column Kategorije grid ... then Novo"). The word after a
 * topic's post count has no approved form yet: docs/M5-copy-todo.md.
 */
export const saznaj = {
  title: 'Saznaj',
  sub: 'Tekstovi sa iskraclub.com o prestanku pušenja.',
  all: 'Sve',
  categoriesTitle: 'Kategorije',
  newTitle: 'Novo',
  minutes: (n: number) => `${n} min čitanja`,
  count: (n: number) => `${n} ${missingCopy('članak')}`,
  offline: 'Nema interneta. Tekstovi se otvaraju kad se povežeš.',
} as const;
