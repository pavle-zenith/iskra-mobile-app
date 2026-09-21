import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * The panic demo teaches the core feature by doing, at step 7. It must never write a
 * `cravings` row: that table is the only honest measure of whether Iskra works, and an
 * onboarding tap on every install would pollute it from day one (M2 brief, PRODUCT.md).
 *
 * Checked against the source, because the mistake this guards against is someone wiring the
 * real logger into the demo later, which no rendering test would notice.
 */
const onboardingDir = join(__dirname, '..');

const sources = [
  'screens/ceremony.tsx',
  'screens/questions.tsx',
  'screens/aha.tsx',
  'components.tsx',
  'OnboardingProvider.tsx',
].map((file) => ({ file, text: readFileSync(join(onboardingDir, file), 'utf8') }));

describe('onboarding never logs a craving', () => {
  it('imports no craving writer anywhere in the flow', () => {
    for (const { file, text } of sources) {
      expect({ file, uses: text.includes('logCraving') }).toEqual({ file, uses: false });
      expect({ file, uses: text.includes('updateCraving') }).toEqual({ file, uses: false });
    }
  });

  it('keeps the panic step to navigation and haptics', () => {
    const ceremony = sources.find((source) => source.file === 'screens/ceremony.tsx')?.text ?? '';
    const panic = ceremony.slice(
      ceremony.indexOf('export function PanicStep'),
      ceremony.indexOf('export function CommitmentStep'),
    );
    expect(panic).toContain('goNext');
    expect(panic).not.toMatch(/craving/i);
  });
});
