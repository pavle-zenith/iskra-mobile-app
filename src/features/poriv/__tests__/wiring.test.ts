import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Guards on the craving write paths, checked against the source.
 *
 * These catch the mistakes no rendering test would notice: a navigation that runs before the
 * row is written, an X that quietly marks a craving survived, a slip that touches the quit
 * date. The `cravings` table is the only honest measure of whether Iskra works, so its writes
 * are pinned here rather than trusted.
 *
 * Same convention as the M2 panic-demo guard.
 */
const featureDir = join(__dirname, '..');
const read = (path: string) => readFileSync(join(featureDir, path), 'utf8');

/** Comments say what the code must not do; these guards are about what it does. */
const code = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const home = readFileSync(join(featureDir, '..', 'home', 'HomeScreen.tsx'), 'utf8');
const provider = read('PorivSession.tsx');
const modeScreen = read('ModeScreen.tsx');
const outcomes = read('OutcomeScreens.tsx');
const outcome = read('outcome.ts');
const toolRoute = readFileSync(
  join(featureDir, '..', '..', 'app', 'poriv', 'alat', '[tool].tsx'),
  'utf8',
);

describe('the row exists before Mode does', () => {
  it('awaits logCraving before navigating from Home', () => {
    const body = home.slice(home.indexOf('const beginCraving'), home.indexOf('// Paper, not'));
    expect(body).toContain('await logCraving()');
    // The write must come first in the source, so no frame of Mode renders without the row.
    expect(body.indexOf('await logCraving()')).toBeLessThan(body.indexOf("router.push('/poriv')"));
  });

  it('opens a craving from a deep link too, so iskra://poriv is never empty', () => {
    expect(provider).toContain('await logCraving()');
  });
});

describe('the outcome is never guessed', () => {
  it('leaves outcome null when Mode is closed with the X', () => {
    const close = modeScreen.slice(
      modeScreen.indexOf('const close ='),
      modeScreen.indexOf('const end ='),
    );
    expect(close).toContain('dismiss()');
    expect(close).not.toContain('finish(');
    expect(close).not.toMatch(/survived|slipped/);
  });

  it('writes a duration with every outcome', () => {
    expect(outcome).toContain('outcome,');
    expect(outcome).toContain('durationSeconds(craving.created_at');
  });

  it('keeps one path for both endings, so the harness proves what ships', () => {
    // The provider delegates rather than repeating the writes; the dev harness calls the
    // same function, which is what makes a runtime check of it meaningful.
    expect(provider).toContain('finishCraving(craving, outcome)');
    expect(code(provider)).not.toContain('logSlip');
    expect(read('../../data/devCommands.ts')).toContain('finishCraving(');
  });

  it('records the tool the moment it is opened, not when it closes', () => {
    expect(toolRoute).toContain('openTool(tool)');
    const openTool = provider.slice(
      provider.indexOf('const openTool ='),
      provider.indexOf('const note ='),
    );
    expect(openTool).toContain('toolUsed: tool');
  });
});

describe('a slip never moves the day count', () => {
  it('writes its own slips row and carries the trigger across', () => {
    expect(outcome).toContain('logSlip(');
    expect(outcome).toContain('trigger');
    expect(outcome).toContain("outcome === 'slipped'");
  });

  it('touches neither quit_date nor the profile anywhere in Poriv mod', () => {
    for (const [name, source] of Object.entries({ provider, modeScreen, outcomes, outcome })) {
      const body = code(source);
      expect({ name, writes: body.includes('updateProfile') }).toEqual({ name, writes: false });
      expect({ name, writes: body.includes('quitDate') }).toEqual({ name, writes: false });
      expect({ name, writes: body.includes('quit_date') }).toEqual({ name, writes: false });
    }
  });
});

describe('nothing interrupts a craving', () => {
  it('keeps the screen awake in Mode and in every tool', () => {
    expect(modeScreen).toContain('useKeepAwake()');
    expect(read('ToolShell.tsx')).toContain('useKeepAwake()');
  });

  it('asks for no permission and sends no notification anywhere in Poriv mod', () => {
    for (const path of [
      'ModeScreen.tsx',
      'ToolShell.tsx',
      'toolScreens.tsx',
      'Disem.tsx',
      'OutcomeScreens.tsx',
      'PorivSession.tsx',
    ]) {
      const source = read(path);
      expect({ path, uses: source.includes('expo-notifications') }).toEqual({ path, uses: false });
      expect({ path, uses: source.includes('requestPermission') }).toEqual({ path, uses: false });
      expect({ path, uses: /Alert\./.test(source) }).toEqual({ path, uses: false });
    }
  });

  it('offers no rating prompt and no share in M3', () => {
    for (const path of ['OutcomeScreens.tsx', 'ModeScreen.tsx']) {
      const source = read(path);
      expect(source).not.toMatch(/StoreReview|requestReview|Share\./);
    }
  });
});
