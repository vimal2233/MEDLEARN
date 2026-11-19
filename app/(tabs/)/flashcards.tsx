'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Card, Button } from '@/components/ui';
import { Ionicons, MaterialCommunityIcons, Feather, AntDesign } from '@expo/vector-icons';

const FLASHCARD_DECKS = [
  { id: 'anatomy_gross', subject: 'Anatomy', category: 'Gross Anatomy', total: 245, due: 12, mastered: 89, learning: 45, color: '#E11D48', icon: 'dna' },
  { id: 'anatomy_histology', subject: 'Anatomy', category: 'Histology', total: 180, due: 8, mastered: 67, learning: 23, color: '#BE185D', icon: 'microscope' },
  { id: 'physiology_cardio', subject: 'Physiology', category: 'Cardiovascular', total: 156, due: 15, mastered: 78, learning: 32, color: '#0891B2', icon: 'heart-pulse' },
  { id: 'physiology_neuro', subject: 'Physiology', category: 'Neurophysiology', total: 134, due: 5, mastered: 45, learning: 28, color: '#06B6D4', icon: 'brain' },
  { id: 'biochemistry_metabolism', subject: 'Biochemistry', category: 'Metabolism', total: 198, due: 22, mastered: 102, learning: 41, color: '#7C3AED', icon: 'flask-conical' },
  { id: 'pathology_general', subject: 'Pathology', category: 'General Pathology', total: 287, due: 35, mastered: 145, learning: 67, color: '#DC2626', icon: 'virus' },
  { id: 'pharmacology_autonomic', subject: 'Pharmacology', category: 'Autonomic NS', total: 167, due: 18, mastered: 76, learning: 34, color: '#EA580C', icon: 'pill' },
  { id: 'microbiology_bacteriology', subject: 'Microbiology', category: 'Bacteriology', total: 223, due: 28, mastered: 98, learning: 51, color: '#16A34A', icon: 'bacteria' },
];

const DAILY_REVIEW = {
  due: 45,
  new: 10,
  learning: 15,
  estimatedTime: 12,
};

const STATS = [
  { label: 'Total Cards', value: '1,590', icon: 'card', color: '#1A6BB8' },
  { label: 'Due Today', value: String(DAILY_REVIEW.due), icon: 'calendar', color: '#EF4444' },
  { label: 'Mastered', value: '690', icon: 'check-circle', color: '#22C55E' },
  { label: 'Retention', value: '87%', icon: 'trending-up', color: '#7C3AED' },
];

export default function FlashcardsScreen() {
  const { profile } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      'dna': <Ionicons name="dna" size={22} color="#FFFFFF" />,
      'microscope': <MaterialCommunityIcons name="microscope" size={22} color="#FFFFFF" />,
      'heart-pulse': <Ionicons name="pulse" size={22} color="#FFFFFF" />,
      'brain': <Ionicons name="construct" size={22} color="#FFFFFF" />,
      'flask-conical': <Ionicons name="flask" size={22} color="#FFFFFF" />,
      'virus': <Ionicons name="bug" size={22} color="#FFFFFF" />,
      'pill': <Ionicons name="medkit" size={22} color="#FFFFFF" />,
      'bacteria': <MaterialCommunityIcons name="bacteria" size={22} color="#FFFFFF" />,
    };
    return icons[iconName] || <Ionicons name="card" size={22} color="#FFFFFF" />;
  };

  const handleDeckPress = (deckId: string) => {
    router.push(`/flashcards/${deckId}`);
  };

  const handleReviewAll = () => {
    router.push('/flashcards/review');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Flashcards</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Spaced repetition for long-term retention</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/flashcards/settings')} style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color={theme.colors.textSecondary} />
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

        {/* Daily Review Card */}
        <Card style={styles.dailyReviewCard} variant="elevated" padding="lg">
          <View style={styles.dailyReviewHeader}>
            <View style={styles.dailyReviewIcon}>
              <Feather name="clock" size={24} color={theme.colors.accent[500]} />
            </View>
            <View>
              <Text style={[styles.dailyReviewTitle, { color: theme.colors.text }]}>Daily Review</Text>
              <Text style={[styles.dailyReviewSubtitle, { color: theme.colors.textSecondary }]}>Estimated {DAILY_REVIEW.estimatedTime} minutes</Text>
            </View>
          </View>

          <View style={styles.dailyReviewStats}>
            <View style={styles.dailyReviewStat}>
              <Text style={[styles.dailyReviewStatValue, { color: theme.colors.error }]}>{DAILY_REVIEW.due}</Text>
              <Text style={[styles.dailyReviewStatLabel, { color: theme.colors.textSecondary }]}>Due</Text>
            </View>
            <View style={styles.dailyReviewStat}>
              <Text style={[styles.dailyReviewStatValue, { color: theme.colors.primary[500] }]}>{DAILY_REVIEW.new}</Text>
              <Text style={[styles.dailyReviewStatLabel, { color: theme.colors.textSecondary }]}>New</Text>
            </View>
            <View style={styles.dailyReviewStat}>
              <Text style={[styles.dailyReviewStatValue, { color: theme.colors.warning }]}>{DAILY_REVIEW.learning}</Text>
              <Text style={[styles.dailyReviewStatLabel, { color: theme.colors.textSecondary }]}>Learning</Text>
            </View>
          </View>

          <Button size="lg" fullWidth variant="primary" onPress={handleReviewAll} style={styles.reviewButton}>
            <Ionicons name="play" size={18} color="#FFFFFF" style={{ marginRight: spacing[2] }} />
            Start Review Session
          </Button>
        </Card>

        {/* Decks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Decks</Text>
          <TouchableOpacity onPress={() => router.push('/flashcards/decks')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.decksList}>
          {FLASHCARD_DECKS.map((deck) => (
            <TouchableOpacity
              key={deck.id}
              onPress={() => handleDeckPress(deck.id)}
              style={styles.deckCard}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={[styles.deckIcon, { backgroundColor: deck.color }]}>
                {getIconComponent(deck.icon)}
              </View>
              <View style={styles.deckInfo} flex={1}>
                <View style={styles.deckHeader}>
                  <Text style={[styles.deckSubject, { color: theme.colors.text }]}>{deck.subject}</Text>
                  <Text style={[styles.deckCategory, { color: deck.color }]}>{deck.category}</Text>
                </View>
                <View style={styles.deckProgress}>
                  <View style={styles.deckProgressBar}>
                    <View
                      style={[
                        styles.deckProgressFill,
                        { backgroundColor: deck.color, width: `${Math.round((deck.mastered / deck.total) * 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={[styles.deckProgressText, { color: theme.colors.textSecondary }]}>{deck.mastered}/{deck.total} mastered</Text>
                </View>
              </View>
              <View style={styles.deckStats}>
                {deck.due > 0 && (
                  <View style={[styles.deckBadge, { backgroundColor: theme.colors.error + '20' }]}>
                    <Text style={[styles.deckBadgeText, { color: theme.colors.error }]}>{deck.due} due</Text>
                  </View>
                )}
                <View style={styles.deckXP}>
                  <Text style={[styles.xpText, { color: deck.color }]}+{deck.mastered * 2 + deck.learning} XP</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsGrid}>
          {[
            { id: 'create', label: 'Create Deck', icon: 'add-circle', color: '#1A6BB8', route: '/flashcards/create' },
            { id: 'import', label: 'Import Cards', icon: 'download', color: '#14C9B0', route: '/flashcards/import' },
            { id: 'statistics', label: 'Statistics', icon: 'bar-chart', color: '#7C3AED', route: '/flashcards/stats' },
            { id: 'settings', label: 'Algorithm', icon: 'settings', color: '#EA580C', route: '/flashcards/settings' },
          ].map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => router.push(action.route)}
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
  settingsButton: {
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
  dailyReviewCard: {},
  dailyReviewHeader: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  dailyReviewIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyReviewTitle: {
    ...typography.titleMedium,
    fontWeight: '600',
  },
  dailyReviewSubtitle: {
    ...typography.bodySmall,
    marginTop: spacing[1],
  },
  dailyReviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  dailyReviewStat: {
    alignItems: 'center',
  },
  dailyReviewStatValue: {
    ...typography.headlineSmall,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  dailyReviewStatLabel: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  reviewButton: {
    marginTop: spacing[2],
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
  decksList: {
    gap: spacing[3],
  },
  deckCard: {
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
  deckIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckInfo: {
    gap: spacing[2],
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  deckSubject: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  deckCategory: {
    ...typography.caption,
    fontWeight: '600',
  },
  deckProgress: {
    gap: spacing[1],
  },
  deckProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  deckProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  deckProgressText: {
    ...typography.caption,
  },
  deckStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  deckBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  deckBadgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  deckXP: {
    marginLeft: 'auto',
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
    width: (390 - spacing[5] * 2 - spacing[3] * 2) / 3,
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
  bottomSpacer: {
    height: 100,
  },
});