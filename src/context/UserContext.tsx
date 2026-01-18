import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PathwayId, Task } from '../types';
import {
  loadUser,
  saveUser,
  createNewUser,
  markTaskComplete,
  isOnboarded,
  setOnboarded,
  clearAllData,
} from '../utils/storage';

interface UserContextType {
  user: User | null;
  loading: boolean;
  hasOnboarded: boolean;
  initializeUser: (username: string, pathways: PathwayId[], primary: PathwayId) => Promise<void>;
  completeTask: (task: Task) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updateSettings: (settings: Partial<User['settings']>) => Promise<void>;
  addPathway: (pathwayId: PathwayId) => Promise<void>;
  setPrimaryPathway: (pathwayId: PathwayId) => Promise<void>;
  resetProgress: () => Promise<void>;
  getTodayCompletedTasks: () => string[];
  getCurrentStreak: () => number;
  getTotalXp: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [loadedUser, onboarded] = await Promise.all([
          loadUser(),
          isOnboarded(),
        ]);
        setUser(loadedUser);
        setHasOnboarded(onboarded);
      } catch (error) {
        console.error('Error initializing user context:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const initializeUser = async (
    username: string,
    pathways: PathwayId[],
    primary: PathwayId
  ) => {
    const newUser = createNewUser(username, pathways, primary);
    await saveUser(newUser);
    await setOnboarded(true);
    setUser(newUser);
    setHasOnboarded(true);
  };

  const completeTask = async (task: Task) => {
    if (!user) return;
    const updatedUser = markTaskComplete(user, task.id, task.pathwayId, task.xpReward);
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;
    if (user.achievements.includes(achievementId)) return;

    const updatedUser = {
      ...user,
      achievements: [...user.achievements, achievementId],
    };
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const updateSettings = async (settings: Partial<User['settings']>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      settings: { ...user.settings, ...settings },
    };
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const addPathway = async (pathwayId: PathwayId) => {
    if (!user) return;
    if (user.selectedPathways.includes(pathwayId)) return;

    const updatedUser = {
      ...user,
      selectedPathways: [...user.selectedPathways, pathwayId],
      progress: {
        ...user.progress,
        [pathwayId]: {
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
        },
      },
    };
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const setPrimaryPathway = async (pathwayId: PathwayId) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      primaryPathway: pathwayId,
    };
    await saveUser(updatedUser);
    setUser(updatedUser);
  };

  const resetProgress = async () => {
    await clearAllData();
    setUser(null);
    setHasOnboarded(false);
  };

  const getTodayCompletedTasks = (): string[] => {
    if (!user) return [];
    const today = new Date().toISOString().split('T')[0];
    return user.dailyTasksCompleted[today] || [];
  };

  const getCurrentStreak = (): number => {
    if (!user) return 0;
    const primaryProgress = user.progress[user.primaryPathway];
    return primaryProgress?.currentStreak || 0;
  };

  const getTotalXp = (): number => {
    if (!user) return 0;
    return Object.values(user.progress).reduce((sum, p) => sum + p.totalXp, 0);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        hasOnboarded,
        initializeUser,
        completeTask,
        unlockAchievement,
        updateSettings,
        addPathway,
        setPrimaryPathway,
        resetProgress,
        getTodayCompletedTasks,
        getCurrentStreak,
        getTotalXp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
