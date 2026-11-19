'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Card } from '@/components/ui';

const ACADEMIC_PHASES = [
  {
    id: 'phase1',
    label: 'Phase 1 (1st Year)',
    description: 'Anatomy, Physiology, Biochemistry',
    subjects: ['Anatomy', 'Physiology', 'Biochemistry'],
    color: '#E11D48',
    icon: '🧬',
  },
  {
    id: 'phase2',
    label: 'Phase 2 (2nd Year)',
    description: 'Pathology, Pharmacology, Microbiology, Forensic Medicine',
    subjects: ['Pathology', 'Pharmacology', 'Microbiology', 'Forensic Medicine'],
    color: '#0891B2',
    icon: '🔬',
  },
  {
    id: 'phase3a',
    label: 'Phase 3 Part 1 (3rd Year)',
    description: 'Community Medicine, ENT, Ophthalmology',
    subjects: ['Community Medicine', 'ENT', 'Ophthalmology'],
    color: '#7C3AED',
    icon: '🏥',
  },
  {
    id: 'phase3b',
    label: 'Phase 3 Part 2 (Final Year)',
    description: 'Medicine, Surgery, OBG, Pediatrics, Orthopedics, Psychiatry, Dermatology',
    subjects: ['General Medicine', 'General Surgery', 'OBG', 'Pediatrics', 'Orthopedics', 'Psychiatry', 'Dermatology'],
    color: '#DC2626',
    icon: '🩺',
  },
];

export default function AcademicYearScreen() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedPhase) {
      Alert.alert('Please select your academic phase');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateProfile({
        academic_phase: selectedPhase,
        onboarding_completed: false,
      });

      if (error) {
        Alert.alert('Error', 'Failed to save your selection. Please try again.');
      } else {
        router.push('/(onboarding)/preferences');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const phase = ACADEMIC_PHASES.find(p => p.id === selectedPhase);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary[500], width: '33%' },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: theme.colors.primary[500] }]}>Phase</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Preferences</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Goals</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>What\'s Your Academic Phase?</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            We\'ll personalize your curriculum and study plan based on your year
          </Text>
        </View>

        <View style={styles.phasesGrid}>
          {ACADEMIC_PHASES.map((phaseItem) => (
            <TouchableOpacity
              key={phaseItem.id}
              onPress={() => setSelectedPhase(phaseItem.id)}
              style={[
                styles.phaseCard,
                selectedPhase === phaseItem.id && styles.phaseCardSelected,
                { borderColor: selectedPhase === phaseItem.id ? phaseItem.color : theme.colors.border },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View
                style={[
                  styles.phaseIcon,
                  { backgroundColor: phaseItem.color + '20' },
                  selectedPhase === phaseItem.id && { backgroundColor: phaseItem.color },
                ]}
              >
                <Text style={[
                  styles.phaseIconText,
                  selectedPhase === phaseItem.id && { color: '#FFFFFF' },
                ]}>
                  {phaseItem.icon}
                </Text>
              </View>
              <Text style={[
                styles.phaseLabel,
                { color: selectedPhase === phaseItem.id ? phaseItem.color : theme.colors.text },
              ]}>
                {phaseItem.label}
              </Text>
              <Text style={[
                styles.phaseDesc,
                { color: selectedPhase === phaseItem.id ? phaseItem.color : theme.colors.textSecondary },
              ]}>
                {phaseItem.description}
              </Text>
              <View style={styles.subjectTags}>
                {phaseItem.subjects.slice(0, 3).map((subject, i) => (
                  <View
                    key={i}
                    style={[
                      styles.subjectTag,
                      selectedPhase === phaseItem.id
                        ? { backgroundColor: phaseItem.color + '30', borderColor: phaseItem.color }
                        : {},
                    ]}
                  >
                    <Text style={[
                      styles.subjectTagText,
                      { color: selectedPhase === phaseItem.id ? phaseItem.color : theme.colors.textSecondary },
                    ]}>
                      {subject}
                    </Text>
                  </View>
                ))}
                {phaseItem.subjects.length > 3 && (
                  <View
                    style={[
                      styles.subjectTag,
                      selectedPhase === phaseItem.id
                        ? { backgroundColor: phaseItem.color + '30', borderColor: phaseItem.color }
                        : {},
                    ]}
                  >
                    <Text style={[
                      styles.subjectTagText,
                      { color: selectedPhase === phaseItem.id ? phaseItem.color : theme.colors.textSecondary },
                    ]}>
                      +{phaseItem.subjects.length - 3} more
                    </Text>
                  </View>
                )}
              </View>
              {selectedPhase === phaseItem.id && (
                <View style={styles.checkmark}>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {phase && (
          <Card style={styles.infoCard} variant="filled" padding="md">
            <View style={styles.infoRow}>
              <Text style={{ fontSize: 20 }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: theme.colors.text }]}>Recommended Focus</Text>
                <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                  {phase.id === 'phase1' && 'Build strong foundations in Anatomy, Physiology & Biochemistry. Focus on spatial understanding and basic mechanisms.'}
                  {phase.id === 'phase2' && 'Master disease mechanisms (Pathology), drug actions (Pharmacology), and microorganisms (Microbiology). Clinical correlations are key.'}
                  {phase.id === 'phase3a' && 'Public health (Community Medicine) and specialized clinical subjects. Connect theory to community practice.'}
                  {phase.id === 'phase3b' && 'Integrate everything in major clinical rotations. Prioritize clinical reasoning, case presentations, and exam-oriented revision.'}
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.bottomSection}>
        <Button
          size="xl"
          fullWidth
          loading={loading || authLoading}
          onPress={handleContinue}
          variant="primary"
          disabled={!selectedPhase}
        >
          Continue
        </Button>
        <Text style={[styles.skipText, { color: theme.colors.textTertiary }]}>You can change this later in Settings</Text>
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
  phasesGrid: {
    gap: spacing[3],
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
    borderWidth: 2,
    ...shadows.sm,
    flexDirection: 'row',
    gap: spacing[4],
  },
  phaseCardSelected: {
    borderWidth: 2,
    backgroundColor: '#FAFAFA',
  },
  phaseIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseIconText: {
    fontSize: 24,
  },
  phaseLabel: {
    ...typography.titleMedium,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  phaseDesc: {
    ...typography.bodySmall,
    lineHeight: 18,
    marginBottom: spacing[3],
  },
  subjectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  subjectTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  subjectTagText: {
    ...typography.caption,
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  infoTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  infoDesc: {
    ...typography.bodySmall,
    lineHeight: 18,
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