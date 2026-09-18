---
name: iskra-design
description: Use this skill to generate well-branded interfaces and assets for Iskra (a warm, premium quit-smoking app for the Serbian market, Latin script), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the app and its marketing website.
user-invocable: true
---

Read the `README.md` file within this skill first — it covers product context, content fundamentals (tone, casing, Serbian copy rules), visual foundations, and iconography. Then explore the other files:

- `colors_and_type.css` — all design tokens (CSS vars) + semantic type classes. The source of truth for color, type, radii, shadows.
- `preview/` — annotated specimen cards (Type, Colors, Spacing, Components, Brand).
- `ui_kits/app/` — reusable app components (`components.jsx`) + a composed home screen (`index.html`) in the iPhone 15 Pro frame.
- `ui_kits/website/` — the in-brand marketing/waitlist landing page.
- `assets/` — texture/imagery photos (sky, canyon, sand, water).

Key rules to honor:
- **Manrope** everywhere. Primary/large text = SemiBold 600; buttons = Bold 700; body = 400; light-italic 300 for accent words.
- One brand color: **ember `#E8621A`** (gradient `#F0701F→#E8621A`), reserved for Iskra's own actions. Categories use their own pastel hues on icon + chip; cards stay white.
- Selected/active state is **inverted**: ember fill + white text + white icon chip with ember icon.
- Warm near-white backgrounds (`#FDFCFA`), soft low shadows, 18px card radius, 56px ember buttons.
- Serbian, Latin script; informal "ti"; inclusive "/na" forms; sentence case; **no emoji**; calm and non-judgmental.
- Custom 24×24 line icons (~1.9 stroke, round joins; Lucide-style). No emoji, no icon font.
- Photo-as-texture (soft-light over a brand surface) is a signature move — use sparingly, one per screen.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and produce static HTML for the user to view. If working on production code, copy assets and apply these rules to design as a brand expert. If the user invokes this skill without guidance, ask what they want to build, ask a few questions, and act as an expert Iskra designer outputting HTML artifacts or production code as needed.
