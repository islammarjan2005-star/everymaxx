import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Gradient } from '../../components/Gradient';
import { colors, spacing, typography, borderRadius } from '../../utils/theme';

const { width } = Dimensions.get('window');

const WelcomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.logo}>EVERYMAXX</Text>
          <Text style={styles.tagline}>Level Up Your Life</Text>
        </View>

        {/* Pathway Preview */}
        <View style={styles.pathwayPreview}>
          <View style={styles.pathwayRow}>
            <PathwayBadge emoji="✨" label="Looks" color="#FF6B9D" />
            <PathwayBadge emoji="💚" label="Health" color="#26DE81" />
            <PathwayBadge emoji="💪" label="Fitness" color="#FD7272" />
          </View>
          <View style={styles.pathwayRow}>
            <PathwayBadge emoji="🗣️" label="Social" color="#A55EEA" />
            <PathwayBadge emoji="👔" label="Style" color="#45AAF2" />
          </View>
          <View style={styles.pathwayRow}>
            <PathwayBadge emoji="🧠" label="Mindset" color="#FED330" />
            <PathwayBadge emoji="💰" label="Money" color="#2ECC71" />
          </View>
        </View>

        {/* Value Props */}
        <View style={styles.valueProps}>
          <ValueProp icon="🎯" text="Science-backed micro-actions" />
          <ValueProp icon="📈" text="Track measurable progress" />
          <ValueProp icon="🏆" text="Gamified skill trees" />
          <ValueProp icon="🤖" text="AI-powered coaching" />
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('SelectPathways')}
          activeOpacity={0.8}
        >
          <Gradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Start Your Journey</Text>
          </Gradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Self-improvement without toxicity
        </Text>
      </View>
    </SafeAreaView>
  );
};

const PathwayBadge: React.FC<{ emoji: string; label: string; color: string }> = ({
  emoji,
  label,
  color,
}) => (
  <View style={[styles.badge, { borderColor: color }]}>
    <Text style={styles.badgeEmoji}>{emoji}</Text>
    <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
  </View>
);

const ValueProp: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <View style={styles.valueProp}>
    <Text style={styles.valuePropIcon}>{icon}</Text>
    <Text style={styles.valuePropText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: typography.size.display,
    fontWeight: typography.weight.bold,
    color: colors.text,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: typography.size.lg,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  pathwayPreview: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pathwayRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.surface,
  },
  badgeEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  badgeLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  valueProps: {
    marginBottom: spacing.xl,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  valuePropIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  valuePropText: {
    fontSize: typography.size.md,
    color: colors.textSecondary,
  },
  ctaButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  ctaGradient: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  disclaimer: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.size.sm,
  },
});

export default WelcomeScreen;
