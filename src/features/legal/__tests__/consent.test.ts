import { hasMissingCopy } from '@/lib/i18n/missingCopy';

import { canAccept, INITIAL_CHOICES } from '../consent';
import { consent, legalLinks, profil } from '../copy';
import { LEGAL_URLS } from '../links';

describe('canAccept', () => {
  it('starts with every box unticked, the optional one included', () => {
    expect(INITIAL_CHOICES).toEqual({ age: false, data: false, analytics: false });
    expect(canAccept(INITIAL_CHOICES)).toBe(false);
  });

  it('needs both required boxes, each on its own', () => {
    expect(canAccept({ age: true, data: false, analytics: false })).toBe(false);
    expect(canAccept({ age: false, data: true, analytics: false })).toBe(false);
    expect(canAccept({ age: true, data: true, analytics: false })).toBe(true);
  });

  it('never lets analytics stand in for consent, or be required for it', () => {
    expect(canAccept({ age: false, data: false, analytics: true })).toBe(false);
    expect(canAccept({ age: true, data: true, analytics: true })).toBe(true);
  });
});

describe('the consent copy', () => {
  const lines = [...Object.values(consent), ...Object.values(legalLinks)];

  it('is complete: every line is Pavle’s approved text, nothing owed', () => {
    for (const line of lines)
      expect({ line, owed: hasMissingCopy(line) }).toEqual({ line, owed: false });
  });

  it('keeps the age line apart from the consent sentence, as the brief requires', () => {
    expect(consent.data).not.toMatch(/18/);
    expect(consent.age).toMatch(/18/);
  });

  it('carries no gendered slash, no em dash and no English', () => {
    for (const line of lines) {
      expect(line).not.toMatch(/\p{L}\s*\/\s*\p{L}/u);
      expect(line).not.toMatch(/—/);
      expect(line).not.toMatch(/\b(the|and|privacy|terms|consent|accept)\b/i);
    }
  });

  it('says the server is in the European Union, which is where the project is', () => {
    // Supabase project aaknvhlirztdglxsnbho runs in eu-west-1 (Ireland).
    expect(consent.body).toMatch(/Evropskoj uniji/);
  });

  it('links the one policy and the one set of terms the site publishes', () => {
    expect(LEGAL_URLS).toEqual({
      privacy: 'https://iskraclub.com/privatnost',
      terms: 'https://iskraclub.com/uslovi',
    });
  });
});

/**
 * Profil's lines were answered in docs/M4-copy-answers.md. None may go missing again without a
 * marker showing up here.
 */
describe('Profil copy', () => {
  it('owes nothing', () => {
    const owed = Object.entries(profil)
      .filter(([, value]) => hasMissingCopy(value))
      .map(([key]) => key);
    expect(owed).toEqual([]);
  });

  it('has no slashes or em dashes', () => {
    for (const value of Object.values(profil)) {
      expect(value).not.toMatch(/[—–]/);
      expect(value).not.toMatch(/[a-zčćšžđ]\/[a-zčćšžđ]/i);
    }
  });

  it('labels the delete button exactly as the policy quotes it', () => {
    expect(profil.deleteAll).toBe('Obriši sve podatke');
  });
});
