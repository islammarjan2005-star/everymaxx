import { Platform } from 'react-native';

// Safe haptics wrapper that works on web
export const haptics = {
  impact: async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (Platform.OS === 'web') return;
    try {
      const Haptics = require('expo-haptics');
      const feedbackStyle = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      };
      await Haptics.impactAsync(feedbackStyle[style]);
    } catch (e) {
      // Haptics not available
    }
  },

  notification: async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (Platform.OS === 'web') return;
    try {
      const Haptics = require('expo-haptics');
      const feedbackType = {
        success: Haptics.NotificationFeedbackType.Success,
        warning: Haptics.NotificationFeedbackType.Warning,
        error: Haptics.NotificationFeedbackType.Error,
      };
      await Haptics.notificationAsync(feedbackType[type]);
    } catch (e) {
      // Haptics not available
    }
  },

  selection: async () => {
    if (Platform.OS === 'web') return;
    try {
      const Haptics = require('expo-haptics');
      await Haptics.selectionAsync();
    } catch (e) {
      // Haptics not available
    }
  },
};
