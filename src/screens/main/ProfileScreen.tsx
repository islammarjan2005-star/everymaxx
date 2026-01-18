import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Gradient } from '../../components/Gradient';
import { haptics } from '../../utils/haptics';
import { colors, spacing, typography, borderRadius, pathwayGradients } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { PATHWAYS } from '../../data/pathways';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../../data/achievements';
import { calculateLevelFromXp } from '../../types';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, getTotalXp, getCurrentStreak, resetProgress } = useUser();

  if (!user) return null;

  const totalXp = getTotalXp();
  const currentStreak = getCurrentStreak();
  const overallLevel = calculateLevelFromXp(totalXp);
  const unlockedAchievements = getUnlockedAchievements(user.achievements);
  const primaryPathway = PATHWAYS[user.primaryPathway];

  const daysSinceStart = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalTasksCompleted = Object.values(user.progress).reduce(
    (sum, p) => sum + p.tasksCompleted,
    0
  );

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            haptics.notification('warning');
            await resetProgress();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Gradient
              colors={pathwayGradients[user.primaryPathway]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarEmoji}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </Gradient>
          </View>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.memberSince}>
            Maxxing for {daysSinceStart} day{daysSinceStart !== 1 ? 's' : ''}
          </Text>

          <View style={styles.levelCard}>
            <Text style={styles.levelLabel}>OVERALL LEVEL</Text>
            <Text style={styles.levelValue}>{overallLevel.level}</Text>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpFill,
                  { width: `${(overallLevel.currentXp / overallLevel.xpToNext) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.xpText}>
              {overallLevel.currentXp} / {overallLevel.xpToNext} XP to next level
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="⚡" value={totalXp.toString()} label="Total XP" color={colors.xp} />
            <StatCard icon="🔥" value={currentStreak.toString()} label="Current Streak" color={colors.streak} />
            <StatCard icon="✅" value={totalTasksCompleted.toString()} label="Tasks Done" color={colors.success} />
            <StatCard icon="🏆" value={unlockedAchievements.length.toString()} label="Achievements" color={colors.warning} />
            <StatCard icon="🚀" value={user.selectedPathways.length.toString()} label="Active Paths" color={colors.info} />
            <StatCard
              icon="📊"
              value={`Lv ${user.progress[user.primaryPathway]?.level || 1}`}
              label={primaryPathway.name}
              color={primaryPathway.color}
            />
          </View>
        </View>

        {/* Active Pathways Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pathway Progress</Text>
          {user.selectedPathways.map((pathwayId) => {
            const pathway = PATHWAYS[pathwayId];
            const progress = user.progress[pathwayId];
            const xpPercent = progress
              ? (progress.currentXp / progress.xpToNextLevel) * 100
              : 0;

            return (
              <View key={pathwayId} style={styles.pathwayRow}>
                <View style={styles.pathwayInfo}>
                  <Text style={styles.pathwayIcon}>{pathway.icon}</Text>
                  <View style={styles.pathwayText}>
                    <Text style={styles.pathwayName}>{pathway.name}</Text>
                    <Text style={styles.pathwayLevel}>Level {progress?.level || 1}</Text>
                  </View>
                </View>
                <View style={styles.pathwayProgress}>
                  <View style={[styles.pathwayBar, { backgroundColor: `${pathway.color}30` }]}>
                    <View
                      style={[
                        styles.pathwayFill,
                        { width: `${xpPercent}%`, backgroundColor: pathway.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.pathwayXp, { color: pathway.color }]}>
                    {progress?.totalXp || 0} XP
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsRow}>
              {(unlockedAchievements.length > 0
                ? unlockedAchievements.slice(0, 5)
                : ACHIEVEMENTS.slice(0, 5)
              ).map((achievement) => {
                const isUnlocked = user.achievements.includes(achievement.id);
                return (
                  <View
                    key={achievement.id}
                    style={[styles.achievementCard, !isUnlocked && styles.achievementLocked]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={[styles.achievementName, !isUnlocked && styles.achievementNameLocked]}>
                      {achievement.name}
                    </Text>
                    {!isUnlocked && <Text style={styles.lockIndicator}>🔒</Text>}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingValue}>
                {user.settings.notifications ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingIcon}>⏰</Text>
              <Text style={styles.settingText}>Daily Reminder</Text>
              <Text style={styles.settingValue}>{user.settings.dailyReminder}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow}>
              <Text style={styles.settingIcon}>📱</Text>
              <Text style={styles.settingText}>Haptic Feedback</Text>
              <Text style={styles.settingValue}>
                {user.settings.hapticFeedback ? 'On' : 'Off'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingRow, styles.dangerRow]} onPress={handleReset}>
              <Text style={styles.settingIcon}>⚠️</Text>
              <Text style={[styles.settingText, styles.dangerText]}>Reset Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>EveryMaxx v1.0.0</Text>
          <Text style={styles.footerSubtext}>Self-improvement without toxicity</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard: React.FC<{ icon: string; value: string; label: string; color: string }> = ({
  icon,
  value,
  label,
  color,
}) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
    color: colors.text,
    fontWeight: typography.weight.bold,
  },
  username: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  memberSince: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  levelValue: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  xpText: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: typography.size.sm,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  pathwayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pathwayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathwayIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  pathwayText: {},
  pathwayName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  pathwayLevel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  pathwayProgress: {
    alignItems: 'flex-end',
  },
  pathwayBar: {
    width: 80,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  pathwayFill: {
    height: '100%',
    borderRadius: 3,
  },
  pathwayXp: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  achievementCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    width: 100,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  achievementName: {
    fontSize: typography.size.xs,
    color: colors.text,
    textAlign: 'center',
    fontWeight: typography.weight.medium,
  },
  achievementNameLocked: {
    color: colors.textTertiary,
  },
  lockIndicator: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    fontSize: 12,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.text,
  },
  settingValue: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  dangerRow: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
  },
  footerSubtext: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default ProfileScreen;
