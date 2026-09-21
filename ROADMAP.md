# ROADMAP.md

Iskra mobile app. React Native, iOS and Android, from zero.

Repo: `pavle-zenith/iskra-mobile-app`. Written 18.09.2026.

Target: feature-complete 15.11, beta from 15.11, submitted 05.12, live ~20.12, into the
Serbian New Year window.

This is a handoff for a code agent. Part 1 is decided. Part 2 is the work. Part 4 still
needs Pavle.

---

## Part 0 - What already exists. Read before building.

### The database is built

Supabase project `aaknvhlirztdglxsnbho`, eu-west-1. Five app tables, RLS enabled, one
"own row" policy each:

| Table | Columns |
|---|---|
| `profiles` | id (uuid, no default, mirrors `auth.users.id`), name, gender, product, cigarettes_per_day, cigarettes_per_pack, pack_price_rsd, quit_date, reasons[], reason_text, fears[], triggers[], timing, onboarding_completed, is_premium, committed, signature_data, push_token |
| `cravings` | strength, trigger, tool_used, duration_seconds, outcome |
| `checkins` | date, clean |
| `slips` | trigger, notes |
| `milestones` | key, category, unlocked_at, shared |

`quiz_submissions` belongs to the website. The app reads it only to pre-fill onboarding.

### The design system is built

Source of truth: `iskra-website-final/src/app/globals.css`, the `@theme` block. Port it
verbatim into `theme/tokens.ts`. Values, so this file stands alone:

```
ember            #ec691c      ember-hover   #df5f13
ember-tint       #fdede2      ember-wash    #f9dcc8

paper            #fdfcfa      surface       #ffffff
well             #f6f2ec      line          #e8e1d8

ink              #191512      ink-soft      #3b3530      muted     #6b6660

tool-disem       #2e8b80      tint #e2f1ee
tool-voda        #3f86c4      tint #e4eef8
tool-razlozi     #ec691c      tint #fdede2
tool-setam       #3f8d52      tint #e4f1e6
tool-odlazem     #55559a      tint #e9e9f4
tool-belezim     #7a5cc4      tint #eee8f8

money            #3a7a3a      deep #2f6630   tint #e6f0e6
health           #c2446f      deep #a93a60   tint #fbe7ee
time             #6b52a8      deep #58438f   tint #ece7f6

negative         #c24a43      tint #fde4e1   ink #9f3129
```

`negative` is for comparison verdicts only. Never point it at the user.

**Typography, resolved:** the site is the authority, not `PRODUCT.md`.

- **Display: Host Grotesk SemiBold (600)**, headlines only
- **Body: Manrope 500 / 600 / 700**
- Both need the **latin-ext** subset for š č ž ć đ. Bundle the TTFs, do not fetch at
  runtime: the app must render correctly offline on first open

**Ember is `#ec691c`.** `PRODUCT.md` says `#E8621A`; that file is out of date on this point.

### The copy rules are fixed

`iskra-website-final/PRODUCT.md` is the authority. Serbian, Latin script, informal "ti",
sentence case. No emoji. No em dashes. No gendered slashes: rewrite instead, never "/la".
Banned claims: "AI coach", "leči zavisnost", "garantovano", "klinički dokazano". Iskra is
explicitly not a medical treatment.

### WCAG 2.2 AA is a real requirement

`PRODUCT.md` says why it bites harder here: the user is on a phone, mid-craving, agitated,
not reading carefully. Generous targets and instant legibility are the feature.

---

## Part 1 - Stack, decided

**Expo (managed) + React Native + TypeScript strict.** The deciding factor is
`expo-updates`: a bug found on 22 December ships over the air instead of queuing behind
Apple's slower 23 to 27 December review window. Bare RN costs that safety net and buys
nothing here.

**Expo Router.** Same mental model as the Next.js site already built.

**Supabase JS client**, session in `expo-secure-store`.

**Local-first: `expo-sqlite`** plus a write queue. See M1. Most important decision in the build.

**`react-native-reanimated`** for Dišem. UI thread, not JS thread. A breathing guide that
stutters is worse than none, because the user is matching their breath to it.

**No component library.** The tokens are opinionated and a kit will fight them.

---

## Part 2 - Milestones

### M0 - Foundations. By 25.09

- Expo app boots on iOS simulator and Android emulator
- TypeScript strict, ESLint, Prettier
- `theme/tokens.ts` from the table above, with a comment naming `globals.css` as source so
  drift stays visible
- Host Grotesk 600 and Manrope 500/600/700 bundled, rendering š č ž ć đ. Verify with real
  Serbian strings, never Lorem
- `Text` and `Pressable` primitives applying tokens, minimum 44pt targets
- EAS configured, one successful dev build per platform
- `app.json`: bundle ids, `sr` locale, portrait only

**Done when:** a screen reading "Šta te tačno vraća cigareti?" in Host Grotesk on paper
background installs on a real iPhone and a real Android.

### M1 - The data spine. By 09.10

Hardest milestone. Everything after is screens.

**Auth: Supabase anonymous sign-in.** A real `auth.users` row, zero signup friction, RLS
unchanged, user inside the app in ten seconds. Email linking later, only when someone wants
their data on a second device. Also avoids Apple's Sign in with Apple requirement, which is
triggered only by third-party social login.

**Offline-first, not optional.** The craving happens on a bus with no signal. Every write
lands in SQLite and returns immediately; a background queue pushes to Supabase. If any
screen spins mid-craving, the architecture is wrong.

- SQLite schema mirroring the five tables
- Write queue with retry. Last-write-wins is fine for this data
- Typed Supabase client generated from the live schema
- **Verify the RLS policies actually scope to the user.** All five are `ALL` on role
  `public`, correct only if `USING` is `auth.uid() = user_id`. Read each one before a single
  real user exists

**The day counter, properly.** `quit_date` is `timestamptz`. Count local calendar days, not
UTC hours over 24, and survive DST and travel. Tests first. This is the number the product
is judged on and the classic place these apps break.

**Done when:** aeroplane mode, log a craving, kill the app, reopen, it is there; reconnect,
it appears in Supabase.

### M2 - Onboarding and the commitment. By 16.10

`profiles` already names every field.

- Name, gender, cigarettes per day, per pack, pack price RSD, quit date
- `reasons[]` plus free text in `reason_text`, `fears[]`, `triggers[]`, `timing`
- **The commitment ritual.** `committed` and `signature_data` exist, so the user signs
  something. Finger signature stored as a path. This is the emotional hinge of onboarding
  and a commitment-and-consistency device. Give it real design attention
- Pre-fill from `quiz_submissions` when they arrived via the website quiz, matched on email
  after they link one, never before
- `onboarding_completed` gates the app

**Gender matters here.** Serbian participles are gendered and the website solves it by
rewriting around them. The app knows `gender`, so it can use the natural form. It must still
read correctly when gender is unset: default to the genderless rewrite, never to masculine.

### M3 - Poriv mod. By 30.10

The reason the app exists. Colours already in the token file.

| Tool | What it does |
|---|---|
| Dišem | Guided breathing, UI thread, one minute |
| Pijem vodu | Paced glass of water |
| Moji razlozi | Their own words from `reason_text` and `reasons[]`, read back |
| Šetam | Short walk, change of place |
| Odlažem | Postpone five minutes, not forever |
| Beležim | Log what triggered it |

**One tap from the first screen**, plus a lock-screen widget if time allows. A craving lasts
three to five minutes. Thirty seconds of navigation has already lost.

Each session writes a full `cravings` row: strength, trigger, tool_used, duration_seconds,
outcome. That table is the only real behavioural dataset this product will have.

**Done when:** all six run offline end to end and each writes a complete row.

### M4 - Napredak. By 06.11

Three tabs: money, health, time. Colours in tokens.

Port the arithmetic from `iskra-website-final/src/lib/calc.ts`. It is corrected and sourced:
`CIGS_PER_PACK = 20`, `MINUTES_PER_CIG = 6`, plus a comparison list of everyday Serbian
prices with sources in the comments. Port it, do not rewrite it, keep the comments.

Days without a cigarette, money saved in RSD, cigarettes not smoked, time returned.

Three-form numeral agreement everywhere. Never `n > 1`.

### M5 - Check-in, slips, milestones, baza znanja. By 13.11

- **Daily check-in.** One `checkins` row per day, `clean` boolean. Short. It keeps the streak
  alive, it does not interrogate
- **Slips.** A `slips` row with `trigger` and `notes`. **Total smoke-free time does not
  reset.** This is a product commitment, not a detail: it is what the relapse article
  promises and what separates Iskra from every counter app. Absolution before mechanism
- **Milestones.** `milestones` rows keyed and categorised, unlocking on the WHO timeline the
  website already uses. `shared` exists, so one clean share image, no invented numbers on it

**Baza znanja: map the site's blog.** Do not rebuild articles natively.

- Read the same Sanity dataset the site reads: project `dix3dmqg`, dataset `production`,
  perspective `published`, and the same `publishedAt <= now()` filter used in
  `iskra-website-final/src/sanity/queries.ts`. Reuse that filter exactly or scheduled posts
  will appear early in the app and not on the site
- Native index: cover, title, excerpt, category, reading time. Filter by the six categories
- Tap opens `https://www.iskraclub.com/blog/{slug}` in `expo-web-browser`

Why this way: zero Portable Text work, the web article already carries the right typography,
sources, FAQ and CTA, and it stays in sync as the blog grows at four posts a month.

Tradeoff to accept: articles need connectivity. That is fine, reading is not the craving
moment. **Cache the index locally** so the list still renders offline even when articles will
not open. The Poriv tools remain fully offline regardless.

### M6 - Feature freeze. 15.11

No new features after this date.

- WCAG 2.2 AA pass: contrast, focus, targets, screen reader labels in Serbian
- Empty, error and offline states on every screen
- Sentry
- PostHog, event names matching the website so the funnel joins up

### M7 - Closed beta. 15.11 to 03.12

TestFlight and Play internal track. **Fifteen to twenty real Serbian smokers**, not
developers. Highest-information activity in the plan; external user count today is zero.

Watch: does anyone open Poriv mod during a real craving, does the day counter ever show a
wrong number, does anyone say the app feels like it is judging them.

### M8 - Submission. 05.12

Two weeks of buffer before the slow review window, enough for two rejection cycles, which is
normal on a first submission.

- Serbian store listings, ASO per the `aso-audit` skill
- Screenshots, both platforms, every required size
- Privacy nutrition labels. The app collects health-adjacent behavioural data, so be accurate
- **Privacy policy and terms rewritten for app data.** The live ones describe a website, a
  waiting list and a quiz. `checkins`, `cravings` and `slips` are a different processing
  story. Real legal review, and per `LAUNCH-BRIEF.md` it blocks the first stored row, not
  just submission
- No health claims beyond what the site already defends with sources

### M9 - Launch. ~20.12

Follow `LAUNCH-BRIEF.md`: site flip, then the email to the list, then social. Never before
the app is downloadable from a clean device.

---

## Part 3 - Not in v1

- **Social feed, friends, leaderboards.** A different product
- **Payments and `is_premium`.** Column exists, leave it false. Pricing is undecided and the
  Early Access offer is undefined. Wiring RevenueCat in December risks the launch for revenue
  that is not ready
- **Apple Health / Google Fit**
- **Vape and IQOS modes.** `profiles.product` defaults to `cigarete` and exists for later.
  v1 is cigarettes
- **Native article rendering.** See M5

---

## Part 4 - Still needs Pavle

1. **Notifications, before M6.** `push_token` exists, so this is planned. A congratulatory
   push to someone who relapsed yesterday is the worst thing this app could do. The rule
   must be that notifications read state before they speak, plus a quiet mode.
2. **Bundle id: resolved 18.09.2026.** `com.iskraclub.iskra` (domain, then product) on both
   platforms, set in M1 Task 0 before any EAS project, credential or store registration existed.
3. **The Early Access offer, before M8.** Already promised publicly in the site's
   `llms.txt`. The app is where it gets honoured.

---

## Part 5 - Standing rules

- Serbian copy is final at v1.0. Do not paraphrase it. Need a new string? Flag it, do not
  invent it
- No em dashes, no emoji, no gendered slashes
- Three-form numeral agreement wherever a count renders
- Every screen works offline, except article reading
- Every screen works mid-craving: one-handed, large targets, no reading required
- Never claim a feature that is not built, in copy, in the store listing, or in schema
