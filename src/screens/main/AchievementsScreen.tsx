import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { ACHIEVEMENTS, getUnlockedAchievements, getLockedAchievements } from '../../data/achievements';

const AchievementsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useUser();

  if (!user) return null;

  const unlockedAchievements = getUnlockedAchievements(user.achievements);
  const lockedAchievements = getLockedAchievements(user.achievements);

  const totalXpFromAchievements = unlockedAchievements.reduce(
    (sum, a) => sum + a.xpReward,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.subtitle}>
          {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
        </Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{unlockedAchievements.length}</Text>
          <Text style={styles.summaryLabel}>Unlocked</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{lockedAchievements.length}</Text>
          <Text style={styles.summaryLabel}>Remaining</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: colors.xp }]}>
            {totalXpFromAchievements}
          </Text>
          <Text style={styles.summaryLabel}>XP Earned</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Unlocked */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Unlocked</Text>
            {unlockedAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Text style={styles.iconText}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDesc}>{achievement.description}</Text>
                  <Text style={styles.achievementXp}>+{achievement.xpReward} XP</Text>
                </View>
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>✓</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Locked */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Locked</Text>
          {lockedAchievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, styles.lockedCard]}>
              <View style={[styles.achievementIcon, styles.lockedIcon]}>
                <Text style={styles.iconText}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={[styles.achievementName, styles.lockedText]}>
                  {achievement.name}
                </Text>
                <Text style={[styles.achievementDesc, styles.lockedDesc]}>
                  {achievement.description}
                </Text>
                <View style={styles.requirementRow}>
                  <Text style={styles.requirementText}>
                    {getRequirementText(achievement.requirement)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const getRequirementText = (requirement: {
  type: string;
  value: number;
  pathwayId?: string;
}): string => {
  switch (requirement.type) {
    case 'streak':
      return `${requirement.value}-day streak`;
    case 'tasks_completed':
      return `Complete ${requirement.value} tasks`;
    case 'level':
      return `Reach level ${requirement.value}`;
    default:
      return 'Keep going!';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  lockedCard: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lockedIcon: {
    backgroundColor: colors.surfaceLighter,
  },
  iconText: {
    fontSize: 28,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  achievementDesc: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  achievementXp: {
    fontSize: typography.size.sm,
    color: colors.xp,
    fontWeight: typography.weight.semibold,
    marginTop: spacing.xs,
  },
  lockedText: {
    color: colors.textSecondary,
  },
  lockedDesc: {
    color: colors.textTertiary,
  },
  unlockedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedText: {
    color: colors.text,
    fontWeight: typography.weight.bold,
    fontSize: 14,
  },
  requirementRow: {
    marginTop: spacing.xs,
  },
  requirementText: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default AchievementsScreen;
