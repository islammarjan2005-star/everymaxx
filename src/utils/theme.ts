import { PathwayId } from '../types';

export const colors = {
  // Base colors
  background: '#0D0D0F',
  surface: '#1A1A1F',
  surfaceLight: '#252530',
  surfaceLighter: '#32323D',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textTertiary: '#6B6B7B',

  // Accent
  primary: '#6C5CE7',
  primaryLight: '#8B7CF7',
  primaryDark: '#5B4CD6',

  // Status
  success: '#26DE81',
  warning: '#FED330',
  error: '#FC5C65',
  info: '#45AAF2',

  // Pathway colors
  looksmaxx: '#FF6B9D',
  healthmaxx: '#26DE81',
  fitmaxx: '#FD7272',
  socialmaxx: '#A55EEA',
  stylemaxx: '#45AAF2',
  mindsetmaxx: '#FED330',
  moneymaxx: '#2ECC71',

  // Misc
  border: '#2A2A35',
  overlay: 'rgba(0, 0, 0, 0.7)',
  xp: '#FFD700',
  streak: '#FF6B6B',
};

export const pathwayColors: Record<PathwayId, string> = {
  looksmaxx: colors.looksmaxx,
  healthmaxx: colors.healthmaxx,
  fitmaxx: colors.fitmaxx,
  socialmaxx: colors.socialmaxx,
  stylemaxx: colors.stylemaxx,
  mindsetmaxx: colors.mindsetmaxx,
  moneymaxx: colors.moneymaxx,
};

export const pathwayGradients: Record<PathwayId, [string, string]> = {
  looksmaxx: ['#FF6B9D', '#C44569'],
  healthmaxx: ['#26DE81', '#20BF6B'],
  fitmaxx: ['#FD7272', '#EB3B5A'],
  socialmaxx: ['#A55EEA', '#8854D0'],
  stylemaxx: ['#45AAF2', '#2D98DA'],
  mindsetmaxx: ['#FED330', '#F7B731'],
  moneymaxx: ['#2ECC71', '#27AE60'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const difficultyColors = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
};

export const getImpactColor = (score: number): string => {
  if (score >= 8) return colors.success;
  if (score >= 5) return colors.warning;
  return colors.textSecondary;
};
