/**
 * Iskra design tokens.
 *
 * SOURCE OF TRUTH: iskra-website-final/src/app/globals.css, the `@theme` block.
 * These values are a verbatim port, via the transcription in ROADMAP.md Part 0.
 * Do not edit a value here without changing globals.css first, or the app and the
 * site drift apart. Each key names its CSS custom property so a diff stays readable.
 *
 * Ember is #ec691c. The website's PRODUCT.md says #E8621A and is out of date.
 */

export const palette = {
  // Brand
  ember: '#ec691c', //        --color-ember
  emberHover: '#df5f13', //   --color-ember-hover
  emberTint: '#fdede2', //    --color-ember-tint
  emberWash: '#f9dcc8', //    --color-ember-wash

  // Ground
  paper: '#fdfcfa', //        --color-paper
  surface: '#ffffff', //      --color-surface
  well: '#f6f2ec', //         --color-well
  line: '#e8e1d8', //         --color-line

  // Ink
  ink: '#191512', //          --color-ink
  inkSoft: '#3b3530', //      --color-ink-soft
  muted: '#6b6660', //        --color-muted

  // Poriv tools
  toolDisem: '#2e8b80', //    --color-tool-disem
  toolDisemTint: '#e2f1ee', //
  toolVoda: '#3f86c4', //     --color-tool-voda
  toolVodaTint: '#e4eef8', //
  toolRazlozi: '#ec691c', //  --color-tool-razlozi
  toolRazloziTint: '#fdede2',
  toolSetam: '#3f8d52', //    --color-tool-setam
  toolSetamTint: '#e4f1e6', //
  toolOdlazem: '#55559a', //  --color-tool-odlazem
  toolOdlazemTint: '#e9e9f4',
  toolBelezim: '#7a5cc4', //  --color-tool-belezim
  toolBelezimTint: '#eee8f8',

  // Napredak
  money: '#3a7a3a', //        --color-money
  moneyDeep: '#2f6630', //    --color-money-deep
  moneyTint: '#e6f0e6', //    --color-money-tint
  health: '#c2446f', //       --color-health
  healthDeep: '#a93a60', //   --color-health-deep
  healthTint: '#fbe7ee', //   --color-health-tint
  time: '#6b52a8', //         --color-time
  timeDeep: '#58438f', //     --color-time-deep
  timeTint: '#ece7f6', //     --color-time-tint

  // Comparison verdicts ONLY. Never pointed at the user: no slip, no streak, no warning.
  negative: '#c24a43', //     --color-negative
  negativeTint: '#fde4e1', // --color-negative-tint
  negativeInk: '#9f3129', //  --color-negative-ink

  // Not a site token: the label colour on ember and tool badges.
  white: '#ffffff',
} as const;

export type PaletteKey = keyof typeof palette;
