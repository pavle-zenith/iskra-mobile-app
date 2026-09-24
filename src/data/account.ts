import { finishPendingDeletion, stashSessionForDeletion } from './auth';
import { wipeLocalData } from './db';
import { stopAccountServices } from './spine';

/**
 * "Obriši sve podatke" (docs/LEGAL-brief.md Task 2), in the order that keeps its promises:
 *
 * 1. Stop sync and token refresh, so nothing is pushed or refreshed mid-wipe.
 * 2. Move the session aside, which is all the server step will need.
 * 3. Wipe the phone: every SQLite row and the session in the keychain. Immediate, online or off,
 *    so the phone never shows data the person asked to erase.
 * 4. Delete on the server: the profile, which cascades to cravings, slips, check-ins and
 *    milestones, and then the auth user. Now if there is signal; otherwise at the next launch or
 *    the next time the network returns. The screen does not wait for it.
 *
 * The returned promise is the server step, for the dev harness and tests; the screen ignores it.
 *
 * Not yet: revoking a Sign in with Apple token, which Apple requires on account deletion. There
 * are no Apple accounts until docs/ACCOUNT-brief.md, and revocation needs the Apple client secret
 * on a server (an Edge Function), so it lands with that brief.
 */
export async function deleteEverything(): Promise<{ server: Promise<'done' | 'waiting'> }> {
  stopAccountServices();
  await stashSessionForDeletion();
  await wipeLocalData();
  return { server: finishPendingDeletion() };
}
