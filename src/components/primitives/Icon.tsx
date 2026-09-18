import type { LucideIcon } from 'lucide-react-native';

import { color as colorRoles, iconStroke } from '@/theme';

export type IconProps = {
  /** A Lucide glyph, e.g. `Wind`. Never an icon font, never an emoji. */
  as: LucideIcon;
  size?: number;
  /** Any colour value. Defaults to the text role. */
  color?: string;
};

/**
 * Lucide at the brand stroke (1.9, round joins). Icons are decorative by default:
 * the control around them carries the Serbian accessibility label.
 */
export function Icon({ as: Glyph, size = 24, color = colorRoles.text }: IconProps) {
  return (
    <Glyph
      size={size}
      color={color}
      strokeWidth={iconStroke}
      accessible={false}
      importantForAccessibility="no"
    />
  );
}
