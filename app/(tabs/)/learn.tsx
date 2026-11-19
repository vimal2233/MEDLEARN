'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/ui';
import { Ionicons, MaterialCommunityIcons, AntDesign, Feather, Entypo } from '@expo/vector-icons';

const SUBJECTS = [
  { id: 'anatomy', name: 'Anatomy', icon: 'dna', color: '#E11D48', progress: 45, topics: 120, phase: 'Phase 1' },
  { id: 'physiology', name: 'Physiology', icon: 'heart-pulse', color: '#0891B2', progress: 38, topics: 95, phase: 'Phase 1' },
  { id: 'biochemistry', name: 'Biochemistry', icon: 'flask-conical', color: '#7C3AED', progress: 25, topics: 80, phase: 'Phase 1' },
  { id: 'pathology', name: 'Pathology', icon: 'virus', color: '#DC2626', progress: 15, topics: 150, phase: 'Phase 2' },
  { id: 'pharmacology', name: 'Pharmacology', icon: 'pill', color: '#EA580C', progress: 10, topics: 130, phase: 'Phase 2' },
  { id: 'microbiology', name: 'Microbiology', icon: 'bacteria', color: '#16A34A', progress: 5, topics: 110, phase: 'Phase 2' },
  { id: 'forensic', name: 'Forensic Medicine', icon: 'scale-balance', color: '#4338CA', progress: 0, topics: 60, phase: 'Phase 2' },
  { id: 'community', name: 'Community Medicine', icon: 'earth', color: '#059669', progress: 0, topics: 90, phase: 'Phase 3a' },
  { id: 'ent', name: 'ENT', icon: 'ear-hearing', color: '#D97706', progress: 0, topics: 50, phase: 'Phase 3a' },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: 'eye', color: '#0284C7', progress: 0, topics: 45, phase: 'Phase 3a' },
  { id: 'medicine', name: 'General Medicine', icon: 'stethoscope', color: '#BE185D', progress: 0, topics: 200, phase: 'Phase 3b' },
  { id: 'surgery', name: 'General Surgery', icon: 'scalpel', color: '#C2410C', progress: 0, topics: 180, phase: 'Phase 3b' },
  { id: 'obg', name: 'OBG', icon: 'baby', color: '#DB2777', progress: 0, topics: 120, phase: 'Phase 3b' },
  { id: 'pediatrics', name: 'Pediatrics', icon: 'child', color: '#F97316', progress: 0, topics: 100, phase: 'Phase 3b' },
  { id: 'orthopedics', name: 'Orthopedics', icon: 'bone', color: '#65A30D', progress: 0, topics: 80, phase: 'Phase 3b' },
  { id: 'psychiatry', name: 'Psychiatry', icon: 'brain', color: '#A855F7', progress: 0, topics: 50, phase: 'Phase 3b' },
  { id: 'dermatology', name: 'Dermatology', icon: 'skin', color: '#EC4899', progress: 0, topics: 40, phase: 'Phase 3b' },
];

const PHASES = [
  { id: 'phase1', name: 'Phase 1', year: '1st Year', subjects: ['anatomy', 'physiology', 'biochemistry'], color: '#E11D48' },
  { id: 'phase2', name: 'Phase 2', year: '2nd Year', subjects: ['pathology', 'pharmacology', 'microbiology', 'forensic'], color: '#0891B2' },
  { id: 'phase3a', name: 'Phase 3 Part 1', year: '3rd Year', subjects: ['community', 'ent', 'ophthalmology'], color: '#7C3AED' },
  { id: 'phase3b', name: 'Phase 3 Part 2', year: 'Final Year', subjects: ['medicine', 'surgery', 'obg', 'pediatrics', 'orthopedics', 'psychiatry', 'dermatology'], color: '#DC2626' },
];

export default function LearnScreen() {
  const { profile } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const userPhase = profile?.academic_phase || 'phase1';
  const currentPhase = PHASES.find(p => p.id === userPhase) || PHASES[0];
  const phaseSubjects = SUBJECTS.filter(s => currentPhase.subjects.includes(s.id));
  const otherSubjects = SUBJECTS.filter(s => !currentPhase.subjects.includes(s.id));

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      'dna': <Ionicons name="dna" size={24} color="#FFFFFF" />,
      'heart-pulse': <Ionicons name="pulse" size={24} color="#FFFFFF" />,
      'flask-conical': <Ionicons name="flask" size={24} color="#FFFFFF" />,
      'virus': <Ionicons name="bug" size={24} color="#FFFFFF" />,
      'pill': <Ionicons name="medkit" size={24} color="#FFFFFF" />,
      'bacteria': <MaterialCommunityIcons name="bacteria" size={24} color="#FFFFFF" />,
      'scale-balance': <Feather name="scale" size={24} color="#FFFFFF" />,
      'earth': <Ionicons name="earth" size={24} color="#FFFFFF" />,
      'ear-hearing': <MaterialCommunityIcons name="ear-hearing" size={24} color="#FFFFFF" />,
      'eye': <Ionicons name="eye" size={24} color="#FFFFFF" />,
      'stethoscope': <Ionicons name="stethoscope" size={24} color="#FFFFFF" />,
      'scalpel': <MaterialCommunityIcons name="scalpel" size={24} color="#FFFFFF" />,
      'baby': <Entypo name="baby" size={24} color="#FFFFFF" />,
      'child': <Entypo name="child" size={24} color="#FFFFFF" />,
      'bone': <MaterialCommunityIcons name="bone" size={24} color="#FFFFFF" />,
      'brain': <Ionicons name="construct" size={24} color="#FFFFFF" />,
      'skin': <MaterialCommunityIcons name="skin" size={24} color="#FFFFFF" />,
    };
    return icons[iconName] || <Ionicons name="book" size={24} color="#FFFFFF" />;
  };

  const handleSubjectPress = (subjectId: string) => {
    router.push(`/subjects/${subjectId}`);
  };

  const renderSubjectCard = (subject: typeof SUBJECTS[0]) => (
    <TouchableOpacity
      key={subject.id}
      onPress={() => handleSubjectPress(subject.id)}
      style={styles.subjectCard}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
        {getIconComponent(subject.icon)}
      </View>
      <View style={styles.subjectInfo}>
        <Text style={[styles.subjectName, { color: theme.colors.text }]}>{subject.name}</Text>
        <View style={styles.subjectMeta}>
          <Text style={[styles.subjectPhase, { color: theme.colors.textTertiary }]}>{subject.phase}</Text>
          <Text style={[styles.subjectDivider, { color: theme.colors.border }]}>•</Text>
          <Text style={[styles.subjectTopics, { color: theme.colors.textTertiary }]}>{subject.topics} topics</Text>
        </View>
      </View>
      <View style={styles.subjectProgress}>
        <View style={styles.subjectProgressBar}>
          <View
            style={[
              styles.subjectProgressFill,
              { backgroundColor: subject.color, width: `${subject.progress}%` },
            ]}
          />
        </View>
        <Text style={[styles.subjectProgressText, { color: subject.progress > 0 ? subject.color : theme.colors.textTertiary }]}>
          {subject.progress}%{subject.progress > 0 ? ' Complete' : ' Not Started'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Learn</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Your MBBS Curriculum</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/search')} style={styles.searchButton}>
            <Ionicons name="search" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Current Phase */}
        <View style={styles.phaseHeader}>
          <View style={[styles.phaseBadge, { backgroundColor: currentPhase.color + '20' }]}>
            <Text style={[styles.phaseBadgeText, { color: currentPhase.color }]}>{currentPhase.name}</Text>
          </View>
          <View style={styles.phaseInfo}>
            <Text style={[styles.phaseName, { color: theme.colors.text }]}>{currentPhase.name}</Text>
            <Text style={[styles.phaseYear, { color: theme.colors.textSecondary }]}>{currentPhase.year} MBBS</Text>
          </View>
          <View style={[styles.phaseProgress, { backgroundColor: currentPhase.color + '20' }]}>
            <Text style={[styles.phaseProgressText, { color: currentPhase.color }]}>
              {Math.round(phaseSubjects.reduce((a, b) => a + b.progress, 0) / phaseSubjects.length)}% Complete
            </Text>
          </View>
        </View>

        {/* Phase Subjects */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Subjects</Text>
        <View style={styles.subjectsList}>
          {phaseSubjects.map(renderSubjectCard)}
        </View>

        {/* All Subjects by Phase */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>All Phases</Text>

        {PHASES.map((phase) => (
          <View key={phase.id} style={styles.phaseSection}>
            <View style={styles.phaseSectionHeader}>
              <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
              <Text style={[styles.phaseSectionTitle, { color: theme.colors.text }]}>{phase.name}</Text>
              <Text style={[styles.phaseSectionYear, { color: theme.colors.textTertiary }]}>{phase.year}</Text>
            </View>
            <View style={styles.subjectsGrid}>
              {SUBJECTS.filter(s => phase.subjects.includes(s.id)).map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  onPress={() => handleSubjectPress(subject.id)}
                  style={[
                    styles.compactSubjectCard,
                    subject.progress > 0 && styles.compactSubjectCardActive,
                    { borderColor: subject.progress > 0 ? subject.color : theme.colors.border },
                  ]}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <View style={[styles.compactSubjectIcon, { backgroundColor: subject.color }]}>
                    {getIconComponent(subject.icon)}
                  </View>
                  <Text style={[
                    styles.compactSubjectName,
                    { color: subject.progress > 0 ? subject.color : theme.colors.text },
                  ]}>
                    {subject.name}
                  </Text>
                  {subject.progress > 0 && (
                    <Text style={[styles.compactSubjectProgress, { color: subject.color }]}>{subject.progress}%</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
    gap: spacing[5],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineLarge,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    marginTop: spacing[1],
  },
  searchButton: {
    padding: spacing[2],
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  phaseBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  phaseBadgeText: {
    ...typography.labelSmall,
    fontWeight: '700',
  },
  phaseInfo: {
    flex: 1,
    gap: spacing[1],
  },
  phaseName: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  phaseYear: {
    ...typography.bodySmall,
  },
  phaseProgress: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  phaseProgressText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
    marginTop: spacing[2],
  },
  subjectsList: {
    gap: spacing[3],
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  subjectIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectInfo: {
    flex: 1,
    gap: spacing[1],
  },
  subjectName: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  subjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  subjectPhase: {
    ...typography.caption,
    fontWeight: '500',
  },
  subjectDivider: {
    ...typography.caption,
  },
  subjectTopics: {
    ...typography.caption,
  },
  subjectProgress: {
    width: 100,
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  subjectProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectProgressText: {
    ...typography.caption,
    fontWeight: '500',
  },
  phaseSection: {
    marginTop: spacing[2],
  },
  phaseSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseSectionTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
    flex: 1,
  },
  phaseSectionYear: {
    ...typography.caption,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  compactSubjectCard: {
    width: (390 - spacing[5] * 2 - spacing[3] * 2) / 3,
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    ...shadows.sm,
  },
  compactSubjectCardActive: {
    backgroundColor: '#FAFAFA',
  },
  compactSubjectIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  compactSubjectName: {
    ...typography.caption,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  compactSubjectProgress: {
    ...typography.caption,
    fontWeight: '700',
    marginTop: spacing[1],
  },
  bottomSpacer: {
    height: 100,
  },
});