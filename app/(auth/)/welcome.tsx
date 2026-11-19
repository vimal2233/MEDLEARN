'use client';

import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius } from '@/theme';
import { Button } from '@/components/ui';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo and Brand Section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary[500] }]}>
              <Text style={styles.logoText}>M</Text>
            </View>
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>MedLearn</Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>Learn Smarter. Remember Longer. Become Better.</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Everything You Need to Excel in MBBS</Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Text style={{ fontSize: 24 }}>{feature.icon}</Text>
                </View>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <Text style={[styles.trustTitle, { color: theme.colors.text }]}>Built for Medical Students</Text>
          <Text style={[styles.trustDesc, { color: theme.colors.textSecondary }]}>
            Designed specifically for the Indian MBBS curriculum with micro-learning, spaced repetition, and AI-powered guidance.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <Button size="xl" fullWidth onPress={handleGetStarted} variant="primary">
          Get Started Free
        </Button>
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>Already have an account?</Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        </View>
        <Button size="lg" fullWidth onPress={handleLogin} variant="outline">
          Sign In
        </Button>
        <Text style={[styles.termsText, { color: theme.colors.textTertiary }]}>
          By continuing, you agree to our{' '}
          <Text style={{ color: theme.colors.primary[500], textDecorationLine: 'underline' }}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={{ color: theme.colors.primary[500], textDecorationLine: 'underline' }}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const features = [
  {
    icon: '📚',
    title: 'Structured Curriculum',
    description: 'Complete MBBS syllabus organized by phase, subject, and topic',
    color: '#1A6BB8',
  },
  {
    icon: '🎯',
    title: 'Micro-Learning',
    description: 'Bite-sized 5-10 minute lessons that fit your busy schedule',
    color: '#14C9B0',
  },
  {
    icon: '🧠',
    title: 'Spaced Repetition',
    description: 'Smart flashcards with FSRS algorithm for long-term retention',
    color: '#7C3AED',
  },
  {
    icon: '❓',
    title: 'Question Bank',
    description: 'Thousands of MCQs with detailed explanations and clinical correlations',
    color: '#DC2626',
  },
  {
    icon: '🏥',
    title: 'Clinical Cases',
    description: 'Real-world case simulations to bridge theory and practice',
    color: '#EA580C',
  },
  {
    icon: '🤖',
    title: 'AI Medical Tutor',
    description: '24/7 personalized explanations, mnemonics, and viva practice',
    color: '#A855F7',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  logoContainer: {
    marginBottom: spacing[4],
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  appName: {
    ...typography.displayMedium,
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  tagline: {
    ...typography.bodyLarge,
    textAlign: 'center',
    maxWidth: 300,
  },
  featuresSection: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    ...typography.headlineMedium,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  featuresGrid: {
    gap: spacing[3],
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  featureTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  featureDesc: {
    ...typography.bodySmall,
    lineHeight: 18,
  },
  trustSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius['2xl'],
    ...shadows.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trustTitle: {
    ...typography.titleLarge,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  trustDesc: {
    ...typography.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: spacing[3],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...typography.labelSmall,
    whiteSpace: 'nowrap',
  },
  termsText: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
});

// Import shadows from theme
import { shadows } from '@/theme';

const styles = StyleSheet.create({