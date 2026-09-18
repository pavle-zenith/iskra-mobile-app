# Iskra — Website / Waitlist UI Kit

The marketing surface, built in the **same brand** as the app. A single responsive landing page (`index.html`) for the pre-launch **waitlist**.

## What's here
- **Nav** — flame logomark + ISKRA wordmark + "Uđi na listu" CTA.
- **Hero** — ember eyebrow, big mixed-weight headline (bold + light-italic accent, the app's signature), lead copy, an inline **email capture** with success state, and a privacy micro-line. The visual panel reuses the app's **photo-as-texture** treatment (canyon on ember) with the big "47 dana slobode" number.
- **Pillars** — three white feature cards (Za svaki poriv / Vidiš svaki dinar / Bez osude), each with a pastel icon chip — mirrors the app's category-icon language.
- **Quote band** — warm `#FEF6F0` panel with the brand's non-judgmental promise.
- **Footer**.

## Brand fidelity
- Pulls every value from `colors_and_type.css` (linked). No new colors.
- Manrope; headlines 700 with 300-italic accent words; ember CTAs with the gradient + `shadow-ember`; warm `#FDFCFA` page bg, `#FEF6F0` band; 20–28px radii; soft shadows.
- Copy follows the content rules: informal "ti", inclusive "/na" forms, sentence case, no emoji, calm + non-judgmental.
- Fully responsive (single-column under 880px).

## Notes
- The form is cosmetic (front-end only) — wire it to your waitlist provider on build.
- Icons are inline SVG in the in-app style; for a larger site you may load **Lucide** from CDN (closest match) — see README iconography.
