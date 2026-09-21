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
    expect(provider).toContain('finishCraving(current, outcome)');
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

describe('a craving is written once, however many times a screen renders', () => {
  it('keeps every session callback off the craving row, so none of them churns', () => {
    // A callback that depends on the row changes identity on every write, and any effect that
    // calls it then fires again. That is what made the tool route write in a loop.
    for (const name of ['openTool', 'note', 'finish', 'dismiss']) {
      const start = provider.indexOf(`const ${name} = useCallback(`);
      expect({ name, found: start > -1 }).toEqual({ name, found: true });
      const deps = provider.slice(start, provider.indexOf('  );', start));
      expect({ name, readsRow: deps.includes('cravingRef.current') }).toEqual({
        name,
        readsRow: true,
      });
      expect({ name, dependsOnRow: /\[\s*(remember,\s*)?craving\s*\]/.test(deps) }).toEqual({
        name,
        dependsOnRow: false,
      });
    }
  });

  it('keys the tool effect on the craving id, not on the callback alone', () => {
    const effect = toolRoute.slice(
      toolRoute.indexOf('useEffect('),
      toolRoute.indexOf('if (!valid)'),
    );
    expect(effect).toContain('cravingId');
  });
});

describe('one tap, one row', () => {
  it('claims the ending with a ref before it awaits anything', () => {
    const claim = modeScreen.slice(
      modeScreen.indexOf('const claim ='),
      modeScreen.indexOf('const close ='),
    );
    expect(claim).toContain('endingRef.current');
    // The ref must be set synchronously, or two taps in one frame both get through.
    expect(claim.indexOf('endingRef.current = true')).toBeGreaterThan(
      claim.indexOf('if (!craving || endingRef.current)'),
    );
  });

  it('guards Home with a ref too, not only with state', () => {
    expect(home).toContain('startingRef.current');
  });

  it('refuses a second outcome at the data layer, not only in the UI', () => {
    const complete = readFileSync(join(featureDir, '..', '..', 'data', 'repo.ts'), 'utf8');
    const body = complete.slice(
      complete.indexOf('export async function completeCraving'),
      complete.indexOf('export async function listCravings'),
    );
    // The check and the write share one transaction, so two callers cannot both pass it.
    expect(body).toContain('current.outcome !== null');
    expect(body).toContain('await write(');
  });

  it('navigates only when this call is the one that ended the craving', () => {
    const end = modeScreen.slice(
      modeScreen.indexOf('const end ='),
      modeScreen.indexOf('\n  return ('),
    );
    expect(end).toContain('const ended = await finish(outcome)');
    expect(end.indexOf('if (!ended) return')).toBeLessThan(end.indexOf('router.replace'));
  });

  it('disables every outcome control until the row exists', () => {
    expect(modeScreen).toContain('const ready = !!craving && !ending');
    expect((modeScreen.match(/disabled=\{!ready\}/g) ?? []).length).toBe(3);
  });
});

describe('the slip and its craving agree', () => {
  it('carries the later trigger tap onto the slips row as well', () => {
    expect(provider).toContain('updateSlip(slipRef.current');
    expect(outcome).toContain('slipId');
  });

  it('keeps the chips on screen once one is tapped', () => {
    // Hidden only when the screen opened with a trigger already set, never because of this tap.
    expect(outcomes).toContain('askedAlready');
    expect(outcomes).not.toContain('if (craving?.trigger) return null;');
  });
});

describe('Home shows the right day', () => {
  it('reloads when the app returns to the foreground, not only on navigation', () => {
    expect(home).toContain("AppState.addEventListener('change'");
    expect(home).toContain("next === 'active'");
  });

  it('counts today in the anchor zone on Success, as Home does', () => {
    expect(outcomes).toContain('resolveAnchorTimeZone');
    expect(outcomes).toContain('survivedOn(rows, new Date(), zone)');
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
