/**
 * Serbian gendered forms. The user is the subject of nearly every onboarding sentence, and
 * Serbian past-tense verbs and many adjectives inflect for them.
 *
 * Three rules, in order:
 *   1. Never a slash. "prestao/la" is banned by PRODUCT.md, whatever the design export does.
 *   2. Never masculine by default. An unset gender is not a man.
 *   3. Never invent Serbian. A form that does not exist yet renders as a visible marker and
 *      goes on the list in docs/M2-copy-todo.md for Pavle.
 *
 * So `muško` and `žensko` read correctly today. `drugo` and unset need a genderless rewrite
 * per token, which the copy brief asks for but never supplies: it only offers the slash form,
 * which rule 1 forbids. Those are the markers.
 *
 * Forms are verbatim from ONBOARDING_COPY_BRIEF.md section 2.
 */
import { GENDERS, type Gender } from '@/lib/vocab';

export type GenderCode = 'm' | 'f' | 'x';

export type GenderToken =
  | 'prestao'
  | 'pusio'
  | 'poceo'
  | 'spreman'
  | 'siguran'
  | 'slobodan'
  | 'posvecen'
  | 'izdrzao'
  | 'zapalio'
  | 'odoleo'
  | 'rekao'
  | 'hteo'
  | 'mogao'
  | 'zavrsio'
  | 'vratio'
  | 'preziveo'
  | 'sam'
  | 'mislio'
  | 'iskren'
  | 'izabrao'
  | 'strpljiv'
  | 'predao'
  | 'trosio'
  | 'odlagao';

type Forms = {
  m: string;
  f: string;
  /** The genderless rewrite. `null` means Pavle still owes one; never a slash. */
  x: string | null;
};

const TOKENS: Record<GenderToken, Forms> = {
  prestao: { m: 'prestao', f: 'prestala', x: null },
  pusio: { m: 'pušio', f: 'pušila', x: null },
  poceo: { m: 'počeo', f: 'počela', x: null },
  spreman: { m: 'spreman', f: 'spremna', x: null },
  siguran: { m: 'siguran', f: 'sigurna', x: null },
  slobodan: { m: 'slobodan', f: 'slobodna', x: null },
  posvecen: { m: 'posvećen', f: 'posvećena', x: null },
  izdrzao: { m: 'izdržao', f: 'izdržala', x: null },
  zapalio: { m: 'zapalio', f: 'zapalila', x: null },
  odoleo: { m: 'odoleo', f: 'odolela', x: null },
  rekao: { m: 'rekao', f: 'rekla', x: null },
  hteo: { m: 'hteo', f: 'htela', x: null },
  mogao: { m: 'mogao', f: 'mogla', x: null },
  zavrsio: { m: 'završio', f: 'završila', x: null },
  vratio: { m: 'vratio', f: 'vratila', x: null },
  preziveo: { m: 'preživeo', f: 'preživela', x: null },
  sam: { m: 'sam', f: 'sama', x: null },
  // Footnote tokens: introduced in the brief's prose, never added to its table.
  mislio: { m: 'mislio', f: 'mislila', x: null },
  iskren: { m: 'iskren', f: 'iskrena', x: null },
  izabrao: { m: 'izabrao', f: 'izabrala', x: null },
  strpljiv: { m: 'strpljiv', f: 'strpljiva', x: null },
  predao: { m: 'predao', f: 'predala', x: null },
  // The brief writes these two without diacritics; Pavle to confirm `trošio` / `trošila`.
  trosio: { m: 'trosio', f: 'trosila', x: null },
  odlagao: { m: 'odlagao', f: 'odlagala', x: null },
};

export const GENDER_TOKENS = Object.keys(TOKENS) as GenderToken[];

/** Tokens with no genderless rewrite yet. Empty is the goal; see docs/M2-copy-todo.md. */
export const TOKENS_MISSING_REWRITE = GENDER_TOKENS.filter((token) => TOKENS[token].x === null);

/**
 * A missing Serbian string, rendered so nobody mistakes it for copy. Loud on purpose: it is
 * meant to be impossible to miss in review, and it can never read as a slash or as masculine.
 */
export function missingCopy(what: string): string {
  return `«TODO(copy): ${what}»`;
}

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

/** The gender-correct form, or a marker when the genderless rewrite is still owed. */
export function g(token: GenderToken, gender: GenderCode): string {
  const forms = TOKENS[token];
  if (gender === 'm') return forms.m;
  if (gender === 'f') return forms.f;
  return forms.x ?? missingCopy(`${token} (genderless)`);
}

/** True when a string still carries a placeholder, so screens can be checked in a test. */
export function hasMissingCopy(value: string): boolean {
  return value.includes('«TODO(copy)');
}
