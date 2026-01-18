import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { PATHWAYS } from '../../data/pathways';
import { PathwayId } from '../../types';

const SelectPrimaryScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { selectedPathways } = route.params;
  const [primary, setPrimary] = useState<PathwayId | null>(null);

  const canContinue = primary !== null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>Set Your Focus</Text>
        <Text style={styles.subtitle}>
          Choose your primary pathway. This is where you'll focus most of your daily actions.
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.pathwayList}>
          {selectedPathways.map((id) => {
            const pathway = PATHWAYS[id];
            const isPrimary = primary === id;
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.pathwayCard,
                  isPrimary && { borderColor: pathway.color },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPrimary(id);
                }}
                activeOpacity={0.7}
              >
                {isPrimary && (
                  <LinearGradient
                    colors={pathway.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.selectedGradient}
                  />
                )}
                <View style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.pathwayIcon}>{pathway.icon}</Text>
                    <View>
                      <Text style={styles.pathwayName}>{pathway.name}</Text>
                      <Text style={styles.pathwayDescription}>{pathway.tagline}</Text>
                    </View>
                  </View>
                  {isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryText}>PRIMARY</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Your primary pathway determines your main daily tasks and streak tracking. You can change this anytime.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={() => {
            if (canContinue) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate('CreateProfile', {
                selectedPathways,
                primaryPathway: primary,
              });
            }
          }}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={canContinue ? [colors.primary, colors.primaryDark] : [colors.surfaceLight, colors.surfaceLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={[styles.continueText, !canContinue && styles.continueTextDisabled]}>
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  step: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  pathwayList: {
    padding: spacing.md,
  },
  pathwayCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  selectedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardContent: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pathwayIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  pathwayName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  pathwayDescription: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  primaryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  primaryText: {
    color: colors.text,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    letterSpacing: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  continueText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  continueTextDisabled: {
    color: colors.textTertiary,
  },
});

export default SelectPrimaryScreen;
