'use client';

import React, { forwardRef } from 'react';
import { View, ViewStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface CardProps extends Omit<ViewStyle, 'style'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = forwardRef<View | TouchableOpacity, CardProps>(
  ({ variant = 'default', padding = 'md', onPress, children, style, ...props }, ref) => {
    const { theme, isDark } = useTheme();

    const variantStyles = {
      default: {
        backgroundColor: theme.colors.surface,
        borderWidth: 0,
        borderColor: 'transparent',
        ...theme.shadows.sm,
      },
      elevated: {
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 0,
        borderColor: 'transparent',
        ...theme.shadows.md,
      },
      outlined: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.none,
      },
      filled: {
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 0,
        borderColor: 'transparent',
        ...theme.shadows.none,
      },
    };

    const paddingStyles = {
      none: 0,
      sm: theme.spacing[3],
      md: theme.spacing[4],
      lg: theme.spacing[6],
    };

    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.xl,
      padding: paddingStyles[padding],
      ...variantStyles[variant],
    };

    const Component = onPress ? TouchableOpacity : View;
    const componentProps = onPress
      ? {
          activeOpacity: 0.9,
          onPress,
          ...props,
        }
      : props;

    return (
      <Component ref={ref} style={[baseStyle, style]} {...componentProps}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;