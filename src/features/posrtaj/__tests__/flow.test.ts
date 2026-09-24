import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { hasMissingCopy } from '@/lib/i18n/missingCopy';
import { TRIGGER_KEYS } from '@/lib/vocab';

import { posrtaj } from '../copy';

/**
 * Guards on the slip flow and on the two paths that used to write a craving that never happened
 * (docs/M5-brief.md, Export alignment 8; HOME-V2: reading your reasons on Home is not a craving).
 * The Poriv stack's provider opens a craving when there is none, so nothing that is not a craving
 * may route into it. Source checks, comments stripped.
 */
const src = join(__dirname, '..', '..', '..');
const read = (path: string) =>
  readFileSync(join(src, path), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s\/\/.*$/gm, '');

describe('what is not a craving never enters the Poriv stack', () => {
  const home = read('features/home/HomeScreen.tsx');

  it('opens Moji razlozi from Home outside it', () => {
    expect(home).toContain("router.push('/razlozi')");
    expect(home).not.toContain("'/poriv/alat/razlozi'");
    expect(existsSync(join(src, 'app', 'razlozi.tsx'))).toBe(true);
  });

  it('opens the slip flow from the check-in outside it, carrying the slip', () => {
    expect(home).toMatch(
      /router\.push\(\{ pathname: '\/posrtaj', params: \{ slip: row\.id \} \}\)/,
    );
    expect(home).not.toContain("'/poriv/slip'");
  });

  it('keeps the slip flow out of /poriv, and Mode hands it the slip and the craving', () => {
    for (const route of ['index', 'razlog', 'rekap']) {
      expect(existsSync(join(src, 'app', 'posrtaj', `${route}.tsx`))).toBe(true);
    }
    expect(existsSync(join(src, 'app', 'poriv', 'slip.tsx'))).toBe(false);
    const mode = read('features/poriv/ModeScreen.tsx');
    expect(mode).toMatch(
      /pathname: '\/posrtaj',\s*params: \{ slip: ended\.slipId \?\? '', craving: craving\?\.id \?\? '' \}/,
    );
  });
});

describe('the slip flow', () => {
  const flow = read('features/posrtaj/SlipFlow.tsx');

  it('never touches the quit date', () => {
    expect(flow).not.toMatch(/quitDate|quit_date/);
  });

  it('stores the count on the slip, and a trigger on both the slip and its craving', () => {
    expect(flow).toContain('updateSlip(slipId, { cigarettes: count })');
    expect(flow).toContain('updateSlip(slipId, { trigger })');
    expect(flow).toContain('updateCraving(cravingId, { trigger })');
  });

  it('owes only the explanation per trigger', () => {
    const lines = Object.entries(posrtaj)
      .filter(([, value]) => typeof value === 'string')
      .map(([, value]) => value as string);
    for (const line of lines) expect(hasMissingCopy(line)).toBe(false);
    for (const key of TRIGGER_KEYS) expect(hasMissingCopy(posrtaj.explanation(key))).toBe(true);
  });

  it('has no gendered slashes or em dashes', () => {
    const strings = [
      ...(Object.values(posrtaj) as unknown[]).filter(
        (value): value is string => typeof value === 'string',
      ),
      posrtaj.recap(47),
      posrtaj.countUnit(3),
    ];
    for (const line of strings) {
      expect(line).not.toMatch(/[—–]/);
      expect(line).not.toMatch(/[a-zčćšžđ]\/[a-zčćšžđ]/i);
    }
  });
});
