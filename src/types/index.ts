// EveryMaxx Core Types

export type PathwayId =
  | 'looksmaxx'
  | 'healthmaxx'
  | 'fitmaxx'
  | 'socialmaxx'
  | 'stylemaxx'
  | 'mindsetmaxx'
  | 'moneymaxx';

export interface Pathway {
  id: PathwayId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  categories: Category[];
  metrics: MetricDefinition[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  xpRequired: number;
  unlocked: boolean;
  tasks: Task[];
  prerequisites?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'one-time' | 'habit';
  xpReward: number;
  duration?: string; // e.g., "5 min", "15 min"
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  pathwayId: PathwayId;
  scienceTip?: string;
  impactScore: number; // 1-10, ROI indicator
}

export interface UserTask extends Task {
  completed: boolean;
  completedAt?: string;
  streak?: number;
}

export interface MetricDefinition {
  id: string;
  name: string;
  unit: string;
  icon: string;
  description: string;
  trackingType: 'numeric' | 'scale' | 'boolean' | 'photo';
}

export interface MetricEntry {
  metricId: string;
  value: number | boolean | string;
  timestamp: string;
  note?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  requirement: {
    type: 'streak' | 'tasks_completed' | 'level' | 'pathway_complete' | 'metric_milestone';
    value: number;
    pathwayId?: PathwayId;
  };
}

export interface UserProgress {
  pathwayId: PathwayId;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  skillProgress: Record<string, number>; // skillId -> current XP
  unlockedSkills: string[];
  metrics: MetricEntry[];
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  selectedPathways: PathwayId[];
  primaryPathway: PathwayId;
  progress: Record<PathwayId, UserProgress>;
  achievements: string[]; // achievement IDs
  totalLevel: number;
  settings: UserSettings;
  dailyTasksCompleted: Record<string, string[]>; // date -> task IDs
  streakStartDate?: string;
  lastActiveDate?: string;
}

export interface UserSettings {
  notifications: boolean;
  dailyReminder: string; // time like "09:00"
  privacyMode: boolean;
  hapticFeedback: boolean;
  theme: 'dark' | 'light' | 'system';
}

export interface DailyPlan {
  date: string;
  tasks: UserTask[];
  focusPathway: PathwayId;
  motivationalQuote: string;
  estimatedTime: string;
  xpPotential: number;
}

// Level calculation constants
export const LEVEL_XP_BASE = 100;
export const LEVEL_XP_MULTIPLIER = 1.5;

export const calculateXpForLevel = (level: number): number => {
  return Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, level - 1));
};

export const calculateLevelFromXp = (totalXp: number): { level: number; currentXp: number; xpToNext: number } => {
  let level = 1;
  let xpNeeded = calculateXpForLevel(level);
  let remainingXp = totalXp;

  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = calculateXpForLevel(level);
  }

  return {
    level,
    currentXp: remainingXp,
    xpToNext: xpNeeded,
  };
};
