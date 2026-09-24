# LEGAL brief: consent before the first stored row

For the code agent. Pavle's decisions, 23.09.2026: data controller is his existing PR entity,
minimum age 18, explicit consent for health data before anything is stored, policy and terms
drafted without a lawyer for now. Drafts: `docs/legal/PRIVATNOST-draft.md` and
`docs/legal/USLOVI-draft.md`. They extend the website's `/privatnost` and `/uslovi`, one policy
for site, quiz and app. **This blocks the first beta tester.**

## Task 1: the consent screen

Onboarding writes every answer the moment it is given (M2), so consent has to come **before
step 1**, right after the splash. Until it is given, nothing is written to SQLite or the outbox,
and no anonymous sign-in happens. Store the consent itself locally and in `profiles` (new columns
`consented_at timestamptz`, `analytics_consent boolean default false`, migration in this repo).

Approved copy, verbatim:

- Title: Pre nego što počnemo
- Body: Iskra na tvom telefonu i na serveru u Evropskoj uniji čuva ono što uneseš: navike
  pušenja, porive, posrtaje i dnevne provere. To su podaci o zdravlju, pa nam treba tvoj
  izričit pristanak.
- Checkbox, required: Imam 18 ili više godina.
- Checkbox, required: Pristajem da Iskra čuva i obrađuje moje podatke o pušenju i porivima, kako
  piše u Politici privatnosti.
- Checkbox, optional, unchecked: Pristajem na analitiku korišćenja, bez teksta koji sam
  napišem, da bi aplikacija bila bolja.
- Links: Politika privatnosti · Uslovi korišćenja (open iskraclub.com/privatnost and /uslovi in
  `expo-web-browser`)
- Button, disabled until both required boxes are checked: Prihvatam i nastavljam

Both required boxes are separate: the age line is not buried in the consent sentence. Targets at
least 44pt, checkbox labels tappable, screen-reader labels equal to the visible text.

Someone who does not accept simply cannot continue. No nagging, no second screen.

## Task 2: Profil, the minimum Apple requires

Apple requires in-app account deletion. Build the minimum Profil screen now, reachable from the
avatar on Home:

- **Nalog:** the account's email (or the Apple relay address), shown and copyable. The policy
  tells people to write from it
- **Emailovi sa savetima** toggle, bound to `marketing_consent` (see `docs/ACCOUNT-brief.md`)
- **Analitika** toggle, bound to `analytics_consent`
- **Obriši sve podatke:** one confirmation, then delete the server rows (a `security definer`
  function or an Edge Function that deletes the auth user; every table cascades from
  `profiles`), wipe SQLite and the secure store, **revoke the Sign in with Apple token** (Apple requires it on
  account deletion), and return to the welcome intro. Must work offline
  as "queued, done on reconnect", with the local wipe immediate
- Links to the policy and the terms

Copy for this screen does not exist yet: `missingCopy()` and `docs/LEGAL-copy-todo.md`.

## Task 3: decide the push token

Notifications are local and scheduled on the phone (ROADMAP Part 4). If nothing server-side
ever sends a push, stop collecting `push_token` and say so in the report. The policy then drops
that line. Less data is the better sentence.

## Not in this brief

The website edits (Pavle hands the drafts to the website agent), the 24-month inactivity
deletion job, and M6 analytics wiring.

## Acceptance

- [ ] No SQLite row, outbox entry or anonymous sign-in before consent
- [ ] Consent and analytics choice stored locally and in `profiles`
- [ ] Profil shows the id, the analytics toggle and a working "delete everything", online and
      offline
- [ ] After deletion, the server has no rows for that user and the app is back at the splash
- [ ] Push token decision stated in the report
