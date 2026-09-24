/**
 * Consent and Profil (docs/LEGAL-brief.md).
 *
 * The consent screen's copy is Pavle's, approved 23.09.2026, verbatim and genderless. Profil's
 * lines were answered in docs/M4-copy-answers.md. An agent writes no Serbian here.
 */

export const legalLinks = {
  privacy: 'Politika privatnosti',
  terms: 'Uslovi korišćenja',
} as const;

export const consent = {
  title: 'Pre nego što počnemo',
  body: 'Iskra na tvom telefonu i na serveru u Evropskoj uniji čuva ono što uneseš: navike pušenja, porive, posrtaje i dnevne provere. To su podaci o zdravlju, pa nam treba tvoj izričit pristanak.',
  /** Required, and its own box: the age line is never buried in the consent sentence. */
  age: 'Imam 18 ili više godina.',
  /** Required. */
  data: 'Pristajem da Iskra čuva i obrađuje moje podatke o pušenju i porivima, kako piše u Politici privatnosti.',
  /** Optional, unticked. */
  analytics:
    'Pristajem na analitiku korišćenja, bez teksta koji sam napišem, da bi aplikacija bila bolja.',
  cta: 'Prihvatam i nastavljam',
} as const;

export const profil = {
  /** The screen's name, as the policy draft calls it ("u Profilu"). */
  title: 'Profil',
  account: 'Nalog',
  /** Bound to `marketing_consent`; shown only once the account has an email to send to. */
  marketing: 'Emailovi sa savetima',
  analytics: 'Analitika',
  /** The policy quotes this label verbatim, so it must not drift. */
  deleteAll: 'Obriši sve podatke',

  // Answered in docs/M4-copy-answers.md, 24.09.2026.
  accountIdHint: 'Ako nam pišeš u vezi sa svojim podacima, navedi ovu oznaku.',
  marketingHint:
    'Povremeni saveti i novosti o Iskri. Odjava je moguća u svakom trenutku, ovde ili iz samog emaila.',
  analyticsHint:
    'Kad je isključena, ne šaljemo podatke o tome kako se aplikacija koristi. Sve ostalo radi isto.',
  deleteTitle: 'Obrisati sve podatke?',
  /** Also covers the offline case: no separate line or screen is needed for it. */
  deleteBody:
    'Brišemo nalog i sve što je uneto, sa telefona i sa servera. Ovo ne može da se poništi. Bez interneta, deo na serveru se briše čim se telefon ponovo poveže.',
  deleteConfirm: 'Obriši sve',
  deleteCancel: 'Odustani',
  /** The same word as the progress screens' back button. */
  back: 'Nazad',
} as const;
