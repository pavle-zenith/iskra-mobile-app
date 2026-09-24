import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Guards on the consent gate and on deletion, checked against the source.
 *
 * Both are orderings: nothing may be stored or signed in before consent, and the phone must be
 * wiped before the server is asked. A rendering test would not notice either being reversed,
 * and a reversal here is a privacy failure rather than a visual one. Same convention as the
 * Poriv wiring guards. Comments are stripped first: they describe what the code must not do.
 */
const src = join(__dirname, '..', '..', '..');
const read = (path: string) => readFileSync(join(src, path), 'utf8');
const code = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s\/\/.*$/gm, '');

const body = (source: string, start: string, end: string) => {
  const from = source.indexOf(start);
  expect({ start, found: from > -1 }).toEqual({ start, found: true });
  const to = source.indexOf(end, from + start.length);
  return source.slice(from, to > -1 ? to : undefined);
};

describe('nothing is stored or signed in before consent', () => {
  const spine = code(read('data/spine.ts'));

  it('opens only the schema at launch; sign-in and sync wait for consent', () => {
    const launch = body(spine, 'export function startDataSpine', '\n}\n');
    expect(launch).toContain('getDb()');
    expect(launch).not.toContain('ensureLocalProfile');
    // Sync is what signs in anonymously. At launch it may start only behind hasConsented().
    expect(launch).not.toMatch(/startSyncEngine\(|bindAuthRefreshToAppState\(/);
    expect(launch).toMatch(/hasConsented\(\)[\s\S]*startAccountServices\(\)/);
  });

  it('reads the profile without writing one', () => {
    const repo = code(read('data/repo.ts'));
    const getProfile = body(repo, 'export async function getProfile', '\n}\n');
    expect(getProfile).not.toContain('ensureLocalProfile');
    expect(getProfile).not.toMatch(/INSERT|UPDATE|runAsync/);
  });

  it('writes the consent row before it starts sign-in, never the other way round', () => {
    const screen = code(read('features/legal/ConsentScreen.tsx'));
    const accept = body(screen, 'const accept = async', '\n  };');
    expect(accept.indexOf('await recordConsent(')).toBeGreaterThan(-1);
    expect(accept.indexOf('await recordConsent(')).toBeLessThan(
      accept.indexOf('startAccountServices()'),
    );
    // And only when both required boxes are ticked.
    expect(accept).toContain('canAccept(choices)');
  });

  it('puts consent ahead of everything in the gate, a finished onboarding included', () => {
    const gate = code(read('app/index.tsx'));
    expect(gate.indexOf('consentedAt')).toBeGreaterThan(-1);
    expect(gate.indexOf('consentedAt')).toBeLessThan(gate.indexOf('onboardingCompleted'));
  });
});

describe('no push token', () => {
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return name === '__tests__' ? [] : files(path);
      return /\.(ts|tsx)$/.test(name) ? [path] : [];
    });

  it('is never requested anywhere in the app: every notification is local', () => {
    for (const path of files(src)) {
      const source = code(readFileSync(path, 'utf8'));
      expect({ path, asks: /get(Device|Expo)PushTokenAsync/.test(source) }).toEqual({
        path,
        asks: false,
      });
    }
  });
});

describe('"Obriši sve podatke"', () => {
  const account = code(read('data/account.ts'));
  const auth = code(read('data/auth.ts'));

  it('stops sync, moves the session aside, wipes the phone, then asks the server', () => {
    const steps = body(account, 'export async function deleteEverything', '\n}\n');
    const order = [
      'stopAccountServices()',
      'await stashSessionForDeletion()',
      'await wipeLocalData()',
      'finishPendingDeletion()',
    ].map((step) => steps.indexOf(step));
    expect(order.every((index) => index > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('never signs out on the way, which would revoke the token the deletion needs', () => {
    const stash = body(auth, 'export async function stashSessionForDeletion', '\n}\n');
    expect(stash).not.toContain('signOut');
  });

  it('stashes rotated tokens before calling the server, so a spent token is never reused', () => {
    const attempt = body(auth, 'async function attemptPendingDeletion', '\n}\n');
    expect(attempt.indexOf('await writePending(')).toBeGreaterThan(-1);
    expect(attempt.indexOf('await writePending(')).toBeLessThan(
      attempt.indexOf("rpc('delete_my_account')"),
    );
  });

  it('runs one attempt at a time, because concurrent refreshes revoke a session', () => {
    expect(auth).toMatch(/if \(!finishing\)/);
  });

  it('empties every table the phone has, so a new table cannot escape the wipe', () => {
    const db = read('data/db.ts');
    const created = [...db.matchAll(/CREATE TABLE (\w+)/g)].map((match) => match[1]).sort();
    const wiped = (/DATA_TABLES = \[([^\]]+)\]/.exec(db)?.[1] ?? '')
      .split(',')
      .map((name) => name.trim().replace(/'/g, ''))
      .filter(Boolean)
      .sort();
    expect(wiped).toEqual(created);
  });
});

describe('a reinstall starts fresh (docs/M4-copy-answers.md, decision 2)', () => {
  const spine = code(read('data/spine.ts'));
  const auth = code(read('data/auth.ts'));
  const db = code(read('data/db.ts'));

  it('drops a leftover session when the database was created on this launch', () => {
    expect(spine).toMatch(/if \(wasCreatedThisLaunch\(\)\) void discardLeftoverSession\(\)/);
    expect(db).toMatch(/if \(current === 0\) createdThisLaunch = true/);
  });

  it('removes the keychain entry itself, since signing out offline clears nothing', () => {
    const discard = body(auth, 'export function discardLeftoverSession', '\n}\n');
    expect(discard).toContain('chunkedSecureStorage.removeItem(SESSION_STORAGE_KEY)');
    expect(discard).not.toContain('PENDING_DELETION_KEY');
  });

  it('never signs in before the leftover session is gone', () => {
    const ensure = body(auth, 'export function ensureSignedIn', '\n}\n');
    expect(ensure).toMatch(/launchReset\.then\(resolveUser\)/);
  });
});
