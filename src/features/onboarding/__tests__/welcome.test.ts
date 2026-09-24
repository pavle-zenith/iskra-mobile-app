import { readFileSync } from 'fs';
import { join } from 'path';

import { copy } from '../copy';

/**
 * Guards on the welcome intro (docs/WELCOME-brief.md), checked against the source. The intro is
 * the one screen a person sees before consent, so what it must not do (store anything, move on
 * by itself, ignore Reduce Motion) is an ordering or an absence that a render would not catch.
 * Same convention as the consent gate guards. Comments are stripped first.
 */
const source = readFileSync(join(__dirname, '..', 'WelcomeIntro.tsx'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\s\/\/.*$/gm, '');

describe('the welcome intro', () => {
  it('stores nothing: it only asks whether consent exists', () => {
    const repoImport = source.match(/import \{([^}]*)\} from '@\/data\/repo'/);
    expect(repoImport?.[1]?.trim()).toBe('hasConsented');
    expect(source).not.toMatch(/@\/data\/(db|sync|auth|spine|account)'/);
  });

  it('hands over to consent before step 1 when consent is missing', () => {
    expect(source).toMatch(
      /if \(await hasConsented\(\)\)[\s\S]*step: 'name'[\s\S]*else[\s\S]*'\/onboarding\/consent'/,
    );
  });

  it('never moves forward on its own', () => {
    expect(source).not.toMatch(/setInterval|setTimeout|autoplay/i);
  });

  it('lets Preskoči land on the last beat, never past it, and hides it there', () => {
    expect(source).toMatch(/index < LAST \?[\s\S]*onPress=\{\(\) => goTo\(LAST\)\}/);
    expect(source).toMatch(/const target = Math\.max\(0, Math\.min\(LAST, next\)\)/);
  });

  it('moves one beat per Dalje: the pager position is never a live prop', () => {
    // iOS writes a changed contentOffset straight onto the scroll view. Fed from `index`, it
    // fought the animated scrollTo and one Dalje went from beat 1 to beat 3.
    expect(source).toMatch(/const \[startOffset\] = useState\(/);
    expect(source).toContain('contentOffset={startOffset}');
    // While a button's scroll is in flight, its passing offsets do not set the beat.
    expect(source).toMatch(/if \(scrollingTo\.current !== null\) \{[\s\S]*?return;\s*\}/);
  });

  it('leaves the status bar dark once another screen is in front', () => {
    // The intro stays mounted under consent and every step; a light bar left behind was white
    // on paper for the whole of onboarding.
    expect(source).toContain("<StatusBar style={focused ? 'light' : 'dark'} />");
  });

  it('keeps Preskoči at the 48pt target floor', () => {
    expect(source).toMatch(/hitSlop=\{SKIP_SLOP\}/);
    expect(source).toMatch(
      /const SKIP_SLOP = \{ top: \(minTarget - 36\) \/ 2, bottom: \(minTarget - 36\) \/ 2 \}/,
    );
  });

  it('respects Reduce Motion: no drift, no slide, no cross-fade', () => {
    expect(source).toContain('useReducedMotion()');
    expect(source).toMatch(/if \(reduceMotion\) \{\s*cancelAnimation\(scale\)/);
    expect(source).toContain('animated: !reduceMotion');
    expect(source).toContain('instant={reduceMotion}');
  });

  it('bundles all three paintings, so it renders offline on first launch', () => {
    for (const beat of copy.welcome.beats)
      expect(source).toMatch(
        new RegExp(`require\\('@assets/welcome/welcome-\\d-${beat.art}\\.jpg'\\)`),
      );
    expect(source).not.toMatch(/uri:\s*['`]http/);
  });

  it('takes every colour from the theme', () => {
    expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(source).not.toMatch(/rgba?\(/);
  });
});
