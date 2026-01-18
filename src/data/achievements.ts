import { Achievement, PathwayId } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Complete tasks for 3 days in a row',
    icon: '🔥',
    xpReward: 50,
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    xpReward: 100,
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak-14',
    name: 'Two Week Terror',
    description: 'Maintain a 14-day streak',
    icon: '💪',
    xpReward: 200,
    requirement: { type: 'streak', value: 14 },
  },
  {
    id: 'streak-30',
    name: 'Monthly Maxxer',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    xpReward: 500,
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'streak-100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    icon: '👑',
    xpReward: 1000,
    requirement: { type: 'streak', value: 100 },
  },

  // Task completion achievements
  {
    id: 'tasks-10',
    name: 'First Steps',
    description: 'Complete 10 tasks',
    icon: '🎯',
    xpReward: 50,
    requirement: { type: 'tasks_completed', value: 10 },
  },
  {
    id: 'tasks-50',
    name: 'Consistent',
    description: 'Complete 50 tasks',
    icon: '📈',
    xpReward: 150,
    requirement: { type: 'tasks_completed', value: 50 },
  },
  {
    id: 'tasks-100',
    name: 'Dedicated',
    description: 'Complete 100 tasks',
    icon: '💎',
    xpReward: 300,
    requirement: { type: 'tasks_completed', value: 100 },
  },
  {
    id: 'tasks-500',
    name: 'Elite',
    description: 'Complete 500 tasks',
    icon: '🌟',
    xpReward: 750,
    requirement: { type: 'tasks_completed', value: 500 },
  },
  {
    id: 'tasks-1000',
    name: 'Legendary',
    description: 'Complete 1000 tasks',
    icon: '🔱',
    xpReward: 1500,
    requirement: { type: 'tasks_completed', value: 1000 },
  },

  // Level achievements
  {
    id: 'level-5',
    name: 'Rising',
    description: 'Reach level 5 in any pathway',
    icon: '📊',
    xpReward: 100,
    requirement: { type: 'level', value: 5 },
  },
  {
    id: 'level-10',
    name: 'Advancing',
    description: 'Reach level 10 in any pathway',
    icon: '🚀',
    xpReward: 250,
    requirement: { type: 'level', value: 10 },
  },
  {
    id: 'level-25',
    name: 'Expert',
    description: 'Reach level 25 in any pathway',
    icon: '🎖️',
    xpReward: 500,
    requirement: { type: 'level', value: 25 },
  },
  {
    id: 'level-50',
    name: 'Master',
    description: 'Reach level 50 in any pathway',
    icon: '🏅',
    xpReward: 1000,
    requirement: { type: 'level', value: 50 },
  },

  // Pathway-specific achievements
  {
    id: 'looksmaxx-start',
    name: 'Glow Up Initiated',
    description: 'Complete your first Looksmaxx task',
    icon: '✨',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'looksmaxx' },
  },
  {
    id: 'healthmaxx-start',
    name: 'Foundation Layer',
    description: 'Complete your first Healthmaxx task',
    icon: '💚',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'healthmaxx' },
  },
  {
    id: 'fitmaxx-start',
    name: 'Gains Incoming',
    description: 'Complete your first Fitmaxx task',
    icon: '💪',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'fitmaxx' },
  },
  {
    id: 'socialmaxx-start',
    name: 'Connection Made',
    description: 'Complete your first Socialmaxx task',
    icon: '🗣️',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'socialmaxx' },
  },
  {
    id: 'stylemaxx-start',
    name: 'Style Unlocked',
    description: 'Complete your first Stylemaxx task',
    icon: '👔',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'stylemaxx' },
  },
  {
    id: 'mindsetmaxx-start',
    name: 'Mind Engaged',
    description: 'Complete your first Mindsetmaxx task',
    icon: '🧠',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'mindsetmaxx' },
  },
  {
    id: 'moneymaxx-start',
    name: 'Wealth Building',
    description: 'Complete your first Moneymaxx task',
    icon: '💰',
    xpReward: 25,
    requirement: { type: 'tasks_completed', value: 1, pathwayId: 'moneymaxx' },
  },

  // Multi-pathway
  {
    id: 'multi-path-3',
    name: 'Diversified',
    description: 'Complete tasks in 3 different pathways',
    icon: '🎨',
    xpReward: 150,
    requirement: { type: 'tasks_completed', value: 3 },
  },
  {
    id: 'all-paths',
    name: 'Renaissance',
    description: 'Complete tasks in all 7 pathways',
    icon: '🌈',
    xpReward: 500,
    requirement: { type: 'tasks_completed', value: 7 },
  },
];

export const getAchievement = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id);
};

export const getUnlockedAchievements = (unlockedIds: string[]): Achievement[] => {
  return ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id));
};

export const getLockedAchievements = (unlockedIds: string[]): Achievement[] => {
  return ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id));
};
