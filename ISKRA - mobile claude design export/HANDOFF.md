# Iskra — Developer Handoff (read this first)

This project is a **complete, working design prototype** of Iskra, a warm/premium quit-smoking app for the Serbian market (Latin script), plus its **design system** and an in-brand **marketing/waitlist site**. Your job is to **recreate these designs in a real codebase** — not to ship the HTML as-is.

## What these files are (and aren't)
- The screens are **React components transpiled in-browser by Babel** — a high-fidelity prototyping setup, not a production build. Treat them as **pixel-accurate design references**: colors, type, spacing, copy, and interactions are all final-intent.
- Rebuild them in the target environment using its established patterns. Recommended native target: **React Native / Expo** (or SwiftUI) for the app; **Next.js/React** for the website. If you keep React-for-web, lift each screen out of the in-browser-Babel/IIFE setup into real modules.

## Fidelity: HIGH
Final colors (hex), Manrope type ramp, spacing, radii, shadows, motion, and Serbian copy are all production-intent. Match them exactly. The one explicitly-rough area: the **craving "games"** (`IgramScreen`, `WaterScreen`, etc.) and the **Welcome/Splash** are concept sketches — everything else is near-production.

## Start here, in order
1. **`CLAUDE.md`** — the canonical **build log**: architecture, every screen, the full onboarding `STEPS` order, navigation contract, and a CRITICAL note on global-scope collisions (why every `screens/*.jsx` is IIFE-wrapped). Read this fully before touching code.
2. **`README.md`** — the **design-system guide**: product context, content/tone rules (informal "ti", "/na" inclusive forms, sentence case, no emoji), and visual foundations.
3. **`colors_and_type.css`** — all **design tokens** as CSS variables (color, type ramp, radii, shadows). Single source of truth — port these to your theme/tokens layer first.
4. **`SKILL.md`** — condensed brand rules, usable as an agent skill.

## Where the designs live
- **`Iskra Prototype.html`** — the fully wired flow (Welcome → onboarding → paywall → Home + every sub-screen). Best way to experience intended behavior. State persists in `localStorage`.
- **`Iskra Home v3-1.html`** — the **canonical home screen** (this is the target home, not v3).
- **`screens/*.jsx`** — one component per screen; sibling `Iskra <Name>.html` files mount each in isolation in the iPhone 15 Pro frame (`frames/ios-frame.jsx`, design size **402×874**).
- **`ui_kits/app/`** — extracted reusable component layer (`components.jsx`) + a composed home (`index.html`). The cleanest starting point for your component library.
- **`ui_kits/website/`** — the in-brand marketing/waitlist landing page (responsive; form is front-end only — wire to your provider).
- **`preview/`** — design-system specimen cards (Type / Colors / Spacing / Components / Brand).
- **`assets/`** — real brand assets: `iskra-logo.png` (app icon), `iskra-flame-white.png` / `iskra-flame-ember.png` (logomark on transparency), and texture photos (sky/canyon/sand/water).
- **`handoff_screenshots/`** — rendered PNGs of the key screens as visual targets (see its README).

## Non-negotiable brand rules
- **Manrope** throughout. Large/primary text & numbers = SemiBold 600; buttons = Bold 700; body = 400; light-italic 300 for accent words.
- One brand color: **ember `#E8621A`** (gradient `#F0701F → #E8621A`), reserved for Iskra's own actions. Categories carry their own pastel hues on **icon + chip only**; cards stay white.
- **Selected/active = inverted**: ember fill + white text + white icon chip with the icon turned ember. This pattern repeats everywhere — implement it once.
- Warm near-white bg `#FDFCFA`; 18px card radius; 56px ember buttons; soft low shadows.
- Custom 24×24 line icons (~1.9 stroke, round joins, Lucide-style). No emoji, no icon font.
- Photo-as-texture (soft-light over a brand surface) is a signature move — one per screen, max.

## Complete screen inventory

Every screen is `screens/<Name>.jsx` with a sibling `Iskra <Name>.html` launcher (mounts it alone in the iPhone 15 Pro frame). `Iskra Prototype.html` wires them all together. `[DARK]` = inverted ember/dark surface using `<IOSDevice dark>` (white status bar). The authoritative wiring + exact copy lives in `CLAUDE.md`; this is the orientation map.

### A. Onboarding (in flow order — the `STEPS` array in `Iskra Prototype.html`)
The funnel alternates **question screens** (white) with **reflection/AHA screens** (warm `#FEF6F0` or full-ember `[DARK]`) to give emotional rhythm. Progress bar is a thin 2px ember fill at top (fractions not yet normalized — early screens /11, later /18).

1. **`SplashScreen`** — welcome. ISKRA wordmark + ember spark accent, tagline "Znaš da treba. / Iskra ti pomaže da konačno i hoćeš.", "Počni" CTA + "Već imam nalog" login link. `onStart`/`onLogin`. *(Concept-level polish — flagged rough.)*
2. **`OnboardingName`** — text input "Kako da te zovemo?", focus turns border ember, "Nastavi" disabled until typed.
3. **`OnboardingGender`** — "Kako da te oslovljavamo?" Two tall **photo cards** (Muško/Žensko) using fillable image slots, white label-pill + chevron; selected = ember. Plus "Preferiram da ne kažem" text option.
4. **`OnboardingProduct`** — "Šta koristiš?" Two stacked cards: **Cigarete** / **IQOS** (icon + title + subtitle + radio); selected uses the inverted ember-fill pattern.
5. **`OnboardingCigarettes`** — "Koliko cigareta dnevno…" big −/number/+ stepper (default 20) + a **"Cigara u pakli"** numeric input (default 20) below a divider.
6. **`OnboardingPrice`** — "Koliko košta tvoja kutija?" free numeric input + **RSD/EUR currency toggle** (default RSD).
7. **`OnboardingCost`** `[DARK]` — AHA reveal: full ember bg, white card with big "146.000 RSD" + "= 10 dana odmora na moru". White "Nastavi".
8. **`OnboardingReasons`** — "Zašto hoćeš da prestaneš?" 2-col multi-select pills (max 3): Zdravlje/Porodica/Pare/Forma/Sloboda/Pritisak, each a category color; selected = inverted ember.
9. **`OnboardingReasonText`** — "Zapiši to svojim rečima." Free-text textarea + 120-char counter, wrap-around example chips that fill the field, privacy note.
10. **`OnboardingReflection`** `[DARK]` — reasons reassurance: full-ember bg, white title/subtitle, 3 white cards (Zdravlje/Porodica/Sloboda) with colored icons + ember bold line. "Razumem".
11. **`OnboardingFears`** — "Šta te brine kod prestanka?" 2-col multi-select pills (porivi/stres/kafana/neuspeh/razdražljivost/kilaža), same pill styling as Reasons.
12. **`OnboardingFearReflection`** `[DARK]` — fear reassurance: full-ember bg + 3 white cards (jaki porivi / stres / kafana i društvo) with bold ember takeaway lines. "Spreman/na sam".
13. **`OnboardingTriggers`** — "Kada ti se najviše puši?" 2-col multi-select (6) + full-width "Čekanje i dosada"; inverted-selected.
14. **`OnboardingTiming`** — "Kada hoćeš da prestaneš?" single-select auto-advance cards: Odmah / Uskoro / Već sam prestao/la; selected = ember fill, white text, white icon chip with ember icon.
15. **`OnboardingDate`** — "Koji datum si izabrao/la?" interactive month calendar (selected day = ember filled), research footnote, "Potvrdi datum".
16. **`OnboardingPreview`** `[DARK]` — 3-month preview: full-ember bg, 3 benefit cards (Finansije/Zdravlje/Sloboda) + Marija testimonial (verified ✓, 5 stars). "Jedva čekam".
17. **`OnboardingPanic`** — onboarding climax: big circular **panic-button demo** with pulsing dashed ring; tapping the circle advances (no Nastavi). "Imam poriv".
18. **`OnboardingCommitment`** `[DARK]` — ceremonial contract: ISKRA wordmark, "Pavle, sklapamo dogovor.", 4 pledges with white-circle + ember-tick checkboxes, interactive `<canvas>` **signature pad** (pre-filled sample, X clears), white "Potpisujem". No progress bar.
19. **`OnboardingSummary`** `[DARK]` — full scrollable recap on ember: savings area-chart, 2×2 stat grid, health-milestone timeline, razlozi cards, "Počinjemo".
20. **`OnboardingNotifications`** — permission ask: bell in ember circle, 3 sample notification cards, "Dozvoli obaveštenja" + "Možda kasnije".
21. **`ReviewModal`** — iOS-style rate prompt, 5 stars, "Oceni Iskru" / "Ne sada".
22. **`Paywall`** — long scroll: countdown, data pills, 3 tiers (Mesečno / **Godišnje** with full-width "most popular" banner / Doživotno), CTA, payment-trust row, benefits, money-back, red/green "Dva puta napred" compare, reviews, FAQ accordion. `onBuy`/`onFree` → Home.
- **`OnboardingInsight`** — an earlier standalone insight interstitial ("ZNAJ OVO / Svaka osoba koja je prestala je jednom počela", warm bg). Kept for reference; not in the current linear flow.

### B. Home & navigation
- **`HomeScreenV3_1`** — ⭐ **CANONICAL HOME** (build the app against this one). Greeting + avatar (→ Settings) + ember flame **streak badge**; the **"Ova nedelja" weekly tracker** rendered as an **ember surface with a sand photo blended in via `mix-blend-mode: soft-light`** (the signature texture move) — white check circles, pulsing white "?" for today (opens daily check-in); **live countdown** card (Dan/sati/minuta/sekunde, ticking, → Time detail); two **stat cards** (RSD ušteđeno = green, cigareta odbijeno = red, each → its detail); **Quote dana** card (→ Quote); a teal **"Dnevno znanje"** card at the top of "Moj napredak" (same texture treatment, → Knowledge); the **"Moj napredak"** section: next-goal card (→ Roadmap) + 6 category goal cards with progress bars (→ Category detail), total-time tracker, and a muted in-scroll **"Zapalio/la sam"** slip button; fixed full-width ember **"Imam poriv"** button; bottom nav **Početna / Milestoni / Saznaj / Profil**. Also contains the **daily check-in overlay** (blurred backdrop, "Čist sam danas" / "Zapalio/la sam") and the **success confetti** celebration frame.
- **`HomeScreenV3`** — prior iteration (white weekly tracker, no photo texture). `HomeScreen` / `HomeScreenV2` — earliest, kept for history only.
- **`HomeScreenDay0`** — **empty/first-day state**: streak 1, all-empty week rings, "POČINJE DANAS" countdown at zeros, 0-value stat cards, locked 60%-opacity goal cards. Use as the new-user state.
- **`HomeScreenSlip`** — **slip-state home**: snowflake streak in muted purple, "NOV POČETAK" counting up from the slip, white-X tracker mark for the slip day. Use after a logged relapse.
- **`HomeScreenTeaser`** — promo-only copy of Home v3-1 with hero numbers (Dan 93, 42.600 RSD, 2080, streak 98); drives `Iskra App Teaser.html`. Not an app screen.

### C. Home detail screens (pushed from Home)
- **`TimeScreen`** ("Tvoje vreme") — ember hero time card (2×2 grid) + **milestone road** of full cards (past achieved / "TI SI OVDE" current / faded upcoming, dotted connectors), recovered-time card, share. From the countdown card.
- **`MoneyScreen`** ("Uštedine") — green accent; hero "18.800 RSD", SVG area chart, "Ako nastaviš" projections, "To je kao…" equivalents, **cigarettes crosslink**, share. From the RSD stat card.
- **`CigarettesScreen`** ("Odbijene cigarete") — red accent; hero "940", cumulative line chart, "Šta nisi uneo/la u sebe" health-impact rows, pack count, projections, **money crosslink**, share. From the cigarettes stat card.
- **`MilestoniScreen`** — the **Milestoni tab**: Liven-style **photo hero card** (sky image) + 2-col achievement grid — unlocked colored cards (Dan 1 ember / 7 dana amber / 30 dana green / Čist blue, each with a PODELI share row) and locked white cards with a **category annotation pill** + "još …" countdown.
- **`CategoryScreen`** ("Moj napredak" category detail) — **template for all 6 categories** (config map; Zdravlje built out, rose). Next-milestone pill, "7 / 12 postignuto", vertical milestone timeline (achieved/current-with-bar/upcoming), WHO/CDC disclaimer. From a goal card.
- **`GoalsRoadmapScreen`** ("Moj napredak" roadmap) — single continuous chronological timeline of all categories: muted achieved rows → one highlighted "SLEDEĆE" current card with progress → upcoming rows with category color + "Za N dana". From the next-goal card.
- **`KnowledgeScreen`** ("Saznaj" tab) — knowledge base: ember **featured card** (with the canyon photo-texture), category grid (horizontal-scroll), Popularno + Novo article lists. Has its own bottom nav (Saznaj active). Replaces the old Zajednica tab.
- **`QuoteScreen`** ("Quote dana") — editorial quote detail: category pill, big quote, author with **rounded-square avatar**, pagination dots, Iskra fun-fact card, "Podeli quote". From the Home quote card.
- **`SettingsScreen`** ("Podešavanja") — profile card, grouped setting sections (Moj profil / Podešavanja / Premium / O Iskri / Moje iskustvo), danger zone (Počni iznova / Odjava), version. From the greeting/avatar.

### D. Craving ("Poriv") flow
Triggered by the fixed **"Imam poriv"** button on Home.
- **`PorivEntry`** — warm transitional screen: "Koliko jak je poriv?" custom 1–10 slider (number follows the thumb) + "Šta te navelo?" scrollable single-select trigger list; "Pokreni" enables once both are set. `onStart({strength,trigger})`.
- **`PorivMode`** — the hub: **half ember (live countdown ring + breathing dot), half white** ("IZABERI ALAT" + 2×3 tool grid). Bottom slip link "Ipak sam zapalio/la".
- **Six craving tools** (each full-screen, its own immersive ground, a timer, and a low-emphasis "Završio/la sam"; all resolve into Poriv Success):
  - **`BreathingScreen`** ("Dišem") `[DARK]` charcoal — the app's one dark tool; real 4-4-4 breathing ring, 4 rounds.
  - **`WaterScreen`** ("Pijem vodu") — blue; water rises bottom→top over 45s, text flips blue→white as it submerges (two-layer clip).
  - **`RazloziScreen`** ("Moji razlozi") — white/warm; the user's own saved reason in a quote card with their signature + a "DAN 47" fact card. Calm, personal.
  - **`SetamScreen`** ("Šetam") `[DARK]` forest green — dashed walking trail with dots pulsing along it, step pill.
  - **`PosmatramScreen`** ("Posmatram") `[DARK]` indigo — ACT urge-surfing; a slow drifting wave + mirrored reflection. The quietest screen.
  - **`IgramScreen`** ("Igram se") `[DARK]` purple — bubble-pop; floating glassy bubbles, one mid-pop bursting into rising smoke (the Iskra twist).
- **`PorivSuccessScreen`** `[DARK]` — calm ember celebration after any tool: "Izdržao/la si.", micro-stat ("odoleo/la već N puta"), brain fact card, next-milestone card, white "Nazad na početnu".

### E. Slip / relapse flow (non-judgmental)
Reached from "Zapalio/la sam" (Home) or the daily check-in.
- **`SlipScreen`** — warm, zero-drama: "Jedan dan ne definiše put.", the **never-resetting total timer** card ("47 dana iza tebe. / I dalje brojiš. Ne resetuje se."), "Nastavljam" + bordered "Šta me je nateralo?".
- **`SlipReflectScreen`** ("Šta me je nateralo?") — scrollable trigger list (inverted-selected), with a fixed ember **info card** + "Razumem" pinned above the bottom.
- **`SlipRecapScreen`** — centered recap: "47 dana su tvoja zauvek.", health card + **personal-reason card** with an enlarged faded ember quote mark + signature, "Dan 1 počinje upravo sad.", "Nastavljam dalje".
- **`ProgressSheet`** — bottom-sheet over Home: "Ažurirali smo tvoj napredak." (streak reset to Dan 1 / total time stays), ember support card, "Razumem".

### F. Marketing & promo (not app screens)
- **`ui_kits/website/index.html`** — in-brand **waitlist landing** (hero with photo-texture panel, email capture, 3 pillars, quote band). Form is front-end only.
- **`Iskra App Teaser.html`** (+ `… (offline).html`) — transparent looping **phone mockup** of Home for promo/video. Straight angle, glassy frame, auto-scroll.
- **Shareable achievement card** — 9:16 stories-format milestone card (see `preview/` / project root).

### Navigation contract
Selection screens auto-advance via `onNext`; multi-selects need ≥1 choice to enable "Nastavi"; `onBack` everywhere. Splash = `onStart`/`onLogin`; Notifications = `onNext`/`onSkip`; Paywall = `onBuy`/`onFree`. Detail screens take `onBack` (+ crosslink callbacks). In the prototype, Home owns a `view` state machine; detail/tool/slip screens are guarded by `window.<Component>` so each standalone launcher no-ops missing siblings.
