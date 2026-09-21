import type { TextStyle } from 'react-native';

/**
 * Fonts are embedded at build time by the expo-font config plugin (app.json), so they
 * exist before the first frame, offline, with no loading state.
 *
 * Each file is named after its PostScript name. Android resolves `fontFamily` by file
 * name and iOS by PostScript name, so one string works on both. Never pair these with
 * `fontWeight`: the weight lives in the file, and Android would synthesise a fake bold
 * on top of it.
 *
 * All four files are the static Google Fonts builds and carry latin-ext
 * (š č ž ć đ and „ “ quotes), verified against each cmap.
 */
export const fontFamily = {
  display: 'HostGrotesk-SemiBold',
  body: 'Manrope-Medium',
  bodySemiBold: 'Manrope-SemiBold',
  bodyBold: 'Manrope-Bold',
} as const;

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'bodyLarge'
  | 'body'
  | 'bodyStrong'
  | 'tile'
  | 'label'
  | 'action'
  | 'caption';

type VariantSpec = TextStyle & {
  /** Cap for the user's system text size. Body text may double; display type may not. */
  maxFontSizeMultiplier: number;
};

/**
 * The type ramp, in points. Host Grotesk for headlines only; Manrope for everything a
 * person reads or taps.
 *
 * Display line heights stay at ~1.15 or looser: capitals with a caron (Š, Č, Ž) need
 * the headroom, and "Šta" opens the M0 acceptance string.
 */
export const textVariants: Record<TextVariant, VariantSpec> = {
  display: {
    fontFamily: fontFamily.display,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.8,
    maxFontSizeMultiplier: 1.3,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 33,
    letterSpacing: -0.4,
    maxFontSizeMultiplier: 1.4,
  },
  /**
   * 24pt is the smallest size where ember text on paper (3.1:1) passes as WCAG large
   * text, so the site's two-tone headline (ink line, ember line) works at this size.
   */
  heading: {
    fontFamily: fontFamily.display,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.3,
    maxFontSizeMultiplier: 1.5,
  },
  bodyLarge: {
    fontFamily: fontFamily.body,
    fontSize: 19,
    lineHeight: 28,
    maxFontSizeMultiplier: 2,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 17,
    lineHeight: 25,
    maxFontSizeMultiplier: 2,
  },
  bodyStrong: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 17,
    lineHeight: 25,
    maxFontSizeMultiplier: 2,
  },
  /**
   * The centred label under a glyph in a tile: the reasons, fears and triggers grids. Smaller
   * than `label` because it sits under an icon that already carries half the meaning, and
   * because a Serbian option can run to three words ("Dosada i čekanje").
   */
  tile: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
    maxFontSizeMultiplier: 1.6,
  },
  /** Icon-plus-one-word labels. The Poriv tools are read at a glance, not studied. */
  label: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 17,
    lineHeight: 22,
    maxFontSizeMultiplier: 1.6,
  },
  /**
   * Button labels. 19pt bold is WCAG "large text", which is what lets white sit on
   * ember (3.18:1). Do not shrink an ember button's label below this.
   */
  action: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 19,
    lineHeight: 24,
    maxFontSizeMultiplier: 1.5,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 19,
    maxFontSizeMultiplier: 2,
  },
};
