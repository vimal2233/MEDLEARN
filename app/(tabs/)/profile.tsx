'use client';

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { typography, colors, spacing, borderRadius, shadows } from '@/theme';
import { Card, Button, Input } from '@/components/ui';
import { Ionicons, MaterialCommunityIcons, Feather, AntDesign, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const SETTINGS_SECTIONS = [
  {
    id: 'account',
    title: 'Account',
    icon: 'person',
    items: [
      { id: 'profile', label: 'Edit Profile', icon: 'pencil', route: '/settings/profile' },
      { id: 'password', label: 'Change Password', icon: 'lock', route: '/settings/password' },
      { id: 'email', label: 'Change Email', icon: 'mail', route: '/settings/email' },
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    icon: 'settings',
    items: [
      { id: 'language', label: 'Language', icon: 'translate', route: '/settings/language' },
      { id: 'theme', label: 'Appearance', icon: 'contrast', route: '/settings/theme' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', route: '/settings/notifications' },
      { id: 'study_target', label: 'Daily Study Target', icon: 'target', route: '/settings/study-target' },
    ],
  },
  {
    id: 'learning',
    title: 'Learning',
    icon: 'school',
    items: [
      { id: 'curriculum', label: 'Academic Phase', icon: 'calendar', route: '/settings/curriculum' },
      { id: 'goals', label: 'Learning Goals', icon: 'flag', route: '/settings/goals' },
      { id: 'weak_areas', label: 'Focus Areas', icon: 'alert-circle', route: '/settings/weak-areas' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Privacy',
    icon: 'database',
    items: [
      { id: 'download', label: 'Download Data', icon: 'download', route: '/settings/download' },
      { id: 'offline', label: 'Offline Content', icon: 'wifi-off', route: '/settings/offline' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield', route: '/settings/privacy' },
      { id: 'terms', label: 'Terms of Service', icon: 'file-text', route: '/settings/terms' },
    ],
  },
  {
    id: 'danger',
    title: 'Danger Zone',
    icon: 'alert-triangle',
    items: [
      { id: 'logout', label: 'Sign Out', icon: 'logout', action: 'logout', destructive: true },
      { id: 'delete', label: 'Delete Account', icon: 'trash', action: 'delete', destructive: true },
    ],
  },
];

const ACHIEVEMENTS = [
  { id: 'first_quiz', name: 'First Steps', desc: 'Complete your first quiz', icon: 'trophy', color: '#F59E0B', unlocked: true, date: '2024-01-15' },
  { id: 'streak_7', name: 'Week Warrior', desc: '7-day learning streak', icon: 'zap', color: '#EF4444', unlocked: true, date: '2024-01-20' },
  { id: 'mcq_100', name: 'Quiz Master', desc: 'Answer 100 MCQs', icon: 'quiz', color: '#1A6BB8', unlocked: true, date: '2024-02-10' },
  { id: 'flashcard_50', name: 'Card Collector', desc: 'Review 50 flashcards', icon: 'card', color: '#14C9B0', unlocked: true, date: '2024-02-15' },
  { id: 'anatomy_explorer', name: 'Anatomy Explorer', desc: 'Complete all Anatomy topics', icon: 'dna', color: '#E11D48', unlocked: false },
  { id: 'streak_30', name: 'Monthly Master', desc: '30-day learning streak', icon: 'calendar', color: '#7C3AED', unlocked: false },
  { id: 'clinical_solver', name: 'Clinical Solver', desc: 'Complete 10 clinical cases', icon: 'stethoscope', color: '#16A34A', unlocked: false },
  { id: 'revision_champ', name: 'Revision Champion', desc: 'Master 500 flashcards', icon: 'refresh', color: '#A855F7', unlocked: false },
];

export default function ProfileScreen() {
  const { profile, user, signOut, loading: authLoading } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => router.push('/settings/delete-account') },
      ]
    );
  };

  const handleSettingsItem = (item: typeof SETTINGS_SECTIONS[0]['items'][0]) => {
    if (item.action === 'logout') {
      handleSignOut();
    } else if (item.action === 'delete') {
      handleDeleteAccount();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={[styles.loadingLogo, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.loadingLogoText}>M</Text>
          </View>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary[500] }]}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{getInitials(profile?.full_name)}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => router.push('/settings/profile')} style={styles.editAvatarButton}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>{profile?.full_name || 'Student'}</Text>
            <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{user?.email || 'email@example.com'}</Text>
            <View style={styles.profileBadges}>
              <View style={[styles.badge, { backgroundColor: theme.colors.primary[500] + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary[500] }]}>{profile?.academic_phase?.replace('phase1', 'Phase 1').replace('phase2', 'Phase 2').replace('phase3a', 'Phase 3a').replace('phase3b', 'Phase 3b') || 'MBBS'}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: theme.colors.secondary[500] + '20' }]}>
                <Text style={[styles.badgeText, { color: theme.colors.secondary[500] }]}>{profile?.daily_study_target_minutes || 60} min/day</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/settings/profile')} style={styles.editProfileButton}>
            <Ionicons name="pencil" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {[
            { label: 'Total XP', value: '2,847', icon: 'star', color: '#F59E0B' },
            { label: 'Streak', value: '7 days', icon: 'zap', color: '#EF4444' },
            { label: 'Accuracy', value: '73%', icon: 'target', color: '#14C9B0' },
            { label: 'Study Time', value: '18h 42m', icon: 'timer', color: '#7C3AED' },
          ].map((stat, index) => (
            <Card key={index} style={styles.statCard} variant="elevated" padding="md">
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <View style={styles.statText}>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
          <TouchableOpacity onPress={() => router.push('/achievements')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary[500] }]}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.achievementsGrid}>
          {ACHIEVEMENTS.slice(0, 4).map((achievement) => (
            <Card key={achievement.id} style={styles.achievementCard} variant={achievement.unlocked ? 'elevated' : 'outlined'} padding="md">
              <View style={styles.achievementContent}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.unlocked ? achievement.color + '20' : theme.colors.surfaceVariant }, { opacity: achievement.unlocked ? 1 : 0.5 }]}>
                  <Ionicons name={achievement.icon} size={24} color={achievement.unlocked ? achievement.color : theme.colors.textTertiary} />
                </View>
                <View style={styles.achievementText} flex={1}>
                  <Text style={[
                    styles.achievementName,
                    { color: achievement.unlocked ? theme.colors.text : theme.colors.textTertiary },
                  ]}>
                    {achievement.name}
                  </Text>
                  <Text style={[
                    styles.achievementDesc,
                    { color: achievement.unlocked ? theme.colors.textSecondary : theme.colors.textTertiary },
                  ]}>
                    {achievement.desc}
                  </Text>
                  {achievement.unlocked && achievement.date && (
                    <Text style={[
                      styles.achievementDate,
                      { color: theme.colors.textTertiary },
                    ]}>
                      Unlocked {formatDate(achievement.date)}
                    </Text>
                  )}
                </View>
                {achievement.unlocked && (
                  <View style={styles.achievementCheck}>
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.id} style={styles.settingsSection}>
            <View style={styles.settingsSectionHeader}>
              <View style={[styles.settingsSectionIcon, { backgroundColor: theme.colors.primary[500] + '20' }]}>
                <Ionicons name={section.icon} size={20} color={theme.colors.primary[500]} />
              </View>
              <Text style={[styles.settingsSectionTitle, { color: theme.colors.text }]}>{section.title}</Text>
            </View>

            <View style={styles.settingsItems}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSettingsItem(item)}
                  style={[
                    styles.settingsItem,
                    item.destructive && styles.settingsItemDestructive,
                  ]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={[styles.settingsItemIcon, { backgroundColor: item.destructive ? theme.colors.error + '20' : theme.colors.surfaceVariant }]}>
                    <Ionicons name={item.icon} size={20} color={item.destructive ? theme.colors.error : theme.colors.textSecondary} />
                  </View>
                  <Text style={[
                    styles.settingsItemLabel,
                    { color: item.destructive ? theme.colors.error : theme.colors.text },
                  ]}>
                    {item.label}
                  </Text>
                  {!item.destructive && !item.action && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textTertiary }]}>MedLearn v1.0.0</Text>
          <Text style={[styles.appTagline, { color: theme.colors.textTertiary }]}>Learn Smarter. Remember Longer. Become Better.</Text>
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
    paddingBottom: spacing[8],
    gap: spacing[5],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
    padding: spacing[4],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: spacing[1],
  },
  profileName: {
    ...typography.headlineMedium,
    fontWeight: '700',
  },
  profileEmail: {
    ...typography.bodyMedium,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  editProfileButton: {
    padding: spacing[2],
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  statCard: {
    width: (390 - spacing[5] * 2 - spacing[3]) / 2,
  },
  statContent: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    ...typography.titleMedium,
    fontWeight: '700',
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (390 - spacing[5] * 2 - spacing[3]) / 2,
  },
  achievementContent: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  achievementText: {
    flex: 1,
    gap: spacing[1],
    justifyContent: 'center',
  },
  achievementName: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  achievementDesc: {
    ...typography.caption,
  },
  achievementDate: {
    ...typography.caption,
    marginTop: spacing[1],
  },
  achievementCheck: {
    marginTop: 'auto',
  },
  settingsSection: {
    marginTop: spacing[2],
  },
  settingsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
    paddingHorizontal: spacing[1],
  },
  settingsSectionIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsSectionTitle: {
    ...typography.labelMedium,
    fontWeight: '600',
  },
  settingsItems: {
    gap: spacing[1],
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsItemDestructive: {
    borderColor: theme.colors.error + '40',
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemLabel: {
    ...typography.bodyMedium,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[4],
    paddingVertical: spacing[4],
  },
  appVersion: {
    ...typography.caption,
  },
  appTagline: {
    ...typography.caption,
  },
  bottomSpacer: {
    height: 100,
  },
});