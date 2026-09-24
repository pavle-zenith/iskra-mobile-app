# LEGAL: what Pavle owes, and what the policy draft says that the app does not do yet

**Answered 24.09.2026 in `docs/M4-copy-answers.md`, and applied.** Kept as the record of what was asked.

The consent screen's copy is complete: every line is yours, verbatim, from `docs/LEGAL-brief.md`.
Profil's copy did not exist, so eight lines render as `«TODO(copy): …»`. A test in
`src/features/legal/__tests__/consent.test.ts` pins that list; a ninth marker fails the build.

---

## 1. Profil: eight lines owed

All in `profil` in `src/features/legal/copy.ts`.

| Key | Where it shows |
|---|---|
| `accountIdHint` | Under the account id in "Nalog". Says what the id is for: the policy tells people to quote it (or the email, once there is one) when they write |
| `analyticsHint` | Under the "Analitika" toggle. Says what turning it off changes |
| `marketingHint` | Under "Emailovi sa savetima". Only shown once an account has an email (see 3 below) |
| `deleteTitle` | Confirmation title, after tapping "Obriši sve podatke" |
| `deleteBody` | Confirmation text. It should say it cannot be undone, and that it covers the server as well as the phone |
| `deleteConfirm` | The confirming button |
| `deleteCancel` | The button that backs out |
| `back` | Screen-reader label for the back arrow |

Used as given in the brief: "Profil" (the title; the policy says "u Profilu"), "Nalog",
"Emailovi sa savetima", "Analitika", and **"Obriši sve podatke"**, which the policy quotes
verbatim, so it must never drift. The links reuse the consent screen's "Politika privatnosti" and
"Uslovi korišćenja".

## 2. One line you might want

**A deletion queued offline says nothing.** The phone is wiped at once and the server part
finishes the next time there is signal (tested: a relaunch completes it). The person lands on the
welcome intro with no word that the server step is still to come. That is honest, since it will
happen, but if you want a line for it, it needs writing and a place to live.

## 3. Decisions taken for you

- **"Obriši sve podatke" is not red.** Every reference and the iOS convention colour it red, but
  `negative` is never pointed at the user. Erasing your own data is a right, not a failure. Ink on
  a hairline card, and the confirmation carries the weight
- **The email line and the marketing toggle wait for an email.** Every account is anonymous until
  `docs/ACCOUNT-brief.md`, so there is no email to show or to send tips to. A switch promising
  emails to an account without an address would be untrue. Until then "Nalog" shows the account id,
  selectable so it can be copied without adding a clipboard dependency
- **The confirmation is the native alert**, for its accessibility, without the red "destructive"
  style for the same reason as above
- **Push tokens are no longer collected** (Task 3). Every notification is local and scheduled on
  the phone, so no server ever needs to reach the device. None had ever been stored on the server
  (checked: 0 rows). The column stays, empty; dropping it is a one-line migration if you want it
  gone. The policy draft's own `[PROVERI]` note said to delete that bullet, so I did

## 4. The policy draft, checked against the app

The draft says every sentence must describe what the code actually does. The app is the one place
these can be verified, so here is each claim about the app, checked:

| Claim | In the app today |
|---|---|
| Consent before anything is entered | **True.** Proven: a first launch stores zero rows in every table and creates no server user |
| "U aplikaciji pristanak daješ **na prvom ekranu**" | **Not after WELCOME.** Consent comes after the three-beat intro, so it is the fourth screen. The intro stores nothing, so "pre nego što bilo šta uneseš" stays true; "na prvom ekranu" does not |
| Data sent encrypted to a server in the EU | **True.** HTTPS to Supabase `eu-west-1` (Ireland) |
| "Obriši sve podatke" deletes from the server **odmah** | **True online. Offline it is on the next launch or reconnect.** The phone is wiped immediately either way. Tested both |
| Deleted from backups within 30 days | **Cannot be checked from the code.** It depends on the Supabase plan's backup retention |
| "Podaci na telefonu brišu se kada obrišeš aplikaciju" | **Mostly.** SQLite goes with the app. The sign-in session lives in the iOS Keychain, which survives an uninstall: after a reinstall and new consent, the app would reattach to the old anonymous account and its server data. What should happen there is a product decision (reattach, start fresh, or offer to delete the old one), so I have not picked one |
| Analitika, error reports (Sentry, PostHog) | **Not built.** M6. The analytics consent is stored and sent, and nothing reads it yet |
| Notifications: at most three a day, quiet hours, silent after a slip | **Not built.** M6. The app asks permission and schedules nothing |
| Write from the account's email; the Apple relay address is in Profil | **After ACCOUNT.** Until then Profil shows the account id instead |
| Inactive for 24 months, deleted | **Not built**, and out of this brief. The draft already says the line stays off the site until it exists |

## 5. Found on the way

- **`profiles` had no foreign key to `auth.users`.** The brief assumed deleting the auth user
  cascades everything; it does not, because the four child tables cascade from `profiles`, and
  `profiles` is not tied to the auth user. `delete_my_account()` deletes both explicitly. If you
  also want a deletion made by hand in the Supabase dashboard to take the data with it, adding
  that foreign key is one migration (there are no orphan rows, checked)
- **Reading the profile used to create it.** `getProfile()` inserted a row as a side effect, so
  merely opening the app wrote to SQLite before consent, and outside the write queue. Fixed
- **The RLS suite leaked two anonymous users per run.** It now deletes them through
  `delete_my_account()`, which also exercises the deletion on every CI run
