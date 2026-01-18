// Haptics wrapper - no-op for web
export const haptics = {
  impact: async (_style?: 'light' | 'medium' | 'heavy') => {},
  notification: async (_type?: 'success' | 'warning' | 'error') => {},
  selection: async () => {},
};
