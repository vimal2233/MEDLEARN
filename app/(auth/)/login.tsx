'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Input, Card } from '@/components/ui';

export default function LoginScreen() {
  const { signIn, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrors({ general: error.message || 'Login failed. Please check your credentials.' });
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={{ fontSize: 24, color: theme.colors.text }}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoSection}>
          <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>MedLearn</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Sign in to continue your learning journey</Text>
        </View>

        <Card style={styles.formCard} variant="outlined" padding="lg">
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              leftIcon={<Text style={{ fontSize: 20 }}>📧</Text>}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
              leftIcon={<Text style={{ fontSize: 20 }}>🔒</Text>}
            />

            {errors.general && (
              <View style={styles.generalError}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>⚠️ {errors.general}</Text>
              </View>
            )}

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotPassword, { color: theme.colors.primary[500] }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Button
              size="lg"
              fullWidth
              loading={loading || authLoading}
              onPress={handleLogin}
              variant="primary"
              style={styles.loginButton}
            >
              Sign In
            </Button>
          </View>
        </Card>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>Or continue with</Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button size="md" fullWidth variant="outlined" onPress={() => Alert.alert('Coming Soon', 'Google Sign-In will be available soon.')}>
            <Text style={{ fontSize: 20, marginRight: spacing[2] }}>G</Text>
            Google
          </Button>
          <Button size="md" fullWidth variant="outlined" onPress={() => Alert.alert('Coming Soon', 'Apple Sign-In will be available soon.')}>
            <Text style={{ fontSize: 20, marginRight: spacing[2] }}>🍎</Text>
            Apple
          </Button>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>Don't have an account?{' '}</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    marginBottom: spacing[2],
  },
  backButton: {
    padding: spacing[1],
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginBottom: spacing[3],
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  appName: {
    ...typography.headlineLarge,
    fontWeight: '700',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography.headlineMedium,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.bodyMedium,
  },
  formCard: {
    marginBottom: spacing[4],
  },
  form: {
    gap: spacing[4],
  },
  generalError: {
    padding: spacing[3],
    backgroundColor: '#FEF2F2',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    ...typography.bodySmall,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: spacing[-2],
  },
  forgotPassword: {
    ...typography.labelMedium,
  },
  loginButton: {
    marginTop: spacing[2],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: spacing[4],
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.labelSmall,
    whiteSpace: 'nowrap',
  },
  socialButtons: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[1],
  },
  bottomText: {
    ...typography.bodyMedium,
  },
  linkText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
});