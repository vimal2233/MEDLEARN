'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Card, Input } from '@/components/ui';

const LEARNING_GOALS = [
  { id: 'exam_prep', label: 'Ace University Exams', description: 'Focus on high-yield topics and past papers', icon: '📝', color: '#DC2626' },
  { id: 'concept_mastery', label: 'Deep Concept Understanding', description: 'Build strong foundations for clinical practice', icon: '🧠', color: '#0891B2' },
  { id: 'clinical_skills', label: 'Clinical Reasoning', description: 'Bridge theory with patient case simulations', icon: '🏥', color: '#16A34A' },
  { id: 'viva_prep', label: 'Viva & Practical Exams', description: 'Practice oral questions and spotters', icon: '🎤', color: '#7C3AED' },
  { id: 'competitive_exams', label: 'NEET PG / INI CET Prep', description: 'Long-term preparation for entrance exams', icon: '🎯', color: '#EA580C' },
  { id: 'research', label: 'Research & Publications', description: 'Develop academic writing and research skills', icon: '📊', color: '#A855F7' },
];

const WEAK_AREAS = [
  'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology',
  'Microbiology', 'Forensic Medicine', 'Community Medicine', 'ENT',
  'Ophthalmology', 'General Medicine', 'General Surgery', 'OBG',
  'Pediatrics', 'Orthopedics', 'Psychiatry', 'Dermatology',
];

export default function GoalsScreen() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [selectedGoals, setSelectedGoals] = useState<string[]>(profile?.learning_goals || []);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleWeakArea = (area: string) => {
    setWeakAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !selectedGoals.includes(`custom_${customGoal.trim()}`)) {
      const id = `custom_${customGoal.trim().toLowerCase().replace(/\s+/g, '_')}`;
      setSelectedGoals(prev => [...prev, id]);
      setCustomGoal('');
    }
  };

  const handleComplete = async () => {
    if (selectedGoals.length === 0) {
      Alert.alert('Select at least one goal', 'Choose what you want to achieve with MedLearn');
      return;
    }

    setLoading(true);
    try {
      const { error } = await updateProfile({
        learning_goals: selectedGoals,
        onboarding_completed: true,
      });

      if (error) {
        Alert.alert('Error', 'Failed to save your goals. Please try again.');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary[500], width: '100%' },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Phase</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textTertiary }]}>Preferences</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.primary[500] }]}>Goals</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>What Are Your Goals?</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Select what you want to achieve. This helps us personalize your learning path.
          </Text>
        </View>

        {/* Learning Goals */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Learning Goals</Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
            Choose all that apply (minimum 1)
          </Text>

          <View style={styles.goalsGrid}>
            {LEARNING_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                onPress={() => toggleGoal(goal.id)}
                style={[
                  styles.goalCard,
                  selectedGoals.includes(goal.id) && styles.goalCardSelected,
                  { borderColor: selectedGoals.includes(goal.id) ? goal.color : theme.colors.border },
                ]}
              >
                <View
                  style={[
                    styles.goalIcon,
                    { backgroundColor: selectedGoals.includes(goal.id) ? goal.color : goal.color + '20' },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>{goal.icon}</Text>
                </View>
                <View style={styles.goalText}>
                  <Text style={[
                    styles.goalLabel,
                    { color: selectedGoals.includes(goal.id) ? goal.color : theme.colors.text },
                  ]}>
                    {goal.label}
                  </Text>
                  <Text style={[
                    styles.goalDesc,
                    { color: selectedGoals.includes(goal.id) ? goal.color : theme.colors.textSecondary },
                  ]}>
                    {goal.description}
                  </Text>
                </View>
                {selectedGoals.includes(goal.id) && (
                  <View style={styles.checkmark}>
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Goal Input */}
          <View style={styles.customGoalContainer}>
            <View style={styles.customGoalInput}>
              <Input
                placeholder="Add a custom goal..."
                value={customGoal}
                onChangeText={setCustomGoal}
                leftIcon={<Text style={{ fontSize: 20 }}>✨</Text>}
                style={styles.customInput}
              />
              <TouchableOpacity onPress={addCustomGoal} disabled={!customGoal.trim()} style={styles.addButton}>
                <Text style={[styles.addButtonText, { color: customGoal.trim() ? '#FFFFFF' : theme.colors.textTertiary }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedGoals.filter(g => g.startsWith('custom_')).length > 0 && (
            <View style={styles.customGoalsList}>
              {selectedGoals.filter(g => g.startsWith('custom_')).map((goal, i) => (
                <View key={i} style={styles.customGoalChip}>
                  <Text style={styles.customGoalChipText}>{goal.replace('custom_', '').replace(/_/g, ' ')}</Text>
                  <TouchableOpacity onPress={() => setSelectedGoals(prev => prev.filter(g => g !== goal))} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                    <Text style={{ color: theme.colors.textTertiary, fontSize: 16 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Card>

        {/* Weak Areas */}
        <Card style={styles.sectionCard} variant="outlined" padding="lg">
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Areas to Strengthen (Optional)</Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.textSecondary }]}>
            Select subjects you find challenging. We\'ll prioritize these in your study plan.
          </Text>

          <View style={styles.weakAreasGrid}>
            {WEAK_AREAS.map((area) => (
              <TouchableOpacity
                key={area}
                onPress={() => toggleWeakArea(area)}
                style={[
                  styles.weakAreaChip,
                  weakAreas.includes(area) && styles.weakAreaChipSelected,
                  { backgroundColor: weakAreas.includes(area) ? theme.colors.primary[500] : theme.colors.surfaceVariant },
                  { borderColor: weakAreas.includes(area) ? theme.colors.primary[500] : theme.colors.border },
                ]}
              >
                <Text style={[
                  styles.weakAreaChipText,
                  { color: weakAreas.includes(area) ? '#FFFFFF' : theme.colors.text },
                ]}>
                  {area}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Summary */}
        <Card style={styles.summaryCard} variant="filled" padding="lg">
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Your Learning Profile</Text>
          <View style={styles.summaryItems}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Academic Phase</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {profile?.academic_phase?.replace('phase1', 'Phase 1 (1st Year)')
                  .replace('phase2', 'Phase 2 (2nd Year)')
                  .replace('phase3a', 'Phase 3 Part 1 (3rd Year)')
                  .replace('phase3b', 'Phase 3 Part 2 (Final Year)') || 'Not set'}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Goals Selected</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Weak Areas</Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{weakAreas.length} subject{weakAreas.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <View style={styles.bottomSection}>
        <Button
          size="xl"
          fullWidth
          loading={loading || authLoading}
          onPress={handleComplete}
          variant="primary"
        >
          Complete Setup
        </Button>
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
  goalsGrid: {
    gap: spacing[3],
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.sm,
  },
  goalCardSelected: {
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalText: {
    flex: 1,
    gap: spacing[1],
  },
  goalLabel: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  goalDesc: {
    ...typography.bodySmall,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customGoalContainer: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  customGoalInput: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  customGoalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  customGoalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: theme.colors.primary[500] + '20',
    borderColor: theme.colors.primary[500],
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  customGoalChipText: {
    ...typography.caption,
    fontWeight: '500',
    color: theme.colors.primary[500],
  },
  weakAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  weakAreaChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  weakAreaChipSelected: {
    borderWidth: 1,
  },
  weakAreaChipText: {
    ...typography.labelSmall,
    fontWeight: '500',
  },
  summaryCard: {
    marginBottom: spacing[4],
  },
  summaryTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
    marginBottom: spacing[4],
  },
  summaryItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing[1],
  },
  summaryLabel: {
    ...typography.caption,
  },
  summaryValue: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});