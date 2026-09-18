# Iskra — Design System

**Iskra** is a quit-smoking app for the **Serbian market** (Latin script). It frames quitting as a warm, premium *lifestyle* journey — not a clinical health tracker. The tone is encouraging, non-judgmental, and personal. Reference aesthetic: the **Liven** app (calm, warm, photographic).

This repository is the **single source of truth** for the brand: tokens, type, components, and high-fidelity UI kits. It feeds two surfaces:

1. **The iOS app** (iPhone 15 Pro mockups, React + Babel) — the product itself. Hand-off target for Claude Code to build the real app.
2. **The marketing website + waitlist** — built in parallel, must feel like the same brand.

---

## Sources / provenance

This design system was **extracted from the app itself** — there was no external Figma or prior system. The canonical, near-production screens live in this same project:

- `screens/HomeScreenV3_1.jsx` — **the canonical home screen** (warm near-white bg, textured ember weekly tracker, "Moj napredak", "Dnevno znanje" card). Token objects `ISK3` (neutrals/brand) and `CAT` (category families) here are the root of truth.
- `screens/Onboarding*.jsx` — the ~18-step onboarding flow (mostly production-ready).
- `screens/*Screen.jsx` — detail screens (Money, Cigarettes, Time, Category, Roadmap, Quote, Knowledge, Settings, Milestoni).
- `frames/ios-frame.jsx` — iPhone 15 Pro device frame (status bar, dynamic island, home indicator; `dark` prop for inverted screens).
- `Iskra Prototype.html` — the fully wired click-through prototype (Welcome → onboarding → paywall → Home + all sub-screens).

**Not yet canonical (rough sketches — do NOT treat as final):**
- The **craving "game" tool screens** (`BreathingScreen`, `WaterScreen`, `PosmatramScreen`, `SetamScreen`, `IgramScreen`, `RazloziScreen`) — directionally right, visuals still exploratory.
- The **Welcome/Splash** screen and a few early onboarding screens — copy/layout still in flux.

---

## CONTENT FUNDAMENTALS

**Language:** Serbian, **Latin script** (never Cyrillic). Gendered forms are written inclusively with a slash: *"Slobodan/na"*, *"prestao/la"*, *"Spreman/na si."*

**Person & address:** Second person, informal **"ti"** — the app talks *to* the user like a steady friend. *"Zašto hoćeš da prestaneš?"*, *"Ti si obala."*, *"Iskra ti pomaže da konačno i hoćeš."* The app refers to itself by name: *"Iskra je tu svaki put kad bude teško."*

**Tone:** Warm, calm, encouraging, **never preachy or fear-based**. Slips are met with zero judgment: *"Jedan dan ne definiše put."*, *"Beležimo sve — bez osude."* Motivation leans on the user's own reasons, not scare tactics.

**Casing:**
- Headlines & body — **sentence case** ("Kako da te zovemo?").
- Eyebrow labels — **ALL-CAPS** with wide letter-spacing ("ZNAJ OVO", "TVOJ PLAN", "DNEVNO ZNANJE", "PORIV MODE").
- Buttons — sentence case ("Nastavi", "Imam poriv", "Počinjemo").

**Numbers:** Serbian formatting — **dot** as thousands separator ("146.000 RSD", "18.800"), comma for decimals. Currency is **RSD** (dinar) by default, EUR optional.

**Punctuation & voice:** Short, declarative sentences. Frequent two-line rhythm (a statement, then a softer reassurance): *"Poriv traje 3–5 minuta. / Tvoj je upravo prošao."* Em-dashes for asides. Occasional first-person from the user's mouth on action buttons ("Imam poriv", "Zapalio/la sam", "Razumem", "Tačno tako").

**Emoji:** **None.** The brand never uses emoji. Iconography is line-icons only.

**Vibe in one line:** *A calm, premium friend in your pocket who believes you'll make it — and never shames you when you stumble.*

---

## VISUAL FOUNDATIONS

**Overall feel:** Warm, airy, premium. Lots of white space. Near-white warm backgrounds, crisp white cards, a single confident ember accent, and pastel category hues in supporting roles. Light mode only — **no dark mode** (the only dark surfaces are full-screen immersive craving tools).

**Color:**
- One brand color: **ember `#E8621A`** (deep warm orange — not yellow, not bright orange), with a vertical gradient to `#F0701F` on buttons/surfaces, `#C9530F` when pressed. Soft tints `#FEF0E8` / `#FBEAE0`.
- App background is a warm near-white `#FDFCFA`; a warmer `#FEF6F0` marks reflective/insight screens.
- **Category color system:** cards stay white — color lives on the **icon and its pastel chip**. Money = green `#3A7A3A`, Cigarettes = red `#C24A43`, Health = green. The "Moj napredak" goals each own a hue (rose/sky/green/teal/terracotta/purple).
- Ember is reserved for **Iskra's own actions** (CTAs, active nav, selected state, streak) — categories never borrow it.

**Type:** **Manrope** throughout. Primary/large text (headlines, big numbers, question titles) is **semibold (600)**; buttons are **bold (700)**; body is regular (400); italic light (300) for the occasional editorial accent word ("*slobode.*"). Secondary text is `#999`.

**Backgrounds & texture:** Mostly flat warm surfaces. The signature move is a **photo-as-texture**: a single hero card (the weekly tracker on home; the "Dnevno znanje" / "Preporučeno" feature cards) sets a warm photo behind a brand-color surface at `mix-blend-mode: soft-light`, ~0.4–0.6 opacity, `saturate(0.7)`. Used **sparingly** — one textured moment per screen, max, so it stays special. Photo hero cards (Liven-style) use a rounded photo container with a legibility scrim and white title/subtitle.

**Selected / active state (THE signature interaction):** Inverted. A selected card/pill flips to an **ember fill** (gradient `#F0701F→#E8621A`) with a soft ember shadow; label/title/subtitle/chevrons turn **white**; an icon *chip* stays **white** with the icon turning ember; a bare icon turns white. Unselected = white card, gray border, icon in its category color.

**Inverted "summary / AHA" screens:** Full ember background, white title/subtitle, white cards kept intact (colored icons, dark body), white status bar (`<IOSDevice dark>`), and a **white button with ember text**.

**Borders & cards:** Cards are white, `1px`/`1.5px` `#ECE9E3` hairline border, radius **18px** standard (14 small, 20 feature/sheet, 26 hero). Soft, low shadows — `0 4px 14px rgba(26,22,15,0.04)` resting, a softer `0 8px 22px` for "modern" cards; ember buttons cast `0 8px 20px rgba(232,98,26,0.28)`.

**Buttons:** Full-width, 56px tall, radius 16, ember gradient fill, white **bold** label. Pressed = scale 0.985 + reduced shadow. Secondary = white, 1.5px gray border, muted gray label. Tertiary = text-only muted link.

**Hover / press:** Touch UI — press states dominate. Buttons shrink slightly (`scale(0.985)`) and drop shadow on press; cards use `WebkitTapHighlightColor: transparent`. Selected toggles animate background/border over ~0.13–0.15s ease.

**Animation:** Restrained and gentle. Slide entrance keyframes per onboarding step; the weekly tracker "today" ring **pulses** (opacity + glow, 1.8s); craving tools breathe/drift slowly (4-4-4 breathing circle, rising water, drifting waves, floating bubbles). Easing is `ease`/`ease-in-out`; celebratory pops use a soft overshoot `cubic-bezier(0.2,0.9,0.3,1.3)`. Respect `prefers-reduced-motion`.

**Transparency & blur:** The iOS frame uses liquid-glass blur (`backdrop-filter: blur(12px) saturate(180%)`). In-app, translucent white pills (`rgba(255,255,255,0.7)`) sit over textured surfaces; immersive tools use translucent-white overlays on colored grounds.

**Imagery vibe:** Warm, natural, aspirational — skies, canyons, sand, water. Never smoke, cigarettes, lungs, or clinical/medical imagery. Photos read warm and soft (slightly desaturated when used as texture).

**Layout rules:** Mobile, 402×874 design canvas (iPhone 15 Pro). Scroll body + fixed bottom CTA / nav. ~52–70px top padding to clear the status bar. Generous 22–26px side gutters. Flex/grid with `gap` for all groupings.

---

## ICONOGRAPHY

- **The logo** is a white **flame-spark** (`iskra` = "spark") — the brand asset, in `assets/`: `iskra-logo.png` (white flame on the ember-gradient square — the app icon), `iskra-flame-white.png` and `iskra-flame-ember.png` (the mark keyed onto transparency for use on any ground). Use the real asset for the logomark/lockup/splash/website nav; don't redraw it.
- **Custom line icons**, hand-built as inline SVG on a 24×24 grid, `fill: none`, `stroke` in context color, **`stroke-width` 1.8–2.1**, round caps & joins (the `Icon3` wrapper in `HomeScreenV3_1.jsx`). Stroke weight bumps slightly (→2.1) when active.
- The set is **Lucide-style** in spirit (same geometric, rounded-stroke language) but drawn in-house — flame, coin, cigarette-off, leaf, spark, house (with door), flag, book, users/user, activity (heart-rate), lungs, molecule, calendar, star, lock, etc. The brand **flame** is the closest thing to a logomark.
- Filled icons appear only inside solid medallions (e.g. the share-card star, selected-state checkmarks).
- **No emoji. No unicode glyphs as icons. No icon font.** When a new icon is needed, match the existing 24×24 / ~1.9 stroke / round-join style, or pull the equivalent from **Lucide** (closest CDN match) and flag it.
- For the website you may load **Lucide** from CDN as the closest match to the in-app set — documented here so it stays intentional.

---

## INDEX — what's in this system

| File / folder | What it is |
|---|---|
| `README.md` | This file — context, content + visual foundations, iconography. |
| `colors_and_type.css` | All design tokens as CSS vars + semantic type classes. Source of truth. |
| `SKILL.md` | Agent-Skill manifest (for use in Claude Code). |
| `preview/` | The Design System tab cards (Type, Colors, Spacing, Components, Brand). |
| `ui_kits/app/` | High-fidelity recreation of core app screens (modular JSX + index.html). |
| `ui_kits/website/` | Marketing/waitlist site kit in the same brand. |
| `assets/` | Brand imagery + texture photos (sky, canyon, sand, water). |
| `screens/`, `frames/`, `Iskra Prototype.html` | The live app source the system was extracted from. |

**Note for the team:** to share this with your org, set the file type to **Design System** in the Share menu.
