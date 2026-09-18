# Product

Iskra mobile app. The companion to `ROADMAP.md`: the roadmap says what to build and when,
this says why, for whom, and what must never happen.

When the roadmap is silent on a decision, this file decides it.

The website's own `iskra-website-final/PRODUCT.md` governs the marketing site. Where the two
disagree about the app, this file wins. Where they disagree about a fact (brand colour,
typography), the live site code wins over both.

## Platform

adaptive

iOS and Android from one codebase, React Native via Expo. Serbian only. Portrait only.

## Users

Serbian smokers who already want out and have usually tried before. Serbia specifically:
Serbian language, Latin script, RSD, informal "ti". Gendered forms are solved by rewriting
(present tense, impersonal reflexives), never with a slash such as "/na" or "/la". The app
knows `profiles.gender`, so it may use natural gendered forms when it is set, and must fall
back to the genderless rewrite when it is not. Never default to masculine.

Three acquisition segments carry over from the site and shape tone, not features:

- **A, Finansijski osvešćeni, 26 to 38.** The primary segment. Money is the proof
- **B, Zdravstveno motivisani, 30 to 45.** Already doing something for their health
- **C, Roditelji, 28 to 42.** The most powerful and the most dangerous. One careless sentence
  turns motivation into shame. Treat as a craft constraint, not an audience

## The moment of use

This is the section that should decide most UI arguments.

The person is holding a phone in one hand, standing up, outdoors or in a stairwell, possibly
at night, possibly with other people nearby who are smoking. They are agitated. Their
attention span is roughly one sentence. They may be slightly drunk. They opened the app
because they are about to lose, and they have between three and five minutes.

Consequences, not negotiable:

- **One tap from cold start to a working tool.** Not two. A splash screen that animates is a
  tap you spent on nothing
- **No reading required to act.** Icon plus one word. Prose is for later, calmer screens
- **Works with no signal.** Every Poriv tool, the counter, and logging. A spinner at minute
  two of a craving is a product failure, not a network condition
- **Large targets, high contrast, no precise gestures.** No long-press as the only path to
  anything, no swipe-to-reveal for a primary action
- **Nothing that demands a decision.** No "are you sure", no modal asking them to rate the
  app, no upsell, ever, during Poriv mod

## Product purpose

Iskra shows up at the moment the craving hits, not at the end of the day when a counter ticks
over. Every app in this category counts days. None of them do anything useful during the
three to five minutes when quitting is actually won or lost.

**Success for v1 is not downloads and not the email list.** It is two numbers:

1. **Did someone open Poriv mod during a real craving.** The `cravings` table is the only
   honest measure of whether this product does the thing it claims
2. **Did they come back the next day.** Day-2 and day-7 return rates

Everything else, including installs, is upstream vanity. Design for those two.

## The user's state, which decides the home screen

A person is always in exactly one of these. The home screen is not one layout with variable
data; it is a different priority in each state.

| State | Condition | What the home screen leads with |
|---|---|---|
| **Pre-quit** | `quit_date` in the future or unset | The date, the plan, and their reasons. Not a counter at zero |
| **Acute** | day 0 to 3 | Poriv mod, larger than everything. This is the peak-craving window |
| **First week** | day 4 to 7 | Poriv mod plus the day count. Symptoms are still real |
| **Consolidating** | week 2 to 4 | The counter and money start earning their place |
| **Established** | month 1+ | Money, milestones, and the record of cravings survived |
| **Post-slip** | a `slips` row in the last 48h | Absolution first, mechanism second. Never a reset, never a scold |

The acute state is where the product is judged. It lasts three days and most people who
fail, fail there.

## Positioning, and what makes it true in software

Three differentiators. Each has to be true in code, not just claimed in copy.

**1. The craving moment is the centre of gravity.** True only if Poriv mod is one tap from
cold start and works offline. If it is a tab among tabs, the claim is marketing.

**2. Money is made viscerally real.** `pack_price_rsd` and `cigarettes_per_day` are theirs,
not averages. The number is personal and concrete. Never let it become decoration, and never
round it up to look better.

**3. No judgment, and this one is structural.** A relapse does not reset the total
smoke-free time. That is a schema-level commitment: `slips` is a separate table precisely so
that logging one does not touch `quit_date`. The category's dominant failure mode is making
people feel worse, and the blog article about relapse has already promised readers this in
public.

## Capabilities in v1

- **Poriv mod.** Six tools: Dišem, Pijem vodu, Moji razlozi, Šetam, Odlažem, Beležim
- **Napredak.** Days, money saved in RSD, cigarettes not smoked, time returned
- **Daily check-in.** One row, `clean` boolean. Short
- **Slips.** Logged without penalty
- **Milestones.** Health and personal thresholds on the WHO timeline
- **Baza znanja.** Native index of the website's blog, articles opened in an in-app browser
- **A personal plan** from onboarding, keyed to their drivers

The quiz produces four drivers: `stress`, `habit`, `social`, `nicotine`, with a percentage
breakdown (`src/lib/quiz/scoring.ts` on the site). These map onto the blog categories Stres,
Okidači, Kafana i društvo and Telo. The personal plan and the knowledge-base ordering should
both key off the dominant driver.

Not in v1: social features, payments, Apple Health, vape and IQOS modes, native article
rendering. See `ROADMAP.md` Part 3.

## What the app must never do

Concrete, testable, and each one is a real failure mode in this category:

- **Never reset the total smoke-free time** because of a slip
- **Never congratulate blindly.** A push saying "3 dana bez cigarete!" to someone who logged
  a slip yesterday is the worst thing this app can do. Notifications read state before they
  speak
- **Never gate a Poriv tool** behind a signup, a paywall, a network call, or an onboarding
  step
- **Never shame.** No red, no frowning faces, no "you broke your streak". The `negative`
  colour token exists for comparison verdicts and is never pointed at the user
- **Never interrupt Poriv mod.** No rating prompts, no upsells, no notifications while a
  tool is running
- **Never invent a number.** No fake user counts, no rounded-up savings, no ratings
- **Never claim a health outcome** the WHO timeline does not support, and never state one
  without the source behind it

## Brand commitments

- Name: Iskra (Iskra Club). The site is `https://www.iskraclub.com`
- Voice: warm, premium, calm, non-judgmental. Informal "ti". Sentence case. Never lectures,
  never scolds, never hype
- **Ember `#ec691c`.** The website's `globals.css` is the source of truth. The site's
  `PRODUCT.md` says `#E8621A` and is out of date
- **Display: Host Grotesk SemiBold 600. Body: Manrope 500 / 600 / 700.** Both with latin-ext
  for š č ž ć đ. Bundled, not fetched
- The brand mark is the flame. `iskra-logo-sm.png` is a faded app icon and is not a brand mark
- Icons: Lucide-style, ~1.9 stroke, round joins. No icon fonts, no emoji, anywhere
- Full token set in `ROADMAP.md` Part 0

## Copy rules

- **Serbian copy is final at v1.0. Never paraphrase it.** Need a string that does not exist?
  Flag it, do not write it
- No em dashes. No emoji. No gendered slashes
- Three-form numeral agreement wherever a count renders. Never `n > 1`
- Banned claims: "AI coach", "leči zavisnost", "garantovano", "klinički dokazano",
  "klinički validiran". Iskra is explicitly not a medical treatment and not a substitute for
  a doctor
- Bodies **oporavljaju se**, machines **popravljaju se**
- "pakla", never "paklica". Typographic quotes „…", not "…"

## Evidence on hand

**Real:**

- The Supabase schema, built and with RLS policies in place
- The design system in the website's `globals.css`, already carrying app-specific tokens
- `src/lib/calc.ts` on the site: corrected and sourced arithmetic, `MINUTES_PER_CIG = 6`,
  plus everyday Serbian prices with sources in the comments
- Three published blog articles with sources and FAQs
- Public health guidance from WHO, NHS, HSE, Mayo Clinic, CDC, cited as published research
- Mockups at `iskra-website-final/public/mockups/`: `app-home.png` and `plan.png` only. The
  site's `PRODUCT.md` lists more screens than actually exist there; do not go looking

**Not real, and must never be presented or extended as fact:**

- **There are zero real users.** No installs, no ratings, no reviews, no retention data, no
  outcome rates
- **No pricing exists.** Early Access members are owed a starting offer that has not been
  defined
- **No institutional relationship exists** with WHO, NHS, HSE, Mayo Clinic, CDC, Cochrane,
  Batut or IJZ Vojvodine. Citing published guidance is the claim; a relationship is not
- The website's seeded testimonials and its former hardcoded waitlist count do not come near
  this app. The count was removed from the site on 14.09.2026 for exactly this reason

No `aggregateRating` in any store listing or schema until real ratings exist. That omission
is policy, not an oversight.

## Data and privacy

The app stores health-adjacent behavioural data: when someone craved, how strongly, what
triggered it, and when they slipped. Treat it accordingly.

- Anonymous sign-in by default. Nothing about a person leaves the device until there is a
  reason
- `signature_data` is a drawn path, not a legal signature, and is never shown to anyone else
- No third-party advertising SDKs. No Meta SDK, no TikTok SDK, no ad attribution kit
- Analytics record behaviour, never content. A craving's `trigger` is a category; the free
  text in `slips.notes` and `profiles.reason_text` is theirs and never leaves as an event
  property
- Privacy policy and terms must be rewritten for app data before the first real row is
  stored. The live ones describe a website, a waiting list and a quiz

## Product principles

1. **The craving moment is the product.** Forced to choose what to show, show what helps at
   minute two of an urge, not what summarises last month
2. **Money is the sharpest proof.** Concrete, personal, impossible to argue with
3. **Never shame.** Relapse is part of the path. The job is to take someone back, not grade
   them
4. **Offline is a feature, not a fallback.** The craving does not wait for signal
5. **Truthful while pre-launch and after.** No invented proof, ever. The absence of a user
   base is a constraint to design around, not to paper over

## Accessibility

**WCAG 2.2 AA is a real requirement.** Contrast, focus, targets, screen reader labels in
Serbian.

The stakes are higher here than on the site: the user is mid-craving, agitated, impatient,
and not in a state to read carefully or execute precise gestures. Generous tap targets and
immediate legibility serve both the standard and the actual moment of use. They are the same
requirement.

## When this file is silent

Decide in this order:

1. Does it help at minute two of a craving? If yes, it wins
2. Could it make someone feel judged? If yes, it loses
3. Does it work with no signal? If no, redesign it
4. Does it claim something not yet true? If yes, cut it
5. Still unclear? Flag it for Pavle rather than guessing. Serbian copy and product claims
   are never invented by the agent
