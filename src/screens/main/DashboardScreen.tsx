import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Gradient } from '../../components/Gradient';
import { haptics } from '../../utils/haptics';
import { colors, spacing, typography, borderRadius, pathwayGradients, difficultyColors, getImpactColor } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { PATHWAYS } from '../../data/pathways';
import { TASKS, getDailyTasks } from '../../data/tasks';
import { getDailyQuote } from '../../data/quotes';
import { Task } from '../../types';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const { user, completeTask, getTodayCompletedTasks, getCurrentStreak, getTotalXp } = useUser();

  const todayCompletedTasks = getTodayCompletedTasks();
  const currentStreak = getCurrentStreak();
  const totalXp = getTotalXp();

  const dailyTasks = useMemo(() => {
    if (!user) return [];
    const tasks: Task[] = [];
    user.selectedPathways.forEach((pathwayId) => {
      const pathwayTasks = getDailyTasks(pathwayId);
      // Get 2-3 tasks per pathway for variety
      tasks.push(...pathwayTasks.slice(0, 3));
    });
    return tasks;
  }, [user]);

  const primaryProgress = user?.progress[user.primaryPathway];
  const primaryPathway = user ? PATHWAYS[user.primaryPathway] : null;

  const quote = useMemo(() => {
    return getDailyQuote(user?.primaryPathway);
  }, [user?.primaryPathway]);

  const completedCount = todayCompletedTasks.length;
  const totalTasks = dailyTasks.length;
  const completionPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleTaskComplete = async (task: Task) => {
    if (todayCompletedTasks.includes(task.id)) return;
    haptics.notification('success');
    await completeTask(task);
  };

  if (!user || !primaryPathway) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{currentStreak}</Text>
          </View>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{quote.text}"</Text>
          {quote.author && <Text style={styles.quoteAuthor}>— {quote.author}</Text>}
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressCard}>
            <Gradient
              colors={pathwayGradients[user.primaryPathway]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            >
              <View style={styles.progressContent}>
                <View style={styles.progressLeft}>
                  <Text style={styles.progressPathway}>
                    {primaryPathway.icon} {primaryPathway.name}
                  </Text>
                  <Text style={styles.progressLevel}>Level {primaryProgress?.level || 1}</Text>
                </View>
                <View style={styles.progressRight}>
                  <Text style={styles.progressPercent}>{Math.round(completionPercent)}%</Text>
                  <Text style={styles.progressTasks}>
                    {completedCount}/{totalTasks} tasks
                  </Text>
                </View>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
              </View>
            </Gradient>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="⚡" value={totalXp.toString()} label="Total XP" color={colors.xp} />
          <StatCard icon="📈" value={`Lv ${user.totalLevel}`} label="Overall" color={colors.primary} />
          <StatCard icon="🎯" value={completedCount.toString()} label="Today" color={colors.success} />
        </View>

        {/* Daily Tasks */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Daily Tasks</Text>
          {dailyTasks.map((task) => {
            const isCompleted = todayCompletedTasks.includes(task.id);
            const pathway = PATHWAYS[task.pathwayId];
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
                    <View style={styles.taskHeader}>
                      <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
                        {task.title}
                      </Text>
                      <View style={[styles.pathwayTag, { backgroundColor: `${pathway.color}20` }]}>
                        <Text style={[styles.pathwayTagText, { color: pathway.color }]}>
                          {pathway.icon}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.taskDescription}>{task.description}</Text>
                    <View style={styles.taskMeta}>
                      {task.duration && (
                        <Text style={styles.taskMetaText}>⏱️ {task.duration}</Text>
                      )}
                      <Text style={[styles.taskMetaText, { color: difficultyColors[task.difficulty] }]}>
                        {task.difficulty}
                      </Text>
                      <Text style={styles.taskXp}>+{task.xpReward} XP</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.taskRight}>
                  <View style={[styles.impactIndicator, { backgroundColor: `${getImpactColor(task.impactScore)}20` }]}>
                    <Text style={[styles.impactText, { color: getImpactColor(task.impactScore) }]}>
                      {task.impactScore}
                    </Text>
                  </View>
                  <Text style={styles.impactLabel}>ROI</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Science Tip */}
        {dailyTasks.length > 0 && (
          <View style={styles.scienceTip}>
            <Text style={styles.scienceIcon}>🧪</Text>
            <Text style={styles.scienceText}>
              {dailyTasks[Math.floor(Math.random() * dailyTasks.length)].scienceTip}
            </Text>
          </View>
        )}

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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  username: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  streakIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  streakCount: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.streak,
  },
  quoteCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  quoteText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  progressSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: spacing.lg,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressLeft: {},
  progressPathway: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  progressLevel: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressRight: {
    alignItems: 'flex-end',
  },
  progressPercent: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  progressTasks: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.text,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  tasksSection: {
    paddingHorizontal: spacing.lg,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.text,
    flex: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textTertiary,
  },
  pathwayTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  pathwayTagText: {
    fontSize: 12,
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
  taskMetaText: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  taskXp: {
    fontSize: typography.size.xs,
    color: colors.xp,
    fontWeight: typography.weight.semibold,
  },
  taskRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  impactIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
  },
  impactLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  scienceTip: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  scienceIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  scienceText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default DashboardScreen;
