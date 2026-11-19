'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Alert, Picker } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Input, Card } from '@/components/ui';

const ACADEMIC_PHASES = [
  { label: 'Phase 1 (1st Year)', value: 'phase1' },
  { label: 'Phase 2 (2nd Year)', value: 'phase2' },
  { label: 'Phase 3 Part 1 (3rd Year)', value: 'phase3a' },
  { label: 'Phase 3 Part 2 (Final Year)', value: 'phase3b' },
];

export default function RegisterScreen() {
  const { signUp, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicPhase: '',
    institution: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.academicPhase) {
      newErrors.academicPhase = 'Please select your academic phase';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(formData.email.trim(), formData.password, {
        full_name: formData.fullName.trim(),
        academic_phase: formData.academicPhase,
        institution: formData.institution.trim() || null,
      });

      if (error) {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      } else {
        Alert.alert(
          'Account Created!',
          'Please check your email to verify your account, then sign in to continue.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          <Text style={[styles.title, { color: theme.colors.text }]}>Create Your Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Join thousands of MBBS students learning smarter</Text>
        </View>

        <Card style={styles.formCard} variant="outlined" padding="lg">
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Dr. Arjun Sharma"
              value={formData.fullName}
              onChangeText={value => updateField('fullName', value)}
              error={errors.fullName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              leftIcon={<Text style={{ fontSize: 20 }}>👤</Text>}
            />

            <Input
              label="Email"
              placeholder="you@medcollege.edu"
              value={formData.email}
              onChangeText={value => updateField('email', value)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              leftIcon={<Text style={{ fontSize: 20 }}>📧</Text>}
            />

            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: theme.colors.textSecondary }]}>Academic Phase *</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.academicPhase}
                  onValueChange={value => updateField('academicPhase', value)}
                  style={styles.picker}
                  mode="dropdown"
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Select your academic phase" value="" />
                  {ACADEMIC_PHASES.map(phase => (
                    <Picker.Item key={phase.value} label={phase.label} value={phase.value} />
                  ))}
                </Picker>
                {errors.academicPhase && (
                  <Text style={[styles.pickerError, { color: theme.colors.error }]}>{errors.academicPhase}</Text>
                )}
              </View>
            </View>

            <Input
              label="Institution (Optional)"
              placeholder="AIIMS, PGIMER, MAMC, etc."
              value={formData.institution}
              onChangeText={value => updateField('institution', value)}
              autoCapitalize="words"
              leftIcon={<Text style={{ fontSize: 20 }}>🏫</Text>}
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={value => updateField('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              leftIcon={<Text style={{ fontSize: 20 }}>🔒</Text>}
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={value => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              leftIcon={<Text style={{ fontSize: 20 }}>🔒</Text>}
            )

            {errors.general && (
              <View style={styles.generalError}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>⚠️ {errors.general}</Text>
              </View>
            )}

            <Button
              size="lg"
              fullWidth
              loading={loading || authLoading}
              onPress={handleRegister}
              variant="primary"
              style={styles.registerButton}
            >
              Create Account
            </Button>
          </View>
        </Card>

        <View style={styles.passwordHint}>
          <Text style={[styles.hintTitle, { color: theme.colors.text }]}>Password Requirements:</Text>
          <View style={styles.hintList}>
            {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((req, i) => (
              <Text key={i} style={[styles.hintItem, { color: theme.colors.textSecondary }]}>• {req}</Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Text style={[styles.bottomText, { color: theme.colors.textSecondary }]}>Already have an account?{' '}</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.linkText, { color: theme.colors.primary[500] }]}>Sign In</Text>
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
  pickerContainer: {
    gap: spacing[1],
  },
  pickerLabel: {
    ...typography.labelMedium,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: borderRadius.lg,
  },
  picker: {
    ...typography.bodyMedium,
    color: theme.colors.text,
    height: 50,
  },
  pickerItem: {
    ...typography.bodyMedium,
    color: theme.colors.text,
  },
  pickerError: {
    ...typography.caption,
    marginTop: spacing[1],
    marginLeft: spacing[1],
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
  registerButton: {
    marginTop: spacing[2],
  },
  passwordHint: {
    padding: spacing[4],
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  hintTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  hintList: {
    gap: spacing[1],
  },
  hintItem: {
    ...typography.bodySmall,
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