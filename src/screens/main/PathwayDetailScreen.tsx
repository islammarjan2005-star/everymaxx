import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Gradient } from '../../components/Gradient';
import { haptics } from '../../utils/haptics';
import { colors, spacing, typography, borderRadius, pathwayGradients, difficultyColors } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { PATHWAYS } from '../../data/pathways';
import { getTasksByPathway } from '../../data/tasks';
import { PathwayId, Task } from '../../types';

const PathwayDetailScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { pathwayId } = route.params;
  const { user, completeTask, getTodayCompletedTasks, setPrimaryPathway } = useUser();

  const pathway = PATHWAYS[pathwayId];
  const progress = user?.progress[pathwayId];
  const tasks = getTasksByPathway(pathwayId);
  const todayCompletedTasks = getTodayCompletedTasks();

  const isPrimary = user?.primaryPathway === pathwayId;
  const xpPercent = progress ? (progress.currentXp / progress.xpToNextLevel) * 100 : 0;

  const handleTaskComplete = async (task: Task) => {
    if (todayCompletedTasks.includes(task.id)) return;
    haptics.notification('success');
    await completeTask(task);
  };

  const handleSetPrimary = async () => {
    if (isPrimary) return;
    haptics.notification('success');
    await setPrimaryPathway(pathwayId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient */}
      <Gradient
        colors={pathwayGradients[pathwayId]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.pathwayIcon}>{pathway.icon}</Text>
          <Text style={styles.pathwayName}>{pathway.name}</Text>
          <Text style={styles.pathwayTagline}>{pathway.tagline}</Text>

          <View style={styles.levelSection}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{progress?.level || 1}</Text>
            </View>
            <View style={styles.xpSection}>
              <Text style={styles.xpText}>
                {progress?.currentXp || 0} / {progress?.xpToNextLevel || 100} XP
              </Text>
              <View style={styles.xpBarBg}>
                <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {!isPrimary && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleSetPrimary}>
            <Text style={styles.primaryButtonText}>Set as Primary</Text>
          </TouchableOpacity>
        )}
        {isPrimary && (
          <View style={styles.primaryIndicator}>
            <Text style={styles.primaryIndicatorText}>⭐ Primary Pathway</Text>
          </View>
        )}
      </Gradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox value={progress?.tasksCompleted || 0} label="Tasks Done" />
          <StatBox value={progress?.totalXp || 0} label="Total XP" />
          <StatBox value={progress?.currentStreak || 0} label="🔥 Streak" />
          <StatBox value={progress?.longestStreak || 0} label="Best Streak" />
        </View>

        {/* Skill Tree */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Tree</Text>
          {pathway.categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              <View style={styles.skillsList}>
                {category.skills.map((skill, index) => {
                  const isUnlocked = skill.unlocked || index === 0;
                  return (
                    <View
                      key={skill.id}
                      style={[styles.skillNode, !isUnlocked && styles.skillNodeLocked]}
                    >
                      <View style={styles.skillContent}>
                        <Text style={[styles.skillName, !isUnlocked && styles.skillNameLocked]}>
                          {skill.name}
                        </Text>
                        <Text style={styles.skillDescription}>{skill.description}</Text>
                        <View style={styles.skillMeta}>
                          <Text style={styles.skillLevel}>
                            Lv {skill.level}/{skill.maxLevel}
                          </Text>
                          <Text style={styles.skillXp}>{skill.xpRequired} XP to unlock</Text>
                        </View>
                      </View>
                      {!isUnlocked && (
                        <View style={styles.lockIcon}>
                          <Text>🔒</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tasks</Text>
          {tasks.map((task) => {
            const isCompleted = todayCompletedTasks.includes(task.id);
            return (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskCard, isCompleted && styles.taskCardCompleted]}
                onPress={() => handleTaskComplete(task)}
                disabled={isCompleted}
                activeOpacity={0.7}
              >
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.taskCheckbox,
                      isCompleted && { backgroundColor: colors.success, borderColor: colors.success },
                    ]}
                  >
                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    <View style={styles.taskMeta}>
                      <Text style={[styles.typeBadge, task.type === 'daily' ? styles.dailyBadge : styles.weeklyBadge]}>
                        {task.type}
                      </Text>
                      <Text style={[styles.difficultyText, { color: difficultyColors[task.difficulty] }]}>
                        {task.difficulty}
                      </Text>
                      <Text style={styles.taskXp}>+{task.xpReward} XP</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trackable Metrics</Text>
          <View style={styles.metricsGrid}>
            {pathway.metrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricName}>{metric.name}</Text>
                <Text style={styles.metricUnit}>{metric.unit}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const StatBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.md,
  },
  headerContent: {
    alignItems: 'center',
  },
  pathwayIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  pathwayName: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  pathwayTagline: {
    fontSize: typography.size.md,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  levelLabel: {
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  levelValue: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  xpSection: {
    flex: 1,
  },
  xpText: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.xs,
  },
  xpBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.text,
    borderRadius: 4,
  },
  primaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  primaryButtonText: {
    color: colors.text,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.sm,
  },
  primaryIndicator: {
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  primaryIndicatorText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.size.sm,
  },
  scrollView: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  categoryName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
  },
  skillsList: {},
  skillNode: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillNodeLocked: {
    opacity: 0.5,
  },
  skillContent: {
    flex: 1,
  },
  skillName: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  skillNameLocked: {
    color: colors.textTertiary,
  },
  skillDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  skillMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  skillLevel: {
    fontSize: typography.size.xs,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
  skillXp: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  lockIcon: {
    marginLeft: spacing.sm,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  checkmark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: typography.weight.bold,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  taskDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  typeBadge: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  dailyBadge: {
    backgroundColor: `${colors.primary}30`,
    color: colors.primary,
  },
  weeklyBadge: {
    backgroundColor: `${colors.info}30`,
    color: colors.info,
  },
  difficultyText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  taskXp: {
    fontSize: typography.size.xs,
    color: colors.xp,
    fontWeight: typography.weight.semibold,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '48%',
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  metricName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  metricUnit: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default PathwayDetailScreen;
