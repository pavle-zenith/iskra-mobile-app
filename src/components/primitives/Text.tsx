import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { color as colorRoles, textVariants, type ColorRole, type TextVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorRole;
};

const HEADING_VARIANTS: readonly TextVariant[] = ['display', 'title', 'heading'];

/**
 * The only way text reaches the screen. Applies a bundled face, the type ramp, a
 * semantic colour, and a per-variant cap on the system text size.
 *
 * Headline variants announce themselves as headers to VoiceOver and TalkBack, so the
 * rotor can jump between sections.
 */
export function Text({
  variant = 'body',
  color = 'text',
  style,
  maxFontSizeMultiplier,
  accessibilityRole,
  ...rest
}: TextProps) {
  const { maxFontSizeMultiplier: variantMax, ...variantStyle } = textVariants[variant];

  const isHeading = HEADING_VARIANTS.includes(variant);

  return (
    <RNText
      accessibilityRole={accessibilityRole ?? (isHeading ? 'header' : undefined)}
      // Headlines avoid a lone last word: push-out on iOS, balanced lines on Android.
      lineBreakStrategyIOS={isHeading ? 'push-out' : undefined}
      textBreakStrategy={isHeading ? 'balanced' : undefined}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? variantMax}
      style={[variantStyle, { color: colorRoles[color] }, style]}
      {...rest}
    />
  );
}
