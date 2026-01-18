import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Gradient } from '../../components/Gradient';
import { haptics } from '../../utils/haptics';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { PATHWAYS, PATHWAY_ORDER } from '../../data/pathways';
import { PathwayId } from '../../types';

const SelectPathwaysScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selected, setSelected] = useState<PathwayId[]>([]);

  const togglePathway = (id: PathwayId) => {
    haptics.impact('light');
    if (selected.includes(id)) {
      setSelected(selected.filter((p) => p !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const canContinue = selected.length >= 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>Choose Your Pathways</Text>
        <Text style={styles.subtitle}>
          Select the areas you want to improve. You can always add more later.
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.pathwayGrid}>
          {PATHWAY_ORDER.map((id) => {
            const pathway = PATHWAYS[id];
            const isSelected = selected.includes(id);
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.pathwayCard,
                  isSelected && { borderColor: pathway.color },
                ]}
                onPress={() => togglePathway(id)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <Gradient
                    colors={[`${pathway.color}20`, `${pathway.color}05`]}
                    style={StyleSheet.absoluteFill}
                  />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.pathwayIcon}>{pathway.icon}</Text>
                  <Text style={[styles.pathwayName, isSelected && { color: pathway.color }]}>
                    {pathway.name}
                  </Text>
                  <Text style={styles.pathwayTagline}>{pathway.tagline}</Text>
                  {isSelected && (
                    <View style={[styles.checkmark, { backgroundColor: pathway.color }]}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectionCount}>
          {selected.length} pathway{selected.length !== 1 ? 's' : ''} selected
        </Text>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={() => {
            if (canContinue) {
              haptics.impact('medium');
              navigation.navigate('SelectPrimary', { selectedPathways: selected });
            }
          }}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Gradient
            colors={canContinue ? [colors.primary, colors.primaryDark] : [colors.surfaceLight, colors.surfaceLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={[styles.continueText, !canContinue && styles.continueTextDisabled]}>
              Continue
            </Text>
          </Gradient>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
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
  pathwayGrid: {
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
  cardContent: {
    padding: spacing.lg,
    position: 'relative',
  },
  pathwayIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  pathwayName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  pathwayTagline: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.text,
    fontWeight: typography.weight.bold,
    fontSize: typography.size.sm,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectionCount: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginBottom: spacing.md,
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

export default SelectPathwaysScreen;
