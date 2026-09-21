import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { color, radius, space } from '@/theme';

import { Icon } from './Icon';
import { Pressable, rippleOnColor, type PressableProps } from './Pressable';
import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  /** `onField` is the white button that sits on an ember ground, with an ember label. */
  variant?: 'primary' | 'secondary' | 'onField';
  icon?: LucideIcon;
};

/**
 * Full-width action. Primary is ember with a 19pt bold white label: that size is what
 * makes white on ember (3.18:1) pass as WCAG large text. Do not shrink it.
 *
 * On an ember ground the button inverts, as on the website: white plate, ember label, which
 * measures 3.18:1 the other way round and is read at the same 19pt bold.
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
  const onField = variant === 'onField';
  const foreground = primary ? color.onAccent : onField ? color.accent : color.text;

  return (
    <Pressable
      haptic="light"
      accessibilityLabel={accessibilityLabel ?? label}
      rippleColor={primary ? rippleOnColor : undefined}
      style={[
        styles.base,
        primary ? styles.primary : onField ? styles.onField : styles.secondary,
        style,
      ]}
      pressedStyle={
        primary ? styles.primaryPressed : onField ? styles.onFieldPressed : styles.secondaryPressed
      }
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
  onField: {
    backgroundColor: color.fieldPlate,
  },
  onFieldPressed: {
    backgroundColor: color.accentTint,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs + 2,
  },
});
