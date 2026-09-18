# Handoff: Iskra Marketing Landing Page

## Overview
Pre-launch waitlist / Early-Access marketing site for **Iskra**, a quit-smoking app for the Serbian market (Latin script). Single long-scroll, desktop-first responsive landing page. Primary goal: drive **Early Access email signups** (and a future "kviz"/quiz funnel). Warm, premium, calm, non-judgmental tone.

## About the Design Files
The files in this bundle are **design references built in plain HTML + CSS + vanilla JS** — a working prototype of the intended look, copy, and behavior. They are **not** meant to be shipped as-is. Recreate them in the target stack (recommended: **Next.js / React**, or Astro for a static marketing site) using its established component patterns. The CSS is hand-written with CSS custom properties; port the tokens to your theme layer. If no codebase exists yet, Next.js + CSS modules / Tailwind is a fine choice.

## Fidelity
**High-fidelity.** Final colors, Manrope typography, spacing, copy (Serbian, Latin), animations, and section structure are production-intent. Recreate pixel-faithfully. The Serbian copy is finalized (copy v1.0) — do not paraphrase.

## Files
- `Iskra Landing.html` — the full page markup (all sections + inline JS at the bottom: sticky nav, scroll-reveal IntersectionObserver, count-up stats, FAQ accordion, waitlist form success state, savings-chart pill switcher, how-it-works bento bar-fill, testimonial marquee builder, knowledge expanding slider).
- `landing/styles.css` — all styling and design tokens (`:root` custom properties).
- `landing/*.jpg|png` — real photo textures and generated assets (see Assets).
- `assets/iskra-logo-sm.png`, `assets/iskra-flame-white.png` — brand mark.
- `Iskra Landing (offline).html` — fully self-contained single-file build (all assets inlined) for quick preview.

## Design Tokens (from `landing/styles.css` :root)
- **Ember brand:** `--ember:#E8621A`, gradient `--ember-grad: linear-gradient(180deg,#F0701F,#E8621A)`, `--ember-deep:#C9530F`, `--ember-tint:#FEF0E8`.
- **Neutrals:** `--bg:#FDFCFA` (page), `--bg-warm:#FEF6F0`, `--bg-cool:#F4F2EE`, `--card:#FFFFFF`, `--border:#ECE9E3`, `--dark:#191512` (dark sections).
- **Text:** `--ink:#1A1A1A`, `--muted:#6B6660`, `--faint:#9A938B`.
- **Category hues:** money/green `#3A7A3A`, cigarettes/red `#C24A43`, plus rose `#D4547E`, sky `#4A8AC4`, teal `#2E8B80`, purple `#6B52A8`, amber `#BA7517`.
- **Radii:** 14 / 18 / 24 / 30 px (`--r-sm`…`--r-xl`); pill 999.
- **Shadows:** `--shadow-sm`, `--shadow`, `--shadow-lg`, `--shadow-ember` (defined in :root).
- **Font:** Manrope (Google Fonts), weights 300–800. Headlines/numbers 600–700, buttons 700, body 400, light-italic 300 accents.
- **Max content width:** 1180px (`--maxw`), wrap padding 0 28px.

## Sections (top → bottom)
1. **Sticky pill nav** (`.nav`/`.nav-inner`) — floating rounded bar, blur backdrop; flame logo + "ISKRA"; links (Kako radi / Alati / Napredak / Pitanja); ember CTA "Uradi kviz". Gains shadow on scroll (`.scrolled`).
2. **Hero** (`.hero`, 2-col) — LEFT: copy on light bg (ember eyebrow "Uskoro za Srbiju", h1 "Prestani da pušiš. / Ovaj put zaista." with semibold ember accent, bold lead, email form `#form1`, "Uskoro" store badges, stat strip 2.596+ / 100% / 0). RIGHT: `.hero-visual` — full-height landscape panel (`landing/hero-bg.jpg`) absolutely positioned to the right ~48vw, `border-radius:36px 0 0 36px`, slides **behind the floating nav** (top:0; nav z-index 100 > visual z-index 1). A static framed iPhone (`.hero-phone`, dark bezel via CSS border) sits centered showing the app home screen. Orange mountain contour overlay (`.mtn.mtn-o`) faded along the section bottom. ⚠️ See CLAUDE.md "OPEN HANDOFF TASKS": the phone screenshot needs a clean 402×874 recapture; the eventual goal is to replace `.hero-visual-bg` with a looping 9:16 product video.
3. **Trust bar** (`.trust`) — "Pristup zasnovan na javno dostupnim smernicama…" + institution wordmarks (WHO, Mayo Clinic, NHS, Harvard Health, CDC, Cochrane, NIH) + disclaimer microcopy.
4. **Empathy "RAZUMEMO"** (`.empathy`) — headline "Prestanak je težak. Ali nisi sam/a u tome.", a stat cell ("8–10 puta"), a gauge ("3–5 min" semicircle), and a testimonial photo card. Orange mountain contour bottom.
5. **Audience "ZA TEBE JE AKO"** (`.audience` / `.aud-bento`) — editorial bento, 5 cards (span3,span3 / span2,span2,span2). Each: an **ember icon chip** (NOT a number, NOT an image) + bold title + body. Titles: Pokušavao si ranije / Znaš svoje okidače / Ne želiš predavanja / Hoćeš da vidiš napredak / Znaš da motivacija ne traje.
6. **Feature grid "TVOJ SAPUTNIK"** (`.feat-grid` / `.featc`) — 6 cards, fixed `height` with `overflow:hidden`; each has icon + title + body, and a **phone screenshot in a CSS bezel that peeks ~50% from the bottom** (`.featc .shot` fixed 520px, `object-fit:cover`, `flex-shrink:0` so it overflows and clips). Screens: water, money, home, milestoni, knowledge, onboarding.
7. **How it works "KAKO RADI"** (`.bento`, staggered 2-col 40/60↔60/40) — interactive Iskra elements, no screenshots: card1 quiz "plan chips" (inverted ember selected pills), card2 animated savings bars (log-scaled 400→146k, fill on scroll via `#bbars`), card3 poriv countdown ring + tool list, card4 weekly tracker (ember check days + pulsing "?"). Orange mountain bottom.
8. **Toolkit "PORIV MOD"** (`.toolkit`, dark) — full-bleed horizontal scroll rail (`.tool-rail`, `margin/padding: calc(50% - 50vw)` to break out of wrap; `overflow-x:auto`), 6 `.tslide` cards each a full-bleed atmospheric **real photo** texture (`landing/tex-*.jpg`) + scrim + "ALAT 0N" + title + body. Tools: Dišem / Pijem vodu / Moji razlozi / Šetam / Odlažem / Beležim. Arrow buttons `#railPrev/#railNext`. Beige mountain overlay (`.mtn-w`).
9. **Progress/savings** (`.savings`) — copy + selectable metric pills (Ušteđeni novac / Cigarete manje / Vraćeno vreme) that re-render an animated bar chart (`#chart`, JS in page).
10. **Knowledge "SAZNAJ"** (`.krail`) — expanding horizontal slider, 4 article cards with distinct abstract gradient placeholders + drop-target image-slots; text/tag reveal only when a card is fully expanded (delayed transitions). Below: centered "Iskra Blog" ghost CTA.
11. **Stat band** — giant ember count-up "146.000" + caption.
12. **Joinflow "KADA SE PRIJAVIŠ"** (`.joinflow`, warm) — 3-step ember numbered timeline + trust line + dual CTAs. Orange mountain bottom.
13. **Reviews** (`.marquee`) — ember-gradient "2.596+" count-up + "ljudi već čeka pristup Iskri"; two rows of testimonial cards auto-scrolling in **opposite directions** (CSS `scrollL`/`scrollR`), illustrated avatars (`landing/av-*.png`), verified ember checkmark; built by JS at page bottom into `#mrow1/#mrow2`.
14. **Mechanism "ZAŠTO JE DRUGAČIJE"** (`.mech`) — **ember-inverted** (full ember-gradient bg, white headline/lead, 3 **white** cards Pre/Tokom/Posle poriva with ember-deep eyebrows, white CTA with ember text).
15. **Comparison "UPOREDI PRISTUPE"** (`.compare`, dark) — feature table, Iskra column highlighted with ember checks vs two "other" columns (dashes/partials). Beige mountain overlay.
16. **Early Access offer** (`#cena`) — replaces pricing; eyebrow EARLY ACCESS, 3 benefit cards (Rani pristup / Početna ponuda / Uticaj na proizvod), dual CTAs. (Do NOT show real prices yet.)
17. **FAQ** (`.faq-list`) — 8 accordion items (single-open).
18. **Footer** (`.foot`, dark) — final email CTA + quiz link, brand + "Uskoro" store badges, link columns, socials, big "ISKRA" wordmark, beige mountain overlay.

## Interactions & Behavior (all in the `<script>` at the bottom of `Iskra Landing.html`)
- Sticky nav shadow on `scrollY>20`.
- `.reveal` elements fade/translate in via IntersectionObserver (`.in` class); `.d1`–`.d4` stagger delays.
- `[data-count]` numbers count up (cubic ease) when scrolled into view; formatted with `sr-RS` locale (dot thousands).
- FAQ accordion: one open at a time (max-height transition).
- Waitlist forms (`#form1`, `#form2`): preventDefault → hide form, show `.ok` success note. **Front-end only — wire to a real provider on build.**
- Savings chart: metric pills swap dataset + recolor bars.
- How-it-works bars fill on scroll (`#bbars`).
- Testimonial marquee rows built from a JS data array; pause on hover; opposite-direction CSS animations with edge fade masks.
- Knowledge slider: click/hover expands a card (`.active`), others shrink; body text reveal delayed until expanded.
- Respect `prefers-reduced-motion` where practical when porting.

## Responsive
Desktop-first. Breakpoints at 980px and 560px collapse grids to single column, hide nav links (add a mobile menu in production), stack the hero (landscape panel becomes a top banner), and turn the knowledge slider vertical. The hero's right-half absolute panel must become a normal stacked block on mobile.

## Assets
- Brand: `assets/iskra-logo-sm.png` (app-icon mark, ember tile), `assets/iskra-flame-white.png` (white flame on transparent).
- Hero landscape: `landing/hero-bg.jpg` (warm sunset mountains). Hero start-frame for video: `landing/hero-video-frame.jpg`.
- Mountain contour overlays: `landing/mtn-orange.png` (warm sections), `landing/mtn-beige.png` (dark sections) — keyed to transparency, placed bottom with a top fade, low opacity.
- Toolkit textures: `landing/tex-disem.jpg` (clouds), `tex-voda.jpg` (ocean), `tex-razlozi.jpg` (forest), `tex-setam.jpg` (trail), `tex-posmatram.jpg` (snowy peaks), `tex-igram.jpg` (nebula).
- Texture washes: `landing/canyon-bg.jpg`, `assets/sand-bg.jpeg`, `assets/sky-bg.webp`.
- Avatars: `landing/av-m0..2.png`, `av-w0..2.png` (illustrated).
- App screenshots: `mockups/*.png` (home, money, water, breathing, milestoni, knowledge, onboarding, etc.).
- Fonts: Manrope via Google Fonts CDN (self-host for production).
- Icons: inline SVG, Lucide-style, ~1.9 stroke, round joins. No icon font, no emoji.

## Copy & brand rules
Serbian, Latin script; informal "ti"; inclusive "/na" forms; sentence case; **no emoji**; calm, non-judgmental. Avoid: "AI coach", "leči zavisnost", "garantovano", "klinički dokazano", em-dashes in body copy. The CTA hierarchy: primary "Uradi kviz" / "Uradi besplatni kviz", secondary "Uđi na listu", email "Prijavi se". App is **pre-launch** — store badges say "Uskoro", no live download, no public pricing.

## Related
- `HANDOFF.md` (project root) — the **app** (in-app screens) handoff.
- `CLAUDE.md` — build log + open tasks (incl. hero phone recapture + Higgsfield video).
- `colors_and_type.css`, `README.md`, `SKILL.md` — design system.
