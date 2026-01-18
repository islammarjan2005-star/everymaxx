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
import { colors, spacing, typography, borderRadius, pathwayGradients } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { PATHWAYS, PATHWAY_ORDER } from '../../data/pathways';
import { PathwayId } from '../../types';

const PathwaysScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, addPathway } = useUser();

  if (!user) return null;

  const activePathways = user.selectedPathways;
  const inactivePathways = PATHWAY_ORDER.filter((id) => !activePathways.includes(id));

  const handlePathwayPress = (pathwayId: PathwayId) => {
    haptics.impact('light');
    navigation.navigate('PathwayDetail', { pathwayId });
  };

  const handleAddPathway = async (pathwayId: PathwayId) => {
    haptics.notification('success');
    await addPathway(pathwayId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Pathways</Text>
        <Text style={styles.subtitle}>Track progress across all your improvement areas</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Active Pathways */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active</Text>
          {activePathways.map((pathwayId) => {
            const pathway = PATHWAYS[pathwayId];
            const progress = user.progress[pathwayId];
            const isPrimary = user.primaryPathway === pathwayId;
            const xpPercent = progress
              ? (progress.currentXp / progress.xpToNextLevel) * 100
              : 0;

            return (
              <TouchableOpacity
                key={pathwayId}
                style={styles.pathwayCard}
                onPress={() => handlePathwayPress(pathwayId)}
                activeOpacity={0.7}
              >
                <Gradient
                  colors={pathwayGradients[pathwayId]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.pathwayIcon}>{pathway.icon}</Text>
                      <View>
                        <View style={styles.nameRow}>
                          <Text style={styles.pathwayName}>{pathway.name}</Text>
                          {isPrimary && (
                            <View style={styles.primaryBadge}>
                              <Text style={styles.primaryText}>PRIMARY</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.pathwayTagline}>{pathway.tagline}</Text>
                      </View>
                    </View>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>{progress?.level || 1}</Text>
                    </View>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.xpText}>
                        {progress?.currentXp || 0} / {progress?.xpToNextLevel || 100} XP
                      </Text>
                      <Text style={styles.tasksText}>
                        {progress?.tasksCompleted || 0} tasks
                      </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${xpPercent}%` }]} />
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{progress?.currentStreak || 0}</Text>
                      <Text style={styles.statLabel}>🔥 Streak</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{progress?.totalXp || 0}</Text>
                      <Text style={styles.statLabel}>⚡ Total XP</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statValue}>{pathway.categories.length}</Text>
                      <Text style={styles.statLabel}>📚 Skills</Text>
                    </View>
                  </View>
                </Gradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Locked/Available Pathways */}
        {inactivePathways.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available to Unlock</Text>
            {inactivePathways.map((pathwayId) => {
              const pathway = PATHWAYS[pathwayId];
              return (
                <View key={pathwayId} style={styles.lockedCard}>
                  <View style={styles.lockedContent}>
                    <Text style={styles.lockedIcon}>{pathway.icon}</Text>
                    <View style={styles.lockedInfo}>
                      <Text style={styles.lockedName}>{pathway.name}</Text>
                      <Text style={styles.lockedTagline}>{pathway.tagline}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.unlockButton, { backgroundColor: pathway.color }]}
                    onPress={() => handleAddPathway(pathwayId)}
                  >
                    <Text style={styles.unlockText}>Add</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  pathwayCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  cardGradient: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pathwayIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pathwayName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  primaryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  primaryText: {
    fontSize: typography.size.xs,
    color: colors.text,
    fontWeight: typography.weight.bold,
  },
  pathwayTagline: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  xpText: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  tasksText: {
    fontSize: typography.size.sm,
    color: 'rgba(255,255,255,0.7)',
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
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.size.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  lockedCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  lockedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lockedIcon: {
    fontSize: 32,
    marginRight: spacing.md,
    opacity: 0.6,
  },
  lockedInfo: {
    flex: 1,
  },
  lockedName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.textSecondary,
  },
  lockedTagline: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
  },
  unlockButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  unlockText: {
    color: colors.text,
    fontWeight: typography.weight.semibold,
    fontSize: typography.size.sm,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default PathwaysScreen;
