'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Card } from '@/components/ui';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

const STUDY_TARGETS = [
  { value: 30, label: '30 minutes', description: 'Light - For busy days' },
  { value: 60, label: '1 hour', description: 'Balanced - Recommended' },
  { value: 90, label: '1.5 hours', description: 'Dedicated - Serious prep' },
  { value: 120, label: '2 hours', description: 'Intensive - Exam mode' },
];

const NOTIFICATION_TIMES = [
  { value: '07:00', label: '7:00 AM', description: 'Morning study session' },
  { value: '19:00', label: '7:00 PM', description: 'Evening study session' },
  { value: '21:00', label: '9:00 PM', description: 'Before bed review' },
];

export default function PreferencesScreen() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [preferences, setPreferences] = useState({
    preferred_language: profile?.preferred_language || 'en',
    daily_study_target_minutes: profile?.daily_study_target_minutes || 60,
    notification_enabled: true,
    notification_time: '19:00',
    theme_mode: 'system' as 'light' | 'dark' | 'system',
  });

  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        preferred_language: preferences.preferred_language,
        daily_study_target_minutes: preferences.daily_study_target_minutes,
      });

      if (error) {
        Alert.alert('Error', 'Failed to save preferences. Please try again.');
      } else {
        router.push('/(onboarding)/goals');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary[500], width: '66%' },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Phase</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.primary[500] }]}>Preferences</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Goals</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Personalize Your Experience</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Choose your language, study target, and notification preferences
          </Text>
        </View>

        {/* Language Selection */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferred Language</Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
            Medical terms will remain in English; explanations can be in your language
          </Text>

          <View style={styles.optionsGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setPreferences(prev => ({ ...prev, preferred_language: lang.code }))}
                style={[
                  styles.optionCard,
                  preferences.preferred_language === lang.code && styles.optionCardSelected,
                  { borderColor: preferences.preferred_language === lang.code ? theme.colors.primary[500] : theme.colors.border },
                ]}
              >
                <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionLabel,
                    { color: preferences.preferred_language === lang.code ? theme.colors.primary[500] : theme.colors.text },
                  ]}>
                    {lang.name}
                  </Text>
                  <Text style={[
                    styles.optionNative,
                    { color: preferences.preferred_language === lang.code ? theme.colors.primary[400] : theme.colors.textTertiary },
                  ]}>
                    {lang.nativeName}
                  </Text>
                </View>
                {preferences.preferred_language === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Daily Study Target */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Study Target</Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
            Set a realistic goal you can maintain consistently
          </Text>

          <View style={styles.optionsGrid}>
            {STUDY_TARGETS.map((target) => (
              <TouchableOpacity
                key={target.value}
                onPress={() => setPreferences(prev => ({ ...prev, daily_study_target_minutes: target.value }))}
                style={[
                  styles.optionCard,
                  preferences.daily_study_target_minutes === target.value && styles.optionCardSelected,
                  { borderColor: preferences.daily_study_target_minutes === target.value ? theme.colors.primary[500] : theme.colors.border },
                ]}
              >
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionLabel,
                    { color: preferences.daily_study_target_minutes === target.value ? theme.colors.primary[500] : theme.colors.text },
                  ]}>
                    {target.label}
                  </Text>
                  <Text style={[
                    styles.optionDesc,
                    { color: preferences.daily_study_target_minutes === target.value ? theme.colors.primary[400] : theme.colors.textTertiary },
                  ]}>
                    {target.description}
                  </Text>
                </View>
                {preferences.daily_study_target_minutes === target.value && (
                  <View style={styles.checkmark}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Theme Preference */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>

          <View style={styles.optionsGrid}>
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setPreferences(prev => ({ ...prev, theme_mode: mode }))}
                style={[
                  styles.optionCard,
                  preferences.theme_mode === mode && styles.optionCardSelected,
                  { borderColor: preferences.theme_mode === mode ? theme.colors.primary[500] : theme.colors.border },
                ]}
              >
                <Text style={{ fontSize: 24 }}>
                  {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '📱'}
                </Text>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionLabel,
                    { color: preferences.theme_mode === mode ? theme.colors.primary[500] : theme.colors.text },
                  ]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                  <Text style={[
                    styles.optionDesc,
                    { color: preferences.theme_mode === mode ? theme.colors.primary[400] : theme.colors.textTertiary },
                  ]}>
                    {mode === 'light' && 'Always light mode'}
                    {mode === 'dark' && 'Always dark mode'}
                    {mode === 'system' && 'Follow system setting'}
                  </Text>
                </View>
                {preferences.theme_mode === mode && (
                  <View style={styles.checkmark}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Notifications */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <View style={styles.toggleRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Study Reminders</Text>
              <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
                Get notified when it's time to study
              </Text>
            </View>
            <Switch
              value={preferences.notification_enabled}
              onValueChange={value => setPreferences(prev => ({ ...prev, notification_enabled: value }))}
              trackColor={{ false: '#E2E8F0', true: theme.colors.primary[500] }}
              thumbColor={preferences.notification_enabled ? theme.colors.primary[500] : '#FFFFFF'}
            />
          </View>

          {preferences.notification_enabled && (
            <View style={styles.timeOptions}>
              <Text style={[styles.subSectionTitle, { color: theme.colors.text }]}>Preferred Time</Text>
              <View style={styles.timeOptionsGrid}>
                {NOTIFICATION_TIMES.map((time) => (
                  <TouchableOpacity
                    key={time.value}
                    onPress={() => setPreferences(prev => ({ ...prev, notification_time: time.value }))}
                    style={[
                      styles.timeOption,
                      preferences.notification_time === time.value && styles.timeOptionSelected,
                      { borderColor: preferences.notification_time === time.value ? theme.colors.primary[500] : theme.colors.border },
                    ]}
                  >
                    <Text style={[
                      styles.timeOptionLabel,
                      { color: preferences.notification_time === time.value ? theme.colors.primary[500] : theme.colors.text },
                    ]}>
                      {time.label}
                    </Text>
                    <Text style={[
                      styles.timeOptionDesc,
                      { color: preferences.notification_time === time.value ? theme.colors.primary[400] : theme.colors.textTertiary },
                    ]}>
                      {time.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Card>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Button
          size="xl"
          fullWidth
          loading={loading || authLoading}
          onPress={handleContinue}
          variant="primary"
        >
          Continue
        </Button>
        <Text style={[styles.skipText, { color: theme.colors.textTertiary }]}>You can change these later in Settings</Text>
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
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  progressContainer: {
    marginBottom: spacing[6],
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typography.caption,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography.headlineMedium,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.bodyMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionCard: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  sectionDesc: {
    ...typography.bodySmall,
    lineHeight: 18,
    marginBottom: spacing[4],
  },
  optionsGrid: {
    gap: spacing[3],
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.sm,
  },
  optionCardSelected: {
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
  },
  optionText: {
    flex: 1,
    gap: spacing[1],
  },
  optionLabel: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  optionNative: {
    ...typography.bodySmall,
  },
  optionDesc: {
    ...typography.caption,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeOptions: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  subSectionTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  timeOptionsGrid: {
    gap: spacing[2],
  },
  timeOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
  },
  timeOptionLabel: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  timeOptionDesc: {
    ...typography.caption,
  },
  bottomSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: spacing[2],
  },
  skipText: {
    ...typography.caption,
    textAlign: 'center',
  },
});