import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';
import { useUser } from '../../context/UserContext';
import { PathwayId } from '../../types';
import { PATHWAYS } from '../../data/pathways';

const CreateProfileScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { selectedPathways, primaryPathway } = route.params;
  const { initializeUser } = useUser();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const canContinue = username.trim().length >= 2;

  const handleComplete = async () => {
    if (!canContinue || loading) return;

    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      await initializeUser(username.trim(), selectedPathways, primaryPathway);
      // Navigation will happen automatically due to context update
    } catch (error) {
      console.error('Error creating profile:', error);
      setLoading(false);
    }
  };

  const primary = PATHWAYS[primaryPathway];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>
            Almost there! Enter a username to track your progress.
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a username"
              placeholderTextColor={colors.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
            <Text style={styles.inputHint}>This is just for you. No account required.</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Setup</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Primary Focus</Text>
              <View style={[styles.pathwayBadge, { backgroundColor: `${primary.color}20` }]}>
                <Text style={styles.badgeEmoji}>{primary.icon}</Text>
                <Text style={[styles.badgeText, { color: primary.color }]}>
                  {primary.name}
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Active Pathways</Text>
              <Text style={styles.summaryValue}>{selectedPathways.length}</Text>
            </View>

            <View style={styles.pathwayIcons}>
              {selectedPathways.map((id) => (
                <Text key={id} style={styles.pathwayIcon}>
                  {PATHWAYS[id].icon}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleComplete}
            disabled={!canContinue || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={canContinue ? [colors.primary, colors.primaryDark] : [colors.surfaceLight, colors.surfaceLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueGradient}
            >
              <Text style={[styles.continueText, !canContinue && styles.continueTextDisabled]}>
                {loading ? 'Creating...' : 'Start Maxxing'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontWeight: typography.weight.semibold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.size.lg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputHint: {
    fontSize: typography.size.sm,
    color: colors.textTertiary,
    marginTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.size.md,
    color: colors.text,
    fontWeight: typography.weight.semibold,
  },
  pathwayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeEmoji: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
  },
  pathwayIcons: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  pathwayIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
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

export default CreateProfileScreen;
