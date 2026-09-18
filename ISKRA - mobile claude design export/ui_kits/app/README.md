# Iskra — App UI Kit

High-fidelity, modular recreation of the Iskra iOS app's core UI, distilled from the canonical screens (`screens/HomeScreenV3_1.jsx` and siblings). These are **cosmetic, reusable** components — not production logic.

## Files
- `components.jsx` — the reusable kit: `Button`, `StatCard`, `OptionPill` (with the signature inverted selected state), `ProgressBar`, `BottomNav`, `Eyebrow`, the `Ico` icon wrapper + brand icons (`Flame`, `Spark`, `Coin`, `CigOff`), and the `ISK` / `CAT` / `GOAL` token objects. Exposes everything on `window`.
- `index.html` — a representative **home screen** composed from the kit, mounted in the iPhone 15 Pro frame (`frames/ios-frame.jsx`). Shows greeting, the textured ember weekly tracker, category stat cards, the "Moj napredak" goal grid, the "Imam poriv" CTA, and the bottom nav.

## The full app
The complete, wired product lives at the project root — start from **`Iskra Prototype.html`** (Welcome → onboarding → paywall → Home + every sub-screen). Canonical home is **`Iskra Home v3-1.html`**. Treat those as the reference; this kit is the extracted, documented component layer.

## Load order
React 18.3.1 → ReactDOM → Babel standalone → `frames/ios-frame.jsx` → `components.jsx` → your screen. All `<script type="text/babel">`. Design canvas is 402×874.

## Conventions
- Primary text/headings/numbers = Manrope **600**; buttons = **700**; body = 400.
- Selected/active = **inverted** ember fill + white text (+ white icon chip with ember icon). See `OptionPill`.
- Cards stay white; category color lives on the icon + its pastel chip.
- One photo-texture moment per screen, max.
