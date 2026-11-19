'use client';

import React, { forwardRef } from 'react';
import { View, TextInput, TextInputProps, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { typography } from '@/theme';

export interface InputProps extends Omit<TextInputProps, 'style' | 'onChangeText'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChangeText?: (text: string) => void;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onChangeText,
      style,
      disabled,
      placeholder,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const { theme, isDark } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary[500]
      : theme.colors.border;

    const backgroundColor = disabled ? theme.colors.surfaceVariant : theme.colors.surface;

    const handleChangeText = (text: string) => {
      onChangeText?.(text);
    };

    const togglePasswordVisibility = () => {
      if (secureTextEntry) {
        setShowPassword(!showPassword);
      }
    };

    return (
      <View style={style}>
        {label && (
          <Text style={[typography.labelSmall, { color: theme.colors.textSecondary, marginBottom: theme.spacing[1] }]}>
            {label}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor,
            borderWidth: 1,
            borderColor,
            borderRadius: theme.borderRadius.lg,
            paddingHorizontal: theme.spacing[3],
            paddingVertical: theme.spacing[2],
          }}
        >
          {leftIcon && (
            <View style={{ marginRight: theme.spacing[2], color: theme.colors.iconSecondary }}>
              {leftIcon}
            </View>
          )}
          <TextInput
            ref={ref}
            style={{
              flex: 1,
              ...typography.bodyMedium,
              color: theme.colors.text,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.placeholder}
            secureTextEntry={secureTextEntry && !showPassword}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            {...props}
          />
          {secureTextEntry && (
            <View style={{ marginLeft: theme.spacing[2] }}>
              <TouchableOpacity onPress={togglePasswordVisibility} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={{ color: theme.colors.iconSecondary, fontSize: 20 }}>
                  {showPassword ? '👁️' : '🔒'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {rightIcon && !secureTextEntry && (
            <View style={{ marginLeft: theme.spacing[2], color: theme.colors.iconSecondary }}>
              {rightIcon}
            </View>
          )}
        </View>
        {(error || helperText) && (
          <Text
            style={[
              typography.caption,
              { color: error ? theme.colors.error : theme.colors.textTertiary, marginTop: theme.spacing[1] },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

import { TouchableOpacity } from 'react-native';

export default Input;