import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, PathwayId, UserProgress, UserSettings, calculateLevelFromXp } from '../types';

const STORAGE_KEYS = {
  USER: '@everymaxx_user',
  ONBOARDED: '@everymaxx_onboarded',
} as const;

const DEFAULT_SETTINGS: UserSettings = {
  notifications: true,
  dailyReminder: '09:00',
  privacyMode: false,
  hapticFeedback: true,
  theme: 'dark',
};

const createDefaultProgress = (pathwayId: PathwayId): UserProgress => ({
  pathwayId,
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  totalXp: 0,
  tasksCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  skillProgress: {},
  unlockedSkills: [],
  metrics: [],
});

export const createNewUser = (
  username: string,
  selectedPathways: PathwayId[],
  primaryPathway: PathwayId
): User => {
  const progress: Record<PathwayId, UserProgress> = {} as Record<PathwayId, UserProgress>;

  selectedPathways.forEach((pathwayId) => {
    progress[pathwayId] = createDefaultProgress(pathwayId);
  });

  return {
    id: generateUserId(),
    username,
    createdAt: new Date().toISOString(),
    selectedPathways,
    primaryPathway,
    progress,
    achievements: [],
    totalLevel: 1,
    settings: DEFAULT_SETTINGS,
    dailyTasksCompleted: {},
    streakStartDate: new Date().toISOString().split('T')[0],
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
};

const generateUserId = (): string => {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

export const loadUser = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
};

export const isOnboarded = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarded status:', error);
    return false;
  }
};

export const setOnboarded = async (value: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDED, value.toString());
  } catch (error) {
    console.error('Error setting onboarded status:', error);
    throw error;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ONBOARDED]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Helper to add XP and recalculate levels
export const addXpToPathway = (
  user: User,
  pathwayId: PathwayId,
  xp: number
): User => {
  const progress = user.progress[pathwayId];
  if (!progress) return user;

  const newTotalXp = progress.totalXp + xp;
  const levelInfo = calculateLevelFromXp(newTotalXp);

  const updatedProgress: UserProgress = {
    ...progress,
    totalXp: newTotalXp,
    level: levelInfo.level,
    currentXp: levelInfo.currentXp,
    xpToNextLevel: levelInfo.xpToNext,
  };

  // Calculate new total level across all pathways
  const newProgress = { ...user.progress, [pathwayId]: updatedProgress };
  const totalLevel = Object.values(newProgress).reduce((sum, p) => sum + p.level, 0);

  return {
    ...user,
    progress: newProgress,
    totalLevel,
  };
};

// Helper to mark task complete
export const markTaskComplete = (
  user: User,
  taskId: string,
  pathwayId: PathwayId,
  xpReward: number
): User => {
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = user.dailyTasksCompleted[today] || [];

  // Don't double count
  if (todayTasks.includes(taskId)) return user;

  // Add XP
  let updatedUser = addXpToPathway(user, pathwayId, xpReward);

  // Update task completion
  const progress = updatedUser.progress[pathwayId];
  if (progress) {
    updatedUser.progress[pathwayId] = {
      ...progress,
      tasksCompleted: progress.tasksCompleted + 1,
    };
  }

  // Update daily tasks
  updatedUser.dailyTasksCompleted = {
    ...updatedUser.dailyTasksCompleted,
    [today]: [...todayTasks, taskId],
  };

  // Update streak
  updatedUser = updateStreak(updatedUser);

  return updatedUser;
};

// Helper to update streak
export const updateStreak = (user: User): User => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const primaryProgress = user.progress[user.primaryPathway];
  if (!primaryProgress) return user;

  let newStreak = primaryProgress.currentStreak;

  // If last active was yesterday, continue streak
  if (user.lastActiveDate === yesterday) {
    newStreak = primaryProgress.currentStreak + 1;
  } else if (user.lastActiveDate !== today) {
    // If not today and not yesterday, reset streak
    newStreak = 1;
  }

  const longestStreak = Math.max(primaryProgress.longestStreak, newStreak);

  return {
    ...user,
    lastActiveDate: today,
    progress: {
      ...user.progress,
      [user.primaryPathway]: {
        ...primaryProgress,
        currentStreak: newStreak,
        longestStreak,
      },
    },
  };
};
