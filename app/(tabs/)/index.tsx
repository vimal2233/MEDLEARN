'use client';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Button, Card } from '@/components/ui';
import { Ionicons, MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'ai_tutor', label: 'Ask AI Tutor', icon: 'robot', color: '#7C3AED', route: '/ai-tutor' },
  { id: 'mcq', label: 'Practice MCQs', icon: 'quiz', color: '#DC2626', route: '/practice' },
  { id: 'flashcards', label: 'Revise Flashcards', icon: 'card', color: '#14C9B0', route: '/flashcards' },
  { id: 'clinical', label: 'Clinical Case', icon: 'stethoscope', color: '#EA580C', route: '/cases/daily' },
  { id: 'notes', label: 'Quick Notes', icon: 'note', color: '#0891B2', route: '/notes' },
  { id: 'exam', label: 'Exam Prep', icon: 'trophy', color: '#F59E0B', route: '/exam-prep' },
];

const DAILY_MISSIONS = [
  { id: 1, title: 'Complete one Anatomy lesson', progress: 0, target: 1, xp: 50, icon: 'book-open', color: '#E11D48' },
  { id: 2, title: 'Answer 10 Physiology MCQs', progress: 3, target: 10, xp: 100, icon: 'help-circle', color: '#0891B2' },
  { id: 3, title: 'Revise 15 flashcards', progress: 8, target: 15, xp: 75, icon: 'flash', color: '#7C3AED' },
  { id: 4, title: 'Finish Clinical Case of the Day', progress: 0, target: 1, xp: 150, icon: 'clipboard-list', color: '#16A34A' },
];

export default function HomeScreen() {
  const { profile, user, loading: authLoading, refreshProfile } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [streak, setStreak] = useState(7);
  const [weeklyActivity, setWeeklyActivity] = useState([true, false, true, true, false, true, true]);
  const [weakAreas, setWeakAreas] = useState(['Pathology - Inflammation', 'Pharmacology - ANS Drugs', 'Anatomy - Brachial Plexus']);
  const [continueLearning, setContinueLearning] = useState({ subject: 'Anatomy', topic: 'Upper Limb - Brachial Plexus', progress: 65 });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDayName = (index: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[index];
  };

  const handleQuickAction = (route: string) => {
    router.push(route);
  };

  const handleContinueLearning = () => {
    router.push('/subjects/anatomy/chapters/upper-limb/topics/brachial-plexus');
  };

  const handleWeakArea = (area: string) => {
    router.push('/search?q=' + encodeURIComponent(area));
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={[styles.loadingLogo, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.loadingLogoText}>M</Text>
          </View>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary[500]]}
            progressBackgroundColor={isDark ? theme.colors.dark.surface : theme.colors.light.surface}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeContent}>
            <View style={styles.greetingRow}>
              <Text style={[styles.greeting, { color: theme.colors.text }]}>{getGreeting()},</Text>
            </View>
            <Text style={[styles.name, { color: theme.colors.text }]}>{profile?.full_name || 'Student'}</Text>
            <Text style={[styles.academicPhase, { color: theme.colors.textSecondary }]}>
              {profile?.academic_phase?.replace('phase1', 'Phase 1 • 1st Year MBBS')
                .replace('phase2', 'Phase 2 • 2nd Year MBBS')
                .replace('phase3a', 'Phase 3 Part 1 • 3rd Year MBBS')
                .replace('phase3b', 'Phase 3 Part 2 • Final Year MBBS') || 'MBBS Student'}
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary[500] }]}>
              <Text style={styles.avatarText}>
                {profile?.full_name?.charAt(0).toUpperCase() || 'M'}
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Learning Card */}
        <Card style={styles.dailyCard} variant="elevated" padding="lg">
          <View style={styles.dailyHeader}>
            <View style={styles.dailyIcon}>
              <Ionicons name="target" size={24} color={theme.colors.primary[500]} />
            </View>
            <View>
              <Text style={[styles.dailyTitle, { color: theme.colors.text }]}>Today's Target</Text>
              <Text style={[styles.dailySubtitle, { color: theme.colors.textSecondary }]}>
                {profile?.daily_study_target_minutes || 60} minutes of focused learning
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.text }]}>Completed</Text>
              <Text style={[styles.progressValue, { color: theme.colors.primary[500] }]}>23 min</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.colors.primary[500], width: '38%' },
                ]}
              />
            </View>
            <View style={styles.progressRow}>
              <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Remaining</Text>
              <Text style={[styles.progressValue, { color: theme.colors.textSecondary }]}>37 min</Text>
            </View>
          </View>

          <Button size="md" fullWidth variant="primary" onPress={handleContinueLearning} style={styles.startButton}>
            <Ionicons name="play" size={18} color="#FFFFFF" style={{ marginRight: spacing[2] }} />
            Continue Learning
          </Button>
        </Card>

        {/* Learning Streak */}
        <Card style={styles.streakCard} variant="outlined" padding="lg">
          <View style={styles.streakHeader}>
            <View style={styles.streakIcon}>
              <Feather name="zap" size={24} color={theme.colors.accent[500]} />
            </View>
            <View>
              <Text style={[styles.streakTitle, { color: theme.colors.text }]}>Learning Streak</Text>
              <Text style={[styles.streakSubtitle, { color: theme.colors.textSecondary }]}>Keep the momentum going!</Text>
            </View>
          </View>

          <View style={styles.streakValue}>
            <Text style={[styles.streakNumber, { color: theme.colors.accent[500] }]}>{streak}</Text>
            <Text style={[styles.streakLabel, { color: theme.colors.textSecondary }]}>Days in a Row</Text>
          </View>

          <View style={styles.weeklyActivity}>
            {weeklyActivity.map((active, index) => (
              <View key={index} style={styles.dayColumn}>
                <View
                  style={[
                    styles.dayDot,
                    {
                      backgroundColor: active ? theme.colors.success : theme.colors.border,
                      width: 10,
                      height: 10,
                    },
                  ]}
                />
                <Text style={[styles.dayLabel, { color: theme.colors.textSecondary }]}>{getDayName(index)}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Daily Missions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Missions</Text>
          <TouchableOpacity onPress={() => router.push('/missions')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.missionsList}>
          {DAILY_MISSIONS.map((mission) => (
            <Card key={mission.id} style={styles.missionCard} variant="outlined" padding="md">
              <View style={styles.missionContent}>
                <View style={[styles.missionIcon, { backgroundColor: mission.color + '20' }]}>
                  <Ionicons name={mission.icon} size={22} color={mission.color} />
                </View>
                <View style={styles.missionText} flex={1}>
                  <Text style={[styles.missionTitle, { color: theme.colors.text }]}>{mission.title}</Text>
                  <View style={styles.missionProgressBar}>
                    <View
                      style={[
                        styles.missionProgressFill,
                        { backgroundColor: mission.color, width: `${(mission.progress / mission.target) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.missionProgressText, { color: theme.colors.textSecondary }]}>{mission.progress}/{mission.target}</Text>
                </View>
                <View style={styles.missionXP}>
                  <Text style={[styles.xpText, { color: mission.color }]}>+{mission.xp} XP</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleQuickAction(action.route)}
              style={styles.quickActionCard}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: theme.colors.text }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Learning */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Continue Learning</Text>
        </View>

        <Card style={styles.continueCard} variant="elevated" padding="lg" onPress={handleContinueLearning}>
          <View style={styles.continueContent}>
            <View style={styles.continueIcon}>
              <AntDesign name="book" size={28} color={theme.colors.primary[500]} />
            </View>
            <View style={styles.continueText} flex={1}>
              <Text style={[styles.continueSubject, { color: theme.colors.primary[500] }]}>{continueLearning.subject}</Text>
              <Text style={[styles.continueTopic, { color: theme.colors.text }]}>{continueLearning.topic}</Text>
              <View style={styles.continueProgress}>
                <View style={styles.continueProgressBar}>
                  <View
                    style={[
                      styles.continueProgressFill,
                      { backgroundColor: theme.colors.primary[500], width: `${continueLearning.progress}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.continueProgressText, { color: theme.colors.textSecondary }]}>{continueLearning.progress}% Complete</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.textTertiary} />
          </View>
        </Card>

        {/* Weak Areas */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Focus Areas</Text>
          <TouchableOpacity onPress={() => router.push('/analytics/weak-areas')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weakAreasList}>
          {weakAreas.map((area, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleWeakArea(area)}
              style={styles.weakAreaCard}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.weakAreaIcon}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.warning} />
              </View>
              <Text style={[styles.weakAreaText, { color: theme.colors.text }]}>{area}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Study Plan */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming Schedule</Text>
          <TouchableOpacity onPress={() => router.push('/planner')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>View Planner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleList}>
          {[
            { time: '07:00 AM', task: 'Anatomy: Brachial Plexus Review', type: 'revision', color: '#14C9B0' },
            { time: '07:00 PM', task: 'Physiology MCQ Practice (10 questions)', type: 'practice', color: '#0891B2' },
            { time: '09:00 PM', task: 'Flashcard Revision (15 cards)', type: 'flashcards', color: '#7C3AED' },
          ].map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <View style={styles.scheduleTime}>
                <Text style={[styles.scheduleTimeText, { color: theme.colors.text }]}>{item.time}</Text>
              </View>
              <View style={styles.scheduleContent}>
                <View style={[styles.scheduleTypeDot, { backgroundColor: item.color }]} />
                <Text style={[styles.scheduleTaskText, { color: theme.colors.text }]}>{item.task}</Text>
              </View>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingContent: {
    alignItems: 'center',
    gap: spacing[4],
  },
  loadingLogo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogoText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  loadingText: {
    ...typography.bodyMedium,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[10],
    gap: spacing[5],
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing[2],
  },
  welcomeContent: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  greeting: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  name: {
    ...typography.headlineMedium,
    fontWeight: '700',
    marginTop: spacing[1],
  },
  academicPhase: {
    ...typography.bodyMedium,
    marginTop: spacing[1],
  },
  avatarContainer: {
    marginLeft: spacing[4],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  dailyCard: {
    marginTop: spacing[2],
  },
  dailyHeader: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  dailyIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  dailySubtitle: {
    ...typography.bodySmall,
    marginTop: spacing[1],
  },
  progressBarContainer: {
    gap: spacing[2],
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typography.labelSmall,
  },
  progressValue: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  startButton: {
    marginTop: spacing[2],
  },
  streakCard: {},
  streakHeader: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  streakSubtitle: {
    ...typography.bodySmall,
    marginTop: spacing[1],
  },
  streakValue: {
    alignItems: 'center',
    marginVertical: spacing[4],
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
    lineHeight: 56,
  },
  streakLabel: {
    ...typography.bodyMedium,
    marginTop: spacing[1],
  },
  weeklyActivity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dayColumn: {
    alignItems: 'center',
    gap: spacing[1],
  },
  dayDot: {
    borderRadius: 5,
  },
  dayLabel: {
    ...typography.caption,
    fontWeight: '500',
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
  missionsList: {
    gap: spacing[3],
  },
  missionCard: {},
  missionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionText: {
    gap: spacing[2],
  },
  missionTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  missionProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  missionProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  missionProgressText: {
    ...typography.caption,
  },
  missionXP: {
    marginLeft: spacing[2],
  },
  xpText: {
    ...typography.labelSmall,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - spacing[5] * 2 - spacing[3] * 2) / 3,
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  quickActionLabel: {
    ...typography.caption,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  continueCard: {},
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  continueIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: '#E6F0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    gap: spacing[2],
  },
  continueSubject: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  continueTopic: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  continueProgress: {
    gap: spacing[1],
  },
  continueProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    width: 120,
  },
  continueProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  continueProgressText: {
    ...typography.caption,
  },
  weakAreasList: {
    gap: spacing[2],
  },
  weakAreaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  weakAreaIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weakAreaText: {
    ...typography.bodyMedium,
    flex: 1,
  },
  scheduleList: {
    gap: spacing[2],
  },
  scheduleItem: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleTime: {
    width: 70,
    justifyContent: 'center',
  },
  scheduleTimeText: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  scheduleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  scheduleTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scheduleTaskText: {
    ...typography.bodyMedium,
  },
  bottomSpacer: {
    height: 100,
  },
});