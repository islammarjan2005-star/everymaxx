import { PathwayId, Task } from '../types';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  SelectPathways: undefined;
  SelectPrimary: { selectedPathways: PathwayId[] };
  CreateProfile: { selectedPathways: PathwayId[]; primaryPathway: PathwayId };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Pathways: undefined;
  Profile: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  TaskDetail: { task: Task };
};

export type PathwaysStackParamList = {
  PathwaysList: undefined;
  PathwayDetail: { pathwayId: PathwayId };
  SkillDetail: { pathwayId: PathwayId; skillId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Achievements: undefined;
  Settings: undefined;
  Stats: undefined;
};
