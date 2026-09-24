import { Platform } from 'react-native';

import type { ToolKey } from '@/lib/vocab';

import { palette } from './tokens';

export { palette } from './tokens';
export { fontFamily, textVariants, type TextVariant } from './typography';

/**
 * Semantic roles. Screens reach for these, not for raw palette keys, so that a dark
 * scheme can be added later by remapping roles instead of rewriting screens.
 *
 * Contrast on paper (#fdfcfa), measured:
 *   text 17.7:1 · textSoft 11.8:1 · textMuted 5.5:1 · accent 3.1:1 (display sizes only)
 */
export const color = {
  bg: palette.paper,
  surface: palette.surface,
  well: palette.well,
  line: palette.line,

  text: palette.ink,
  textSoft: palette.inkSoft,
  textMuted: palette.muted,

  accent: palette.ember,
  accentPressed: palette.emberHover,
  accentTint: palette.emberTint,
  accentWash: palette.emberWash,
  /** White on ember is 3.18:1: large text (19pt bold, or 24pt) and icons only. */
  onAccent: palette.white,

  /**
   * The ember field: a full-bleed ember ground, the website's `.band`. What the design export
   * calls a [DARK] screen is this, not a dark grey one: the onboarding AHA screens, the
   * commitment ceremony and the summary.
   *
   * White text on it is 3.18:1, so on a field ONLY display type (24pt+) or 19pt bold may sit
   * directly on the ember. Anything a person reads goes on a white plate, exactly as the site
   * does it. `fieldPlate` is that plate, and text on it uses the normal ink roles.
   */
  field: palette.ember,
  onField: palette.white,
  fieldPlate: palette.surface,
  /** Hairlines and inactive track on a field. Decoration only, never text. */
  onFieldFaint: 'rgba(255, 255, 255, 0.32)',

  /** Ink at 45% behind a sheet, so the screen under it recedes without going dark. */
  scrim: 'rgba(25, 21, 18, 0.45)',
} as const;

export type ColorRole = keyof typeof color;

/** The tool vocabulary lives in src/lib/vocab.ts (it is also a database value). */
export type { ToolKey } from '@/lib/vocab';

/**
 * Poriv tool colours. As on the website, the glyph sits in `color` on a `tint` square,
 * always beside the tool's text label. Glyph-on-tint contrast is 2.78:1 (razlozi) to
 * 5.53:1 (odlazem); that is allowed only because the label carries the meaning. A glyph
 * that stands alone, with no label, must go white on solid `color` (3.18:1 or better).
 *
 * Razlozi shares ember with the primary action. Never give it a solid ember fill next to
 * "Imam poriv": ember stays the single voice of action.
 */
export const toolColor: Record<ToolKey, { color: string; tint: string }> = {
  disem: { color: palette.toolDisem, tint: palette.toolDisemTint },
  voda: { color: palette.toolVoda, tint: palette.toolVodaTint },
  razlozi: { color: palette.toolRazlozi, tint: palette.toolRazloziTint },
  setam: { color: palette.toolSetam, tint: palette.toolSetamTint },
  odlazem: { color: palette.toolOdlazem, tint: palette.toolOdlazemTint },
  belezim: { color: palette.toolBelezim, tint: palette.toolBelezimTint },
};

export type ProgressKey = 'money' | 'health' | 'time';

/** Napredak colours. `deep` on `tint` is 5.1:1 or better and carries text. */
export const progressColor: Record<ProgressKey, { base: string; deep: string; tint: string }> = {
  money: { base: palette.money, deep: palette.moneyDeep, tint: palette.moneyTint },
  health: { base: palette.health, deep: palette.healthDeep, tint: palette.healthTint },
  time: { base: palette.time, deep: palette.timeDeep, tint: palette.timeTint },
};

/**
 * The six goal categories (docs/M5-brief.md, Ciljevi). Each keeps the colour it already has in
 * the app where it has one: Novac is money green and Zdravlje health rose (M4's screens and the
 * site's Napredak switch), Cigarete the violet of Odbijene cigarete. The export's blue and teal
 * map to Vreme and Porivi, and Provere takes the remaining distinct hue. Ember is no category's
 * colour: it is the one voice of action.
 *
 * `solid` carries white only at large sizes (3.88:1 at its lowest, Vreme); small text on a goal
 * colour goes on a white plate. `tint` carries ink text. `text` is the category's colour for
 * small text on paper, 4.5:1 or better: the deep shade where the site has one, ink where the
 * colour itself falls short (Vreme 3.88:1, Porivi 4.10:1).
 */
export const goalColor = {
  vreme: { solid: palette.toolVoda, tint: palette.toolVodaTint, text: palette.ink },
  novac: { solid: palette.money, tint: palette.moneyTint, text: palette.moneyDeep },
  cigarete: { solid: palette.time, tint: palette.timeTint, text: palette.timeDeep },
  porivi: { solid: palette.toolDisem, tint: palette.toolDisemTint, text: palette.ink },
  provere: { solid: palette.toolOdlazem, tint: palette.toolOdlazemTint, text: palette.toolOdlazem },
  zdravlje: { solid: palette.health, tint: palette.healthTint, text: palette.healthDeep },
} as const;

/** 4pt base. Tight inside a group, generous between groups. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  /** Side gutter for every full-width screen. */
  gutter: 20,
} as const;

/** Corner language from the site: soft cards, rounded-square badges, pill buttons never. */
export const radius = {
  badge: 12,
  control: 16,
  card: 20,
  sheet: 28,
} as const;

/**
 * Minimum touch target. 44pt is Apple's floor, 48dp is Material's; 48 on both keeps
 * one rule and suits a hand that is shaking.
 */
export const minTarget = 48;

/** Lucide stroke, per PRODUCT.md: ~1.9, round joins. */
export const iconStroke = 1.9;

/** Soft, offset shadow. Depth only, never a coloured halo. */
export const elevation = {
  raised: Platform.select({
    ios: {
      shadowColor: palette.ink,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    default: { elevation: 3 },
  }),
} as const;
