# M2 brief: onboarding

For the code agent. Read `AGENTS.md`, `PRODUCT.md`, `SCREENS.md` (Parts 1 and 3) and
`ROADMAP.md` M2 first. Target: 16.10.

M1 is the foundation this sits on: every onboarding write goes through the local database
and the sync queue, never straight to Supabase.

Four tasks, in order. Task 0 is a security fix and blocks Task 4.

---

## Task 0: close the website's open lead table

Not onboarding, but it must land before anything else touches `quiz_submissions`.

`quiz_submissions` has two policies on role `public`, both wide open:

- `Allow server inserts`: `WITH CHECK (true)`
- `Allow server updates`: `USING (true)`, `WITH CHECK (true)`

The publishable key ships in the app and on the site, so anyone can insert rows and update
every row in a table of real email addresses. The website never needed these policies:
`/api/quiz` and `/api/waitlist` both use `getSupabaseAdmin()` with the service role, which
bypasses RLS.

```sql
drop policy "Allow server inserts" on public.quiz_submissions;
drop policy "Allow server updates" on public.quiz_submissions;
```

RLS stays enabled, so the table becomes default-deny for everyone but the server.

**Migrations get one owner: this repo.** Before writing the migration above, pull the
project's existing migrations (they live with the website) into `supabase/migrations/` so the
history is complete in one place. The website repo stops writing migrations. Note it in the
website's `AGENTS.md` or README so a future agent there does not start again.

Verify after: submit the quiz once on iskraclub.com and confirm the row still lands. Add a
test to the RLS suite asserting the publishable key can neither insert nor update
`quiz_submissions`.

## Task 1: one trigger vocabulary, ten keys

Today there are three lists: `TRIGGER_KEYS` in `vocab.ts` (eight keys), the onboarding copy
brief, and the export's `OnboardingTriggers` screen. They collapse into one, used by
`cravings.trigger`, `slips.trigger` **and** `profiles.triggers[]`.

Why one list: the most valuable thing this app can eventually tell someone is "you said it
was coffee, but your cravings actually come under stress". That comparison only exists if
what they told onboarding and what they logged in Beležim share keys.

The ten keys, in display order:

| Key | Status | Proposed label (Pavle to confirm) |
|---|---|---|
| `kafa` | existing | Uz kafu |
| `budjenje` | existing | Posle buđenja |
| `posao` | **new** | Pauza na poslu |
| `kafana` | **new** | Kafana |
| `okolina` | existing | Kad drugi puše |
| `alkohol` | existing | Uz piće |
| `stres` | existing | Stres |
| `jelo` | existing | Posle jela |
| `dosada` | existing | Dosada i čekanje |
| `drugo` | existing | Nešto drugo |

`posao` and `kafana` come from the website's own hero copy, which names „pauza na poslu" and
„kafana" and had no key for either. `kafana` also maps to a blog category. It overlaps
`okolina` and `alkohol` on purpose: someone in a kafana should not have to decide which of
those two it was. The labels separate them.

The labels above are proposals from the planning session, not approved copy. **Do not ship
them until Pavle confirms.** Until then use them with `TODO(copy)`.

`trigger` has no server CHECK. Add one now, for both `cravings.trigger` and
`slips.trigger`, in the same migration batch as Task 0, so the database and `vocab.ts` cannot
drift. The only rows affected are test data.

Keep the quiz's four drivers (stress, habit, social, nicotine) out of this list. They are
motivations and they order the personal plan; triggers are situations and they tag events.

## Task 2: the onboarding flow

Build the order in `SCREENS.md` Part 3, not the export's `STEPS` array. Seventeen counted
steps, progress bar out of 17, Splash and Notifications uncounted.

The export's screens are the visual and copy reference. `SCREENS.md` Part 1 lists the nine
places they are wrong. The ones that bite in onboarding:

- **No gendered slashes, anywhere.** Implement `g(token)` from the copy brief's table. `muško`
  and `žensko` render the natural form. `drugo` or unset renders a **rewrite**, never
  „spreman/na". Where the brief only offers a slash for `x`, leave `TODO(copy)` for Pavle
  rather than inventing a rewrite. Every onboarding screen gets read in all three genders
  before sign-off
- **Price is RSD only.** No currency toggle. Writes `pack_price_rsd`
- **Preview has no testimonial.** The three computed cards only
- **Commitment writes the boolean `committed` and the drawn path to `signature_data`.** No
  four-way enum
- **Product offers Cigarete and IQOS**, label-only. IQOS swaps the product noun, nothing else
- **No review prompt and no paywall** in the flow. Keep the `Paywall` screen file unwired

### The Panic demo, step 7

The most important screen in the flow, moved here from step 17 on purpose. The user tries
the product before it asks for anything more.

It is a **demo, not a craving.** It must not write a `cravings` row. That table is the only
honest measure of whether Iskra works and an onboarding tap would pollute it on every install.

### The processing beat before Summary

A three to four second "plan is being built" screen, showing the user's inputs being counted.
Port the pattern from the website's `src/components/quiz/LoadingStage.tsx`. It must be real
work, not a fake timer: compute the summary during it.

### Resume

Persist the current step and every answer locally as they are given. Force-quit on step 11,
reopen, land on step 11 with answers intact. The website quiz's `PartialStage` is the
precedent.

### Notifications, the last screen

Request permission and store `push_token`. **Send nothing.** The rule for what notifications
may say is undecided (`ROADMAP.md` Part 4), and a congratulation to someone who slipped
yesterday is the worst thing this app can do. Permission yes, messages no.

### Layout

Use the Refero skill for question-screen layout, one question per screen, large targets. The
website quiz's `QuestionStage` is the in-house reference and closer to the brand than any
external app.

## Task 3: the Pre-quit and first-open states

When onboarding finishes, `quit_date` is either today, in the past (`vec_prestao`), or in the
future. The day counter from M1 already handles all three. Route to the correct state from
`PRODUCT.md`: a future date lands in Pre-quit, not a counter at zero. The full home screen is
M3; M2 only needs the handoff to be correct.

## Task 4 (optional): pre-fill from the website quiz

Only if Tasks 0 to 3 are done with time to spare. Otherwise defer.

The app signs in anonymously, so it has no email and cannot know who took the quiz. Pre-fill
therefore needs the user to **verify** an email first.

- Offer it once, early and skippable: „Već si radio kviz na sajtu?"
- The user enters an email and verifies it with a one-time code, which links the email to the
  anonymous user
- A `security definer` function returns only the `quiz_submissions` row whose email equals the
  **verified** email of the calling user, and pre-fills the matching answers

**Never pre-fill from an unverified email.** If typing an address were enough, anyone could
pull anyone's quiz answers. And never give the app a read policy on `quiz_submissions`: the
function is the only door.

---

## Acceptance

- [ ] `quiz_submissions` policies dropped, website quiz still writes, RLS suite covers it
- [ ] All migrations live in this repo; the website repo no longer writes them
- [ ] Ten trigger keys in `vocab.ts`, CHECK constraints on both trigger columns, onboarding uses the same keys
- [ ] Seventeen steps in `SCREENS.md` order, progress bar out of 17
- [ ] Every onboarding screen read in `muško`, `žensko` and unset: zero slashes
- [ ] Onboarding completes offline and the profile syncs on reconnect
- [ ] Panic demo writes no `cravings` row
- [ ] Force-quit mid-flow resumes on the same step with answers intact
- [ ] Future quit date lands in Pre-quit
- [ ] No review prompt, no paywall, no testimonial, no notification sent

## Not in M2

The home screen, Poriv mode and its tools, Napredak. Those are M3 and M4.
