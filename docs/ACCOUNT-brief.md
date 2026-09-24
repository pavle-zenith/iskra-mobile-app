# ACCOUNT brief: Apple, Google and email sign-in

For the code agent. Pavle, 24.09.2026: every user gets a real account (Apple, Google or email),
for the account itself, for restoring data on a new phone, and for email campaigns. Decisions:

- **Required, after value.** The account is asked for at the end of onboarding, once the person
  has their plan, and before Home opens. Not on the first screen.
- **Marketing is a separate opt-in:** an unticked checkbox on the same screen. An account email
  is not permission to send campaigns.
- **Poriv mod is never gated.** PRODUCT.md, "Never gate a Poriv tool behind a signup". Offline,
  the app lets the person in and asks again when it is online (below).

Do this after `docs/LEGAL-brief.md` (consent) and with `docs/WELCOME-brief.md`.

---

## Task 0: keep the anonymous spine, upgrade it

M1's anonymous sign-in stays, starting **right after the consent screen** (LEGAL-brief: nothing
is stored and no sign-in happens before consent). From there the app works offline and every
onboarding answer is a row under an anonymous `user_id`. A returning user who taps "Već imaš
nalog? Prijavi se" on the welcome skips consent only if the account's `consented_at` is set;
otherwise the consent screen comes first.

Signing up **converts that anonymous user into a permanent one**, so the `user_id` and every row
stay the same and nothing is migrated. Supabase supports this (link an identity to the current
anonymous user, or set an email on it). **Check the current Supabase docs for the exact calls on
supabase-js as installed**, for all three paths, before writing code. Do not assume from memory.

The one case that is not a conversion: the identity **already belongs to an existing account**
(a returning user on a new phone who went through onboarding again before signing in). Then:
sign in to the existing account, **discard the throwaway anonymous onboarding** (the existing
account's data wins), and hydrate SQLite from the server. Tell the person in one line (copy
below). Never merge two people's cravings.

## Task 1: "Sačuvaj svoj plan", the new last onboarding step

Placed after Summary and before Notifications. Uncounted in the 17 (like the consent screen), or
counted: your call, but the progress bar must not jump.

Layout: title, one line, three buttons stacked, checkbox, small print.

- **Sign in with Apple** first, using `expo-apple-authentication`'s native button, so its label
  and styling are Apple's own (Guideline 4.8 requires it because Google is offered; the HIG says
  use the system button). iOS only. On Android, Google first
- **Google**, native flow (`@react-native-google-signin/google-signin` or whatever the Supabase
  docs currently recommend for Expo; check SDK 57 support before installing)
- **Email**: an email field, then a 6-digit code sent by email, then done. **No passwords.**
- Checkbox, unticked: marketing opt-in
- Small print with links to Politika privatnosti and Uslovi korišćenja

After success: the name from Apple or Google **never overwrites** the name they typed in step 1.
Store the marketing choice and its timestamp.

**Offline** (or the sign-in service fails): show the offline line, let them into Home. On the
next launch with a connection, the same screen opens as a sheet before Home. Poriv mod stays one
tap away the whole time, including from that sheet.

## Task 2: returning users

- Welcome beat 1 carries **Već imaš nalog? Prijavi se** (WELCOME-brief). It opens the same three
  sign-in options, without the checkbox (their existing choice stands)
- On sign-in: **hydrate SQLite from the server** for profiles, cravings, slips, checkins and
  milestones, then go straight to Home. M1's sync is push-first, so this pull is new work: one
  paginated read per table under RLS, written locally without enqueuing anything back
- Onboarding is skipped when the account already has `onboarding_completed = true`

## Task 3: database

Migration in this repo:

- `profiles.marketing_consent boolean not null default false`
- `profiles.marketing_consent_at timestamptz`
- Email stays in `auth.users`. For campaigns, a `security definer` function (or a view readable
  only by the service role) that returns `email, name, marketing_consent_at` **only where
  `marketing_consent` is true**. Nothing without consent is ever exported. RLS test for it

## Task 4: what Pavle sets up (list it in your report as blockers)

1. **Apple Developer Program** (paid). Sign in with Apple needs an App ID capability, a Services
   ID and a key, and none of it exists on a free account
2. **Apple private relay**: in the Apple Developer portal, register the sending domain and
   address for "Sign in with Apple for Email Communication", with SPF, or emails to hidden
   addresses bounce
3. **Google Cloud**: OAuth clients for iOS, Android (with the release and upload SHA-1s) and web
4. **Supabase Auth**: enable Apple and Google providers, and **custom SMTP through Resend** on
   the iskraclub.com domain. Supabase's built-in email sender is rate-limited and not for
   production. Email templates in Serbian (below)
5. Anonymous sign-ins stay enabled

## Copy, approved by Pavle 24.09.2026

All genderless.

**Sačuvaj svoj plan**

- Title: Sačuvaj svoj plan
- Line: Napravi nalog da ti plan, dani i razlozi ostanu sačuvani i kad promeniš telefon.
- Buttons: (Apple's native button) · Nastavi uz Google · Nastavi uz email
- Checkbox: Šalji mi savete i novosti emailom.
- Small print: Email koristimo za tvoj nalog. Savete šaljemo samo ako označiš polje iznad.
  Politika privatnosti · Uslovi korišćenja

**Email**

- Title: Tvoj email
- Button: Pošalji kod
- Code screen title: Upiši kod
- Line: Poslali smo šestocifreni kod na [email].
- Button: Potvrdi
- Link: Pošalji ponovo
- Wrong code: Kod nije tačan. Proveri i pokušaj ponovo.
- Expired code: Kod je istekao. Pošalji novi.

**States**

- Offline: Nema interneta. Plan je sačuvan na telefonu, a nalog pravimo čim se povežeš.
- Existing account found: Ovaj nalog već postoji. Vraćamo tvoje podatke.
- Returning user link (welcome): Već imaš nalog? Prijavi se

**Email templates (Supabase Auth, through Resend)**

- Subject: Tvoj Iskra kod: [kod]
- Body: Tvoj kod za prijavu u Iskru je **[kod]**. Važi 10 minuta. Ako kod nije tražen sa
  tvog telefona, samo ignoriši ovaj email.

Anything else that needs words: `missingCopy()` and `docs/ACCOUNT-copy-todo.md`.

## Also unlocked by this

- The M2 quiz pre-fill (Task 4, deferred) becomes possible: a verified email now exists. Not in
  this brief
- Early Access list members can be recognised by email when the founder offer is decided

## Docs to update

`PRODUCT.md`, `AGENTS.md` and `ROADMAP.md` describe accounts as anonymous in places. Update each
of those lines to: anonymous from first launch, converted to an Apple, Google or email account at
the end of onboarding. This brief wins where they disagree.

## Acceptance

- [ ] Onboarding answers survive sign-up with the same `user_id`, on all three paths
- [ ] Returning user on a clean install: sign in, data restored, straight to Home
- [ ] Existing account + fresh onboarding: the existing account wins, nothing merged
- [ ] Marketing checkbox unticked by default; the export returns only consenting users
- [ ] Offline at the account step: into Home, asked again online, Poriv mod never blocked
- [ ] Apple button is the native one; Apple token revoked on account deletion (LEGAL-brief)
- [ ] Zero slashes, em dashes, English, and no gendered forms in any string or email
