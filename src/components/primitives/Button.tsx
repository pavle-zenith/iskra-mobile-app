import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme';

import { Icon } from './Icon';
import { Pressable, rippleOnColor, type PressableProps } from './Pressable';
import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
};

/**
 * Full-width action. Primary is ember with a 19pt bold white label: that size is what
 * makes white on ember (3.18:1) pass as WCAG large text. Do not shrink it.
 */
export function Button({
  label,
  variant = 'primary',
  icon,
  style,
  accessibilityLabel,
  ...rest
}: ButtonProps) {
  const primary = variant === 'primary';
  const foreground = primary ? color.onAccent : color.text;

  return (
    <Pressable
      haptic="light"
      accessibilityLabel={accessibilityLabel ?? label}
      rippleColor={primary ? rippleOnColor : undefined}
      style={[styles.base, primary ? styles.primary : styles.secondary, style]}
      pressedStyle={primary ? styles.primaryPressed : styles.secondaryPressed}
      {...rest}
    >
      <View style={styles.content}>
        {icon ? <Icon as={icon} size={22} color={foreground} /> : null}
        <Text variant="action" style={{ color: foreground }}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 60,
    borderRadius: radius.control,
    paddingHorizontal: space.lg,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: color.accent,
  },
  primaryPressed: {
    backgroundColor: color.accentPressed,
  },
  secondary: {
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.line,
  },
  secondaryPressed: {
    backgroundColor: color.well,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs + 2,
  },
});
