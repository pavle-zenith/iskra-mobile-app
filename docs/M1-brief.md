# M1 brief: the data spine

For the code agent. Read `AGENTS.md`, `PRODUCT.md` and `ROADMAP.md` M1 first.

Two jobs: a one-off bundle id change that has to happen before anything is registered
anywhere, then the M1 milestone itself.

M1 is the hardest milestone in the project and none of it is visible. Everything after it is
screens. Do not start screens until the acceptance test at the end of this file passes.

---

## Task 0: change the bundle id to `com.iskraclub.iskra`

`app.json` currently has `com.iskraclub.app` on both platforms. Change both to
**`com.iskraclub.iskra`**.

Reverse-DNS convention is domain then product: `com.iskraclub` is the domain, `iskra` is the
app. `.app` carries no information, and the id cannot be changed after the first store
registration.

**This is safe today and expensive later.** `/ios` and `/android` are gitignored and generated
by prebuild, `app.json` has no `extra.eas.projectId` so no EAS project is linked, and no
credentials, provisioning profiles or keystores have been generated against the old id. After
M8 none of that is true.

Steps:

1. Edit `app.json`: `ios.bundleIdentifier` and `android.package`
2. Delete the generated native folders: `rm -rf ios android`
3. Regenerate: `npm run ios` and `npm run android` both run prebuild
4. Confirm nothing references the old id: `grep -rn "com.iskraclub.app" . --exclude-dir=node_modules --exclude-dir=.git`
5. The old dev build stays installed on any device as a separate app. Delete it by hand so
   there are not two Iskras on the home screen

Also update `ROADMAP.md` Part 4, which still lists the bundle id as an open question, and
`SCREENS.md` if it references the id anywhere.

---

## Task 1: Supabase client and anonymous auth

Project `aaknvhlirztdglxsnbho`, region eu-west-1.

- `@supabase/supabase-js`, session persisted in `expo-secure-store`. The plugin is already in
  `app.json`
- **Anonymous sign-in on first launch.** A real `auth.users` row, no signup screen, so RLS
  works unchanged and the user is inside the app in seconds. Email linking comes later and only
  when someone wants their data on a second device
- The anon key is public by design and belongs in the bundle. Use `EXPO_PUBLIC_SUPABASE_URL`
  and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. **The service role key never goes near this app**
- Generate typed bindings from the live schema and commit them. Do not hand-write the row types
- On first successful sign-in, create the `profiles` row. `profiles.id` has no default and
  mirrors `auth.users.id`, so it must be written explicitly. Nothing else works until it exists

## Task 2: verify RLS before a single row is written

**This blocks everything else in M1. Do it first, not last.**

All five app tables have one policy each, named "own <table>", `FOR ALL`, on role `public`.
That is correct only if the `USING` clause scopes to the user. Role `public` in Postgres means
every role, including an anonymous user, so the clause is the entire protection.

- Read the `USING` and `WITH CHECK` expression of each of the five policies
- `cravings`, `checkins`, `slips`, `milestones` must be `auth.uid() = user_id`
- **`profiles` is different**: it has no `user_id` column, it keys on `id`. Its policy must be
  `auth.uid() = id`
- Note that Supabase anonymous auth produces an authenticated user with `is_anonymous = true`,
  not the unauthenticated `anon` role. Policies behave normally. A policy of `USING (true)`
  would be wide open to every anonymous user on the internet

Write an automated test that proves isolation: sign in as user A, write a row, sign in as user
B, attempt to read and update A's row, assert both fail. Keep it in CI. If any policy is wrong,
stop and report rather than patching around it in the client.

## Task 3: SQLite mirror and the write queue

`expo-sqlite` is already in `app.json`.

The rule that decides the architecture: **the craving happens on a bus with no signal.** Every
write lands locally and returns immediately. If any screen awaits the network, the design is
wrong.

- Local schema mirroring the five tables, plus a queue table
- Every mutation: write SQLite, return, enqueue
- Queue drains on connectivity and on app foreground, with backoff. Last-write-wins is fine for
  this data, there is no multi-device editing in v1
- Reads come from SQLite, always. The server is a backup and a sync target, not a source
- Queue entries are idempotent: use a client-generated uuid as the row id so a retried write
  cannot duplicate

`src/lib/` is already the home for pure logic with unit tests. The queue's decision logic
belongs there; only the driver touches the database.

### One contract to pin down

`cravings.tool_used` is free text with no CHECK constraint, so **the app defines the
vocabulary**. `src/features/poriv/tools.ts` already carries a `TODO(M1)` about this. The six
keys in that file (`disem`, `voda`, `razlozi`, `setam`, `odlazem`, `belezim`) are the allowed
values. Write that down in a comment on both sides and do not let a seventh string appear.

Same for `cravings.outcome` and `slips.trigger`. Decide the value sets now, in one file.

## Task 4: the day counter

The number the entire product is judged on, and the classic place these apps break.

**Tests first.** `quit_date` is `timestamptz`. Count whole local calendar days between it and
now, not UTC hours divided by 24.

Cases that must be covered before the implementation is written:

- Quit at 23:50, check at 00:10 the next day. That is day 1, not day 0
- A DST boundary falls between quit date and now, in both directions
- The user flies to another timezone mid-streak. The count must not jump or go backwards
- Quit date in the future (the Pre-quit state). Returns a countdown, not a negative day count
- Quit date is today

Pure function in `src/lib/`. Every screen showing a number depends on it, so it does not live
in a component.

While you are there: `slips` never touches `quit_date`. The total smoke-free time does not
reset. That is a product commitment stated in `PRODUCT.md` and promised publicly in the blog,
and it is why `slips` is a separate table.

---

## Acceptance

M1 is done when all of these pass:

- [ ] Bundle id is `com.iskraclub.iskra` everywhere, native folders regenerated, old dev build removed from devices
- [ ] A fresh install signs in anonymously and creates its `profiles` row with no user action
- [ ] The RLS isolation test passes in CI, including the `profiles.id` case
- [ ] Aeroplane mode: log a craving, force-quit, reopen, the craving is there
- [ ] Reconnect: the craving appears in Supabase, exactly once
- [ ] Day counter tests green, including DST and the timezone-change case
- [ ] No screen anywhere awaits a network call

## Not in M1

No screens beyond what M0 already built. No onboarding, no home, no Poriv tools. `SCREENS.md`
and the Refero skill come into play at M2 and M3.

If something in this brief conflicts with `PRODUCT.md`, `PRODUCT.md` wins. If something is
genuinely ambiguous, leave a `TODO` and flag it rather than guessing.
