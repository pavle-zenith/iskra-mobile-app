# SCREENS.md

Screen inventory, onboarding flow and the gap between the design export and the current
product spec.

Written 18.09.2026, from `ISKRA - mobile claude design export/`.

`PRODUCT.md` says why. `ROADMAP.md` says when. This says **what**, and where the export
disagrees with the current truth.

The export's own `HANDOFF.md` and `CLAUDE.md` are excellent and remain the reference for
exact copy and component wiring. This file does not repeat them. It covers three things they
cannot: what has changed since they were written, what to cut, and what the onboarding should
become.

---

## Part 1 - Nine conflicts with the current spec. Resolve before building.

The export predates the current branding, the live website and the Supabase schema. Every
item below is a real contradiction, not a preference.

### 1. Two of the six Poriv tools are wrong

The export ships: Dišem, Pijem vodu, Moji razlozi, Šetam, **Posmatram**, **Igram se**.

The current product is: Dišem, Pijem vodu, Moji razlozi, Šetam, **Odlažem**, **Beležim**.

The current list is published on iskraclub.com, in `llms.txt`, and in the homepage `TOOLS`
array. It is a public promise. **Build Odlažem and Beležim. Do not build Posmatram or Igram
se.** `PosmatramScreen` and `IgramScreen` are the two the export itself flags as concept
sketches, so nothing polished is lost.

Note what changes conceptually: Posmatram and Igram se were distraction. Odlažem (postpone
five minutes) and Beležim (log the trigger) are commitment and data. Beležim in particular
feeds the `cravings` table, which `PRODUCT.md` names as the only honest measure of whether
this product works.

### 2. Gendered slashes are everywhere, and the current rule forbids them

"Spreman/na sam", "Zapalio/la sam", "Izdržao/la si", "slobodan/na", "prestao/la". They appear
in screen copy, button labels and headings throughout.

`PRODUCT.md` and the website rule: **no gendered slashes, rewrite instead.**

The export's `ONBOARDING_COPY_BRIEF.md` already builds most of the fix: a `g('token')` helper
with a full m/f/x table. Two changes to it:

- `profiles.gender` is collected at onboarding step 3, so **m and f render the natural form.**
  The app can do what the website cannot.
- The `x` column currently falls back to the slash. **Replace every `x` fallback with a
  rewrite.** The brief already says to prefer rewriting; make it absolute. "Spreman/na si" →
  "Vreme je." The brief's own example is the right instinct, it just is not enforced.

### 3. A fabricated testimonial

`OnboardingPreview` carries "Marija, 34, verified ✓, 5 stars". The copy brief instructs
"Keep a real-sounding, non-medical quote."

`PRODUCT.md`: no invented proof, ever. There are zero real users. **Cut the testimonial.**
The three data cards on that screen are computed from the user's own numbers and are stronger
anyway, because they are about them.

### 4. A rating prompt inside onboarding

`ReviewModal` sits at step 19, before the user has used a single feature.

Cut it from onboarding entirely. See Part 3 for where it goes instead.

### 5. A paywall the roadmap says is not in v1

`Paywall` is step 20 and it is fully built: tiers, countdown, FAQ, comparison.

`ROADMAP.md` Part 3 defers payments. `is_premium` stays false. Pricing is undecided and the
Early Access offer is undefined. **Keep the screen file, do not wire it into the flow.** It is
good work and it will be needed; it is just not v1.

### 6. Old brand tokens

Export: ember `#E8621A`, Manrope only, `colors_and_type.css`.

Current: ember `#ec691c`, **Host Grotesk SemiBold 600 for display**, Manrope 500/600/700 for
body. Full token table in `ROADMAP.md` Part 0.

Do not port `colors_and_type.css`. Port the current tokens and re-map.

### 7. `commitment` is an enum in the design, a boolean in the database

Copy brief: `commitment` = `potpuno` / `veoma` / `donekle` / `nesiguran`.
Supabase: `profiles.committed` is **boolean**, alongside `signature_data` text.

The signature screen as designed produces a signature, not a four-way scale. Take the
boolean, take the signature, drop the enum.

### 8. A currency toggle with nowhere to land

`OnboardingPrice` offers RSD/EUR. Supabase has `pack_price_rsd` (integer) and no currency
column.

v1 is Serbia. **Drop the toggle, RSD only.** Adding a currency column to support a toggle
nobody in the target market needs is the wrong trade three weeks before feature freeze.

### 9. IQOS is in onboarding, and v1 is cigarettes

`OnboardingProduct` offers Cigarete / IQOS, and `profiles.product` supports it.

`ROADMAP.md` scopes v1 to cigarettes. Two options, pick one: keep the screen and treat IQOS as
a label-only variant (the copy brief's `productNoun` swap already handles this cheaply), or cut
the screen. **I would keep it.** It costs one screen, the column exists, and the Serbian
research found the live nicotine conversation has largely moved to IQOS and vaping.

---

## Part 2 - Screen inventory

Status: **KEEP** build as designed · **REWORK** structure survives, layout changes ·
**CUT** not in v1.

### Onboarding

| Screen | Status | Note |
|---|---|---|
| SplashScreen | REWORK | Export flags it as rough |
| OnboardingName | KEEP | |
| OnboardingGender | KEEP | Say why you are asking. It unlocks the grammar |
| OnboardingProduct | KEEP | Label-only IQOS variant |
| OnboardingCigarettes | KEEP | Stepper, default 20 |
| OnboardingPrice | REWORK | Drop the currency toggle |
| OnboardingCost | KEEP | The AHA. The strongest screen in the flow |
| OnboardingReasons | KEEP | Max 3 |
| OnboardingReasonText | KEEP | Feeds Moji razlozi. High value |
| OnboardingReflection | KEEP | Conditional cards per reason |
| OnboardingFears | KEEP | |
| OnboardingFearReflection | KEEP | Conditional cards per fear |
| OnboardingTriggers | KEEP | Feeds the personal plan |
| OnboardingTiming | KEEP | |
| OnboardingDate | KEEP | |
| OnboardingPreview | REWORK | Cut the testimonial |
| OnboardingPanic | KEEP, MOVE | See Part 3. This is the most valuable screen and it is buried |
| OnboardingCommitment | KEEP | Signature. Boolean, not enum |
| OnboardingSummary | KEEP | Add a processing beat before it |
| OnboardingNotifications | KEEP | |
| ReviewModal | CUT | Moves post-launch, after a real session |
| Paywall | CUT from v1 | Keep the file |
| OnboardingInsight | CUT | Already out of the flow |

### Home and navigation

| Screen | Status | Note |
|---|---|---|
| HomeScreenV3_1 | REWORK | See Part 4 |
| HomeScreenDay0 | KEEP | Maps to the Acute state |
| HomeScreenSlip | KEEP | Maps to Post-slip |
| HomeScreenV3, V2, V1 | CUT | History |
| HomeScreenTeaser | CUT | Marketing asset, not an app screen |

### Detail screens

TimeScreen, MoneyScreen, CigarettesScreen, MilestoniScreen, CategoryScreen,
GoalsRoadmapScreen, QuoteScreen, SettingsScreen: **all KEEP.**

KnowledgeScreen: **REWORK.** Per `ROADMAP.md` M5 it becomes a native index over the live
Sanity blog plus an in-app browser, not a native article renderer.

### Poriv flow

PorivEntry **KEEP** (writes `strength` and `trigger` to `cravings`).
PorivMode **KEEP**.
BreathingScreen, WaterScreen, RazloziScreen, SetamScreen **KEEP**.
PosmatramScreen, IgramScreen **CUT**, replaced by **Odlažem** and **Beležim** (new, to design).
PorivSuccessScreen **KEEP** (writes `duration_seconds`, `outcome`).

### Slip flow

SlipScreen, SlipReflectScreen, SlipRecapScreen, ProgressSheet: **all KEEP.** This flow is the
best-designed part of the export and it is the product's structural differentiator. The
never-resetting total timer is a schema-level commitment, not a screen detail.

---

## Part 3 - The onboarding, reworked

The current flow is 22 steps. **Length is not the problem.** Every strong reference in this
category is long: Breathwrk 35 screens, ABY Journal 41, Remy 62. Long onboarding earns
commitment when every step gives something back.

The problem is **order**. Four changes, each from a pattern that repeats across the references.

### Change 1: Move the Panic demo from step 17 to step 8

**Pattern: do the thing before you ask for anything.**

- Breathwrk runs a **lung calibration test** at steps 9 to 11, before the subscription at 12
- ABY Journal has the user write **an actual journal entry** at step 10, before the paywall at 11
- Unwind runs **a complete breathing session** before asking for a rating

Iskra's equivalent is `OnboardingPanic`, the big pulsing panic button. It is the single most
differentiating thing in the whole product and it sits at step 17, behind fifteen questions.

Move it to directly after the cost AHA. Sequence becomes: you told us what you smoke → here is
what it costs you → **here is the thing that helps, try it now** → now let us personalise it.

The user experiences the product before the product asks them for more.

### Change 2: Add a processing beat before the Summary

**Pattern: the labor illusion.** ABY Journal has a "Warming up / Processing" screen at step 17,
immediately before the payoff. Breathwrk shows "Measurement / Feedback" after the lung test.

`OnboardingSummary` currently appears instantly. A three to four second "Pravimo tvoj plan"
beat, showing the inputs being counted, makes the plan feel earned rather than templated.

The site quiz **already has this**: `LoadingStage` in `src/components/quiz/`. Port it.

### Change 3: Cut the rating prompt from onboarding. Put it after a survived craving.

**Pattern: ask after value is delivered.** Unwind's rating prompt fires after a completed
session, not during setup.

Iskra's natural moment is `PorivSuccessScreen`, after someone has actually got through a
craving. Gate it: a real craving survived, at least three days in, once ever. Post-launch, not
v1.

### Change 4: Normalise the progress bar

The export flags this itself: early screens show /11, later ones /18. Pick one denominator.
With the Panic move and the cuts, the count is **17 steps**, Splash and Notifications excluded.

### The proposed flow

| # | Screen | Type | Note |
|---|---|---|---|
| - | Splash | - | No progress bar |
| 1 | Name | Q | |
| 2 | Gender | Q | Say why. It unlocks the grammar |
| 3 | Product | Q | Cigarete / IQOS, label-only |
| 4 | Cigarettes | Q | Stepper |
| 5 | Price | Q | RSD only |
| 6 | **Cost** | AHA `[DARK]` | The number |
| 7 | **Panic demo** | **DO** | **Moved from 17.** Try the product |
| 8 | Reasons | Q | Max 3 |
| 9 | ReasonText | Q | Their own words. Feeds Moji razlozi |
| 10 | Reflection | AHA `[DARK]` | Conditional per reason |
| 11 | Fears | Q | |
| 12 | FearReflection | AHA `[DARK]` | Conditional per fear |
| 13 | Triggers | Q | Feeds the plan |
| 14 | Timing | Q | Auto-advance |
| 15 | Date | Q | |
| 16 | Preview | AHA `[DARK]` | No testimonial |
| 17 | Commitment | Ceremony `[DARK]` | Signature. No progress bar |
| - | **Processing** | **NEW** | "Pravimo tvoj plan". Port `LoadingStage` |
| - | Summary | Payoff `[DARK]` | |
| - | Notifications | Permission | |
| - | → Home | | No paywall in v1 |

The white-question / warm-reflection alternation is the export's best structural idea. Keep it
exactly. It is what stops seventeen questions feeling like a form.

---

## Part 4 - The home screen

> **Superseded, 21.09.2026.** `docs/HOME-V2-brief.md` is now the home screen's spec: Pavle's
> decision is that Home follows the export's `HomeScreenV3_1` dashboard, not the minimal
> state-led screen this part argues for. What stays true below is the criticism of the export
> (thirteen card types, tab previews, one screen for six states) and the rule that at most a
> few things may compete. What is superseded is the "leads with one thing" table: the dashboard
> is the same in every state, and only the lead slot above the header changes.


The export's `HomeScreenV3_1` contains, on one scroll: greeting, avatar, streak badge, weekly
tracker, live countdown, two stat cards, a quote card, a knowledge card, a next-goal card, six
category goal cards with progress bars, a total-time tracker, a slip button, a fixed craving
button and a bottom nav.

That is thirteen-plus card types and nine-plus colours competing on one screen. **It is a
dashboard, not a home screen.** Nothing leads, so the eye has nowhere to land.

Two structural problems underneath the visual one:

- **It previews three other tabs.** The six category goal cards duplicate Milestoni. "Dnevno
  znanje" duplicates Saznaj. The next-goal card duplicates the Roadmap. If a tab is worth
  having, it does not need a preview on Home.
- **It is the same screen in every state.** `PRODUCT.md` defines six user states, each with a
  different priority. The export half-recognises this with `HomeScreenDay0` and
  `HomeScreenSlip`, then shows everything always in the main one.

### The fix

Home leads with **one** thing, decided by state, then at most three supporting cards. Everything
else lives in the tab it already belongs to.

| State | Leads with | Supporting |
|---|---|---|
| Pre-quit | The date and their reasons | Plan, countdown to quit day |
| Acute, day 0 to 3 | **Poriv mod, full width** | Day count, one milestone |
| First week, day 4 to 7 | Poriv mod, day count | Money, next milestone |
| Consolidating, week 2 to 4 | Day count and money | Weekly tracker, next milestone |
| Established, month 1+ | Money and milestones | Weekly tracker, cravings survived |
| Post-slip | Absolution and the unbroken total | One next step |

Three things stay fixed in every state: the **"Imam poriv"** button, the bottom nav, and the
slip entry point kept deliberately away from the craving button (the export gets this right
already).

Keep the signature photo-texture move, `mix-blend-mode: soft-light` on an ember surface. Keep it
to **one per screen**, which is the export's own rule and which the current home breaks.

---

## Part 5 - What to take from the site quiz

The site quiz solves layout problems this flow has. It is in
`iskra-website-final/src/components/quiz/`.

- **`LoadingStage`** → the processing beat before Summary
- **`DriverBars`** → the four drivers (stress, habit, social, nicotine) as a bar breakdown.
  Stronger than the Preview screen's three generic cards, and it is the same data the personal
  plan keys off
- **`PartialStage`** → the pattern for a user who abandons partway. Onboarding currently has no
  resume story at all
- **`QuestionStage`** → one question per screen, generous targets, immediate advance. The
  export's multi-select grids are denser than this

The quiz already computes `smoking_profile`, `fagerstrom_score`, `readiness_score` and a driver
breakdown. A user arriving from the website quiz should skip the questions it already answered.
`ROADMAP.md` M2 covers the pre-fill.

---

## Part 6 - Refero references

Pulled 18.09.2026. Use these for layout decisions, not for visual style. Iskra's look is
settled.

| Flow | What to study |
|---|---|
| [Breathwrk onboarding, 35 screens](https://refero.design/flows/7724) | Evidence before commitment: benefit tags → problem → quick-win → neuroscience → goals. Then the **lung calibration**, an interactive test that personalises and proves the product. The closest analogue to the Panic demo |
| [ABY Journal onboarding, 41 screens](https://refero.design/flows/7987) | Name early, research mid, then **a real guided journal entry before the paywall**. The "Warming up / Processing" beat at step 17 |
| [Unwind onboarding and first session](https://refero.design/flows/5835) | Rating prompt fires **after** a completed session. Post-session mood capture, which is the model for the daily check-in |
| [Remy first launch, 62 screens](https://refero.design/flows/9761) | Long cinematic intro. Evidence that length is fine when every screen gives something |
| [Ada profile wizard](https://refero.design/flows/4096) | Health onboarding that **explains why it asks for gender** in a modal. Directly applicable to step 2 |

The common thread across all five: **the user does something real before the app asks for
money, a rating, or a permission.** Iskra has the strongest version of that moment already
built. It is just in the wrong place.
