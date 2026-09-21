# Iskra mobile app

Read these before writing anything:

- `PRODUCT.md`: why, for whom, and what must never happen. Decides anything the roadmap leaves open
- `ROADMAP.md`: what to build and when. Milestones M0 to M9
- `docs/M2-copy-todo.md`: the Serbian copy Pavle still owes. Missing copy renders as
  `«TODO(copy): …»`; never fill one in yourself
- `SCREENS.md`: what each screen is, the reworked onboarding order, and the nine places
  the design export contradicts the current spec. Read it before M2 or M3. The export in
  `ISKRA - mobile claude design export/` is reference, not instruction: SCREENS.md says
  which parts of it are still true
- Expo HAS CHANGED. Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/
  before writing any Expo code. This project is on SDK 57 (React Native 0.86, React 19.2)

## Stack

Expo managed workflow, Expo Router (`src/app`), TypeScript strict, development builds via EAS
(`expo-dev-client`). Not Expo Go: fonts are embedded natively by the `expo-font` config plugin.

```
npm run ios          # prebuild + run on the iOS simulator (needs Xcode)
npm run android      # prebuild + run on an Android emulator (needs the Android SDK)
npm start            # Metro for an already-installed dev build
npm run check        # typecheck + lint + unit tests (no network)
npm run test:rls     # RLS isolation against the live Supabase project (runs in CI)
npm run gen:types    # regenerate src/lib/supabase/database.types.ts (npx supabase login once)
```

Supabase project `aaknvhlirztdglxsnbho` (eu-west-1). Public URL and publishable key live in
`.env` (see `.env.example`). The service role key never goes near this repo. Schema changes
are SQL files in `supabase/migrations/`, applied to the project, then `npm run gen:types`.

## Rules the code enforces, and why

- **Text and taps go through `@/components/primitives`.** ESLint blocks raw `Text`, `Pressable`
  and `Touchable*` from `react-native` in `src/`. The primitive `Text` applies the bundled face
  and Dynamic Type caps; the primitive `Pressable` guarantees a 48x48 target and native feedback
- **Colours come from `@/theme`, never hex in a screen.** `src/theme/tokens.ts` is a verbatim port
  of the website's `globals.css`; edit the site first, then port. Screens use the semantic roles
  in `src/theme/index.ts` so a dark scheme can be added by remapping roles later
- **`fontFamily` is a PostScript name and never pairs with `fontWeight`.** Files in
  `assets/fonts` are named after their PostScript names so one string works on iOS and Android
- **White on ember is 3.18:1.** Only large text (19pt bold, or 24pt) or icons sit on ember. Ember
  text on paper is 3.1:1: headings at 24pt or larger only
- **Tool glyphs sit in the tool colour on its tint, beside a text label**, as on the site. A
  glyph with no label goes white on the solid tool colour instead (razlozi on tint is 2.78:1).
  Never a solid ember razlozi badge next to "Imam poriv": ember is the single voice of action
- **Rasters come from the website and are logged in `assets/PROVENANCE.md`.** Tool textures and
  the flame are copies of `iskraclub.com` assets; re-export from the site, never edit the copies
- **`negative` is for comparison verdicts only.** Never pointed at the user
- **Counts go through `plural()`** in `src/lib/i18n/plural.ts`. Never `n > 1`
- **Serbian copy is final. Never write or paraphrase a Serbian string.** Need one that does not
  exist? Leave a `TODO(copy)` and flag it for Pavle

## The data spine (M1)

- **UI never talks to the network.** Screens read and write through `@/data/repo`, which writes
  SQLite plus an outbox entry in one transaction and returns. ESLint blocks
  `@supabase/supabase-js` and `@/data/supabase` in `src/app`, `src/components`, `src/features`.
  Only `src/data/sync.ts` and `src/data/auth.ts` reach Supabase
- **Reads come from SQLite, always.** Supabase is a backup and a sync target, never a source
- **Row ids are client-generated uuids**, so every push is an idempotent upsert. Ownership
  (`user_id`, or `id` for `profiles`) is stamped at push time, because a row can be written
  before the first anonymous sign-in has happened
- **Closed vocabularies live in `src/lib/vocab.ts`**: tool keys, craving outcome, trigger keys,
  profile enums. A value outside them throws before it reaches SQLite. Changing one is a
  product decision, plus a migration when the column has a server CHECK
- **The day counter is `quitProgress()` in `src/lib/time/dayCount.ts`.** Whole calendar days
  in `profiles.quit_time_zone`, never hours / 24. Nothing else computes a day count
- **Slips never touch `quit_date`.** The total smoke-free time does not reset
- **Queue logic is pure** (`src/lib/sync/queue.ts`, unit-tested); `src/data/` holds the drivers
- **Dev harness:** `iskra://dev` (dev builds only). A test script can drive the spine without
  the UI through the `dev.command` key in the app's SQLite; see `src/data/devCommands.ts`

## Onboarding (M2)

- **Seventeen counted steps** in `SCREENS.md` Part 3 order, not the export's `STEPS`. The order
  and the progress numbers live in `src/lib/onboarding/steps.ts`, which is pure and tested
- **One route per step** (`src/app/onboarding/[step].tsx`), so back is the platform's own gesture
- **Every answer is written as it is given.** `OnboardingProvider` calls `updateProfile`, which
  writes SQLite plus an outbox entry. Force-quit on step 11 resumes on step 11
- **Copy comes from `src/features/onboarding/copy.ts`**, transcribed from the copy brief, which
  wins over the export's screen files. Never write, translate or paraphrase a Serbian string
- **Gendered words go through `g(token, gender)`.** Never a slash, never masculine-by-default;
  a form that does not exist yet renders a marker. See `docs/M2-copy-todo.md`
- **The panic demo writes no `cravings` row.** A test enforces it: that table is the only honest
  measure of whether Iskra works
- **The ember field is the [DARK] screen.** `color.field` with white display type only; anything
  readable sits on a `Plate`, because white on ember is 3.18:1
- **Notifications: permission only.** The app sends nothing until the rule in ROADMAP Part 4 exists

## Layout

```
src/app/                  routes (Expo Router); dev.tsx is the dev-only data harness
src/app/onboarding/       splash plus one dynamic route for the seventeen steps
src/components/primitives Text, Pressable, Button, Icon
src/features/<name>/      feature code (poriv, napredak, ...)
src/data/                 drivers: SQLite, repo, sync engine, auth, Supabase client
src/lib/                  pure logic, unit-tested (vocab, time, sync, storage, i18n)
src/theme/                tokens.ts (site port), typography.ts, index.ts (roles)
supabase/migrations/      schema changes, applied to the live project
tests/integration/        live-network tests, excluded from `npm test`
```
