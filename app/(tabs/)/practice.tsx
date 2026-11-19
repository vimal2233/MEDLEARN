'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Card, Button } from '@/components/ui';
import { Ionicons, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';

const QUIZ_TYPES = [
  { id: 'topic', label: 'Topic Quiz', desc: 'Focused practice on a specific topic', icon: 'target', color: '#1A6BB8', xp: 50 },
  { id: 'chapter', label: 'Chapter Quiz', desc: 'Comprehensive chapter review', icon: 'book-open', color: '#14C9B0', xp: 150 },
  { id: 'subject', label: 'Subject Quiz', desc: 'Full subject mock test', icon: 'layers', color: '#7C3AED', xp: 300 },
  { id: 'mixed', label: 'Mixed Practice', desc: 'Random questions across subjects', icon: 'shuffle', color: '#EA580C', xp: 100 },
  { id: 'timed', label: 'Timed Exam', desc: 'Simulated exam conditions', icon: 'timer', color: '#DC2626', xp: 500 },
  { id: 'revision', label: 'Revision Quiz', desc: 'Spaced repetition based review', icon: 'refresh', color: '#16A34A', xp: 75 },
];

const RECENT_ATTEMPTS = [
  { id: 1, type: 'chapter', subject: 'Anatomy', topic: 'Upper Limb', score: 85, total: 20, date: '2 hours ago', xp: 127 },
  { id: 2, type: 'topic', subject: 'Physiology', topic: 'Cardiac Cycle', score: 70, total: 10, date: '1 day ago', xp: 35 },
  { id: 3, type: 'mixed', subject: 'Mixed', topic: 'Phase 1 Subjects', score: 65, total: 25, date: '3 days ago', xp: 65 },
  { id: 4, type: 'subject', subject: 'Biochemistry', topic: 'Full Mock', score: 78, total: 50, date: '1 week ago', xp: 234 },
];

const STATS = [
  { label: 'Total Attempts', value: '127', icon: 'quiz', color: '#1A6BB8' },
  { label: 'Accuracy', value: '73%', icon: 'target', color: '#14C9B0' },
  { label: 'Avg Score', value: '71%', icon: 'trending-up', color: '#7C3AED' },
  { label: 'Study Time', value: '18h 42m', icon: 'timer', color: '#EA580C' },
];

export default function PracticeScreen() {
  const { profile } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const handleQuizType = (type: string) => {
    router.push(`/practice/${type}`);
  };

  const handleAttempt = (attempt: typeof RECENT_ATTEMPTS[0]) => {
    router.push(`/practice/result/${attempt.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Practice</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Test your knowledge</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/practice/history')} style={styles.historyButton}>
            <Ionicons name="time" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          {STATS.map((stat, index) => (
            <Card key={index} style={styles.statCard} variant="elevated" padding="md">
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={22} color={stat.color} />
                </View>
                <View style={styles.statText}>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Quiz Types */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quiz Types</Text>
        </View>

        <View style={styles.quizTypesGrid}>
          {QUIZ_TYPES.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              onPress={() => handleQuizType(quiz.id)}
              style={styles.quizTypeCard}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.quizTypeIcon, { backgroundColor: quiz.color + '20' }]}>
                <Ionicons name={quiz.icon} size={26} color={quiz.color} />
              </View>
              <View style={styles.quizTypeText}>
                <Text style={[styles.quizTypeLabel, { color: theme.colors.text }]}>{quiz.label}</Text>
                <Text style={[styles.quizTypeDesc, { color: theme.colors.textSecondary }]}>{quiz.desc}</Text>
              </View>
              <View style={styles.quizTypeXP}>
                <Text style={[styles.xpText, { color: quiz.color }]}>+{quiz.xp} XP</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Start - Based on current subject */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Start</Text>
          <TouchableOpacity onPress={() => router.push('/practice/topic?subject=anatomy')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickStartList}>
          {[
            { subject: 'Anatomy', topic: 'Brachial Plexus', questions: 15, color: '#E11D48' },
            { subject: 'Physiology', topic: 'Cardiac Cycle', questions: 12, color: '#0891B2' },
            { subject: 'Biochemistry', topic: 'Glycolysis', questions: 10, color: '#7C3AED' },
          ].map((item, index) => (
            <Card key={index} style={styles.quickStartCard} variant="outlined" padding="md">
              <View style={styles.quickStartContent}>
                <View style={styles.quickStartSubject}>
                  <View style={[styles.subjectDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.quickStartSubjectText, { color: theme.colors.text }]}>{item.subject}</Text>
                </View>
                <Text style={[styles.quickStartTopic, { color: theme.colors.textSecondary }]}>{item.topic}</Text>
                <View style={styles.quickStartMeta}>
                  <Text style={[styles.quickStartQuestions, { color: theme.colors.textTertiary }]}>{item.questions} Questions</Text>
                  <Text style={[styles.quickStartTime, { color: theme.colors.textTertiary }]}>~{Math.ceil(item.questions * 0.8)} min</Text>
                </View>
              </View>
              <Button size="sm" variant="primary" onPress={() => router.push(`/practice/topic?subject=${item.subject.toLowerCase()}&topic=${item.topic.toLowerCase().replace(' ', '-')}`)}>
                Start
              </Button>
            </Card>
          ))}
        </View>

        {/* Recent Attempts */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Attempts</Text>
          <TouchableOpacity onPress={() => router.push('/practice/history')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attemptsList}>
          {RECENT_ATTEMPTS.map((attempt) => (
            <TouchableOpacity
              key={attempt.id}
              onPress={() => handleAttempt(attempt)}
              style={styles.attemptCard}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.attemptHeader}>
                <View style={styles.attemptSubject}>
                  <View style={[styles.subjectDot, { backgroundColor: attempt.score >= 70 ? theme.colors.success : attempt.score >= 50 ? theme.colors.warning : theme.colors.error }]} />
                  <Text style={[styles.attemptSubjectText, { color: theme.colors.text }]}>{attempt.subject}</Text>
                </View>
                <View style={styles.attemptScore}>
                  <Text style={[
                    styles.attemptScoreValue,
                    { color: attempt.score >= 70 ? theme.colors.success : attempt.score >= 50 ? theme.colors.warning : theme.colors.error },
                  ]}>
                    {attempt.score}%
                  </Text>
                  <Text style={[styles.attemptScoreDetail, { color: theme.colors.textTertiary }]}>{attempt.score * attempt.total / 100}/{attempt.total}</Text>
                </View>
              </View>
              <View style={styles.attemptDetails}>
                <Text style={[styles.attemptTopic, { color: theme.colors.textSecondary }]}>{attempt.topic}</Text>
                <View style={styles.attemptMeta}>
                  <Text style={[styles.attemptDate, { color: theme.colors.textTertiary }]}>{attempt.date}</Text>
                  <Text style={[styles.attemptXP, { color: theme.colors.accent[500] }]}>+{attempt.xp} XP</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  historyButton: {
    padding: spacing[2],
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    minWidth: 0,
  },
  statContent: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    ...typography.headlineSmall,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  sectionTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  seeAll: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  quizTypesGrid: {
    gap: spacing[3],
  },
  quizTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  quizTypeIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizTypeText: {
    flex: 1,
    gap: spacing[1],
  },
  quizTypeLabel: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  quizTypeDesc: {
    ...typography.bodySmall,
  },
  quizTypeXP: {
    marginLeft: spacing[2],
  },
  xpText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  quickStartList: {
    gap: spacing[3],
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  quickStartContent: {
    flex: 1,
    gap: spacing[1],
  },
  quickStartSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickStartSubjectText: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  quickStartTopic: {
    ...typography.bodyMedium,
  },
  quickStartMeta: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  quickStartQuestions: {
    ...typography.caption,
  },
  quickStartTime: {
    ...typography.caption,
  },
  attemptsList: {
    gap: spacing[2],
  },
  attemptCard: {
    padding: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  attemptSubject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  attemptSubjectText: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  attemptScore: {
    alignItems: 'flex-end',
  },
  attemptScoreValue: {
    ...typography.headlineSmall,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  attemptScoreDetail: {
    ...typography.caption,
  },
  attemptDetails: {
    gap: spacing[2],
  },
  attemptTopic: {
    ...typography.bodyMedium,
  },
  attemptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attemptDate: {
    ...typography.caption,
  },
  attemptXP: {
    ...typography.caption,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});