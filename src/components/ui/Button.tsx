'use client';

import React, { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { typography } from '@/theme';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style' | 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const { theme, isDark } = useTheme();

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
        textColor: theme.colors.light.textInverse,
      },
      secondary: {
        backgroundColor: theme.colors.secondary[500],
        borderColor: theme.colors.secondary[500],
        textColor: theme.colors.light.textInverse,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary[500],
        textColor: theme.colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: theme.colors.primary[500],
      },
      danger: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
        textColor: theme.colors.light.textInverse,
      },
    };

    const sizeStyles = {
      sm: {
        paddingVertical: theme.spacing[2],
        paddingHorizontal: theme.spacing[3],
        borderRadius: theme.borderRadius.md,
        fontSize: typography.labelMedium.fontSize,
        iconSize: 16,
        gap: theme.spacing[2],
      },
      md: {
        paddingVertical: theme.spacing[3],
        paddingHorizontal: theme.spacing[4],
        borderRadius: theme.borderRadius.lg,
        fontSize: typography.button.fontSize,
        iconSize: 20,
        gap: theme.spacing[2],
      },
      lg: {
        paddingVertical: theme.spacing[4],
        paddingHorizontal: theme.spacing[6],
        borderRadius: theme.borderRadius.lg,
        fontSize: typography.labelLarge.fontSize,
        iconSize: 22,
        gap: theme.spacing[3],
      },
      xl: {
        paddingVertical: theme.spacing[5],
        paddingHorizontal: theme.spacing[8],
        borderRadius: theme.borderRadius.xl,
        fontSize: typography.titleLarge.fontSize,
        iconSize: 24,
        gap: theme.spacing[3],
      },
    };

    const v = variantStyles[variant];
    const s = sizeStyles[size];
    const isDisabled = disabled || loading;

    const buttonStyle: typeof StyleSheet.flatten = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      backgroundColor: isDisabled ? (variant === 'outline' || variant === 'ghost' ? 'transparent' : theme.colors.neutral[300]) : v.backgroundColor,
      borderWidth: variant === 'outline' ? 2 : 0,
      borderColor: isDisabled ? theme.colors.neutral[300] : v.borderColor,
      paddingVertical: s.paddingVertical,
      paddingHorizontal: s.paddingHorizontal,
      borderRadius: s.borderRadius,
      width: fullWidth ? '100%' : undefined,
      opacity: isDisabled ? 0.6 : 1,
    };

    const textStyle: typeof StyleSheet.flatten = {
      ...typography.button,
      fontSize: s.fontSize,
      color: isDisabled ? theme.colors.neutral[400] : v.textColor,
    };

    return (
      <TouchableOpacity
        ref={ref}
        style={[buttonStyle, style]}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.85}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? v.textColor : theme.colors.light.textInverse}
          />
        ) : (
          <>
            {leftIcon && <View>{leftIcon}</View>}
            <Text style={textStyle}>{children}</Text>
            {rightIcon && <View>{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export default Button;