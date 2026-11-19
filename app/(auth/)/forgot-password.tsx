'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Input, Card } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const { resetPassword, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await resetPassword(email.trim());
      if (error) {
        setErrors({ general: error.message || 'Failed to send reset email. Please try again.' });
      } else {
        setSent(true);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={{ fontSize: 24, color: theme.colors.text }}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.success + '20' }]}>
              <Text style={{ fontSize: 48 }}>✅</Text>
            </View>
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>Check Your Email</Text>
            <Text style={[styles.successDesc, { color: theme.colors.textSecondary }]}>
              We've sent a password reset link to <Text style={{ fontWeight: '600', color: theme.colors.text }}>{email}</Text>
            </Text>
            <Text style={[styles.successNote, { color: theme.colors.textTertiary }]}>
              If you don't see it, check your spam folder or try again.
            </Text>

            <Button size="lg" fullWidth variant="primary" onPress={() => router.replace('/(auth)/login')} style={styles.actionButton}>
              Back to Sign In
            </Button>

            <TouchableOpacity onPress={() => setSent(false)} style={styles.resendButton}>
              <Text style={[styles.resendText, { color: theme.colors.primary[500] }]}>Resend Email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

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
          <Text style={[styles.title, { color: theme.colors.text }]}>Forgot Password?</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Enter your email and we'll send you a reset link</Text>
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

            {errors.general && (
              <View style={styles.generalError}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>⚠️ {errors.general}</Text>
              </View>
            )}

            <Button
              size="lg"
              fullWidth
              loading={loading || authLoading}
              onPress={handleSubmit}
              variant="primary"
              style={styles.submitButton}
            >
              Send Reset Link
            </Button>
          </View>
        </Card>

        <View style={styles.helpSection}>
          <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>Remember your password?{' '}</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    textAlign: 'center',
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
  submitButton: {
    marginTop: spacing[2],
  },
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[1],
  },
  helpText: {
    ...typography.bodyMedium,
  },
  linkText: {
    ...typography.bodyMedium,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  successTitle: {
    ...typography.headlineMedium,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  successDesc: {
    ...typography.bodyLarge,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[2],
  },
  successNote: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[6],
  },
  actionButton: {
    marginBottom: spacing[3],
  },
  resendButton: {
    padding: spacing[2],
  },
  resendText: {
    ...typography.labelMedium,
  },
});