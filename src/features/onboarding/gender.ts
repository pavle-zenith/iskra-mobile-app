/**
 * Serbian gendered forms. The user is the subject of nearly every onboarding sentence, and
 * Serbian past-tense verbs and many adjectives inflect for them.
 *
 * Three rules, in order:
 *   1. Never a slash. "prestao/la" is banned by PRODUCT.md, whatever the design export does.
 *   2. Never masculine by default. An unset gender is not a man.
 *   3. Never invent Serbian. A form that does not exist yet renders as a visible marker.
 *
 * A word-level genderless form does not exist in Serbian: a rewrite changes the sentence around
 * the word, not the word itself ("Budi iskren" becomes "Odgovori iskreno"). So Pavle's answers
 * (21.09.2026) took most sentences genderless outright, which deleted their tokens, and branched
 * the rest: the four tokens below keep `m` and `f`, and every sentence that uses one supplies its
 * own `x` sentence. (`hteo` went with the old splash, whose welcome intro replacement is
 * genderless for everyone.)
 *
 * `x` is therefore always null here, and `g(token, 'x')` returns a marker. That is the safety
 * net, not the plan: a marker on screen means someone added a gendered sentence without an `x`
 * branch. A new token is only ever added together with the screen that needs it.
 */
import { missingCopy } from '@/lib/i18n/missingCopy';
import { GENDERS, type Gender } from '@/lib/vocab';

export type GenderCode = 'm' | 'f' | 'x';

export type GenderToken = 'prestao' | 'pusio' | 'spreman' | 'trosio';

type Forms = {
  m: string;
  f: string;
  /** Always null: there is no genderless word, only a genderless sentence. Never a slash. */
  x: null;
};

const TOKENS: Record<GenderToken, Forms> = {
  prestao: { m: 'prestao', f: 'prestala', x: null },
  pusio: { m: 'pušio', f: 'pušila', x: null },
  spreman: { m: 'spreman', f: 'spremna', x: null },
  trosio: { m: 'trošio', f: 'trošila', x: null },
};

export const GENDER_TOKENS = Object.keys(TOKENS) as GenderToken[];

export function genderCode(gender: Gender | string | null | undefined): GenderCode {
  if (gender === 'muško') return 'm';
  if (gender === 'žensko') return 'f';
  return 'x';
}

export function genderFromCode(code: GenderCode): Gender | null {
  if (code === 'm') return GENDERS[0];
  if (code === 'f') return GENDERS[1];
  return GENDERS[2];
}

/** The gender-correct form. For `x` it marks: the caller owes a branched sentence. */
export function g(token: GenderToken, gender: GenderCode): string {
  const forms = TOKENS[token];
  if (gender === 'm') return forms.m;
  if (gender === 'f') return forms.f;
  return missingCopy(`${token} (x sentence)`);
}

export { hasMissingCopy, missingCopy } from '@/lib/i18n/missingCopy';
