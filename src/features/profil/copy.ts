import { legalLinks, profil as legalProfil } from '@/features/legal/copy';
import { dani } from '@/features/home/copy';
import { formatNumber } from '@/lib/progress';
import { plural } from '@/lib/i18n/plural';

/**
 * Profil's copy, approved by Pavle in docs/M5-brief.md (Copy, 24.09.2026, and the section and row
 * names Export alignment 7 gives), verbatim and genderless. The consent and deletion lines stay in
 * `src/features/legal/copy.ts`, where the policy quotes them.
 */

const cigareta = (n: number) => plural(n, { one: 'cigareta', few: 'cigarete', other: 'cigareta' });

export const profilCopy = {
  title: legalProfil.title,
  headerLine: (days: number) => `${formatNumber(days)} ${dani(days)} bez cigarete`,

  sections: {
    profile: 'Moj profil',
    settings: 'Podešavanja',
    about: 'O Iskri',
    experience: 'Moje iskustvo',
  },

  rows: {
    nameGender: 'Ime i pol',
    quitDate: 'Datum prestanka',
    habits: 'Stare navike',
    /** "20 cigareta · 350 RSD" */
    habitsValue: (perDay: number, price: number) =>
      `${perDay} ${cigareta(perDay)} · ${formatNumber(price)} RSD`,
    privacy: legalLinks.privacy,
    terms: legalLinks.terms,
    science: 'Naučna osnova',
    rate: 'Oceni aplikaciju',
    suggest: 'Predloži funkciju',
    problem: 'Problem? Piši nam',
    newQuitDate: 'Novi datum prestanka',
    signOut: 'Odjava',
  },

  notifications: {
    title: 'Obaveštenja',
    checkin: 'Dnevna provera',
    goals: 'Ciljevi',
    risky: 'Rizični trenuci',
    quiet: 'Ne šaljemo ništa između 22 i 8 časova.',
    permissionOff: 'Obaveštenja su isključena u podešavanjima telefona.',
    openSettings: 'Otvori podešavanja',
  },

  quitConfirm: {
    title: 'Promeniti datum prestanka?',
    body: 'Brojač dana, novac i ciljevi računaju se od novog datuma. Posrtaji ostaju zabeleženi.',
    confirm: 'Promeni',
    cancel: 'Otkaži',
  },

  /** The slip flow's approved "Sačuvaj", for the edit screens. */
  save: 'Sačuvaj',
  footer: (version: string) => `Iskra ${version} · Napravljeno u Srbiji`,
} as const;

/** The website's contact address (`LEGAL.email` in iskra-website-final/src/lib/legal.ts). */
export const CONTACT_EMAIL = 'hello@iskraclub.com';

/** "Naučna osnova" opens the sources on the terms page. */
export const SOURCES_URL = 'https://www.iskraclub.com/uslovi#izvori';
