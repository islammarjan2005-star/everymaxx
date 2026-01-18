import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { useUser } from '../context/UserContext';
import { colors, typography } from '../utils/theme';
import { RootStackParamList, MainTabParamList } from './types';

// Onboarding Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SelectPathwaysScreen from '../screens/onboarding/SelectPathwaysScreen';
import SelectPrimaryScreen from '../screens/onboarding/SelectPrimaryScreen';
import CreateProfileScreen from '../screens/onboarding/CreateProfileScreen';

// Main Screens
import DashboardScreen from '../screens/main/DashboardScreen';
import PathwaysScreen from '../screens/main/PathwaysScreen';
import PathwayDetailScreen from '../screens/main/PathwayDetailScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AchievementsScreen from '../screens/main/AchievementsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const OnboardingStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator();
const PathwaysStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TabIcon: React.FC<{ icon: string; focused: boolean; color: string }> = ({
  icon,
  focused,
}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{icon}</Text>
);

const DashboardNavigator = () => (
  <DashboardStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
  </DashboardStack.Navigator>
);

const PathwaysNavigator = () => (
  <PathwaysStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <PathwaysStack.Screen name="PathwaysList" component={PathwaysScreen} />
    <PathwaysStack.Screen name="PathwayDetail" component={PathwayDetailScreen} />
  </PathwaysStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    <ProfileStack.Screen name="Achievements" component={AchievementsScreen} />
  </ProfileStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={DashboardNavigator}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon icon="🎯" focused={focused} color={color} />
        ),
        tabBarLabel: 'Today',
      }}
    />
    <Tab.Screen
      name="Pathways"
      component={PathwaysNavigator}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon icon="🚀" focused={focused} color={color} />
        ),
        tabBarLabel: 'Pathways',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{
        tabBarIcon: ({ focused, color }) => (
          <TabIcon icon="👤" focused={focused} color={color} />
        ),
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

const OnboardingNavigator = () => (
  <OnboardingStack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
    <OnboardingStack.Screen name="SelectPathways" component={SelectPathwaysScreen} />
    <OnboardingStack.Screen name="SelectPrimary" component={SelectPrimaryScreen} />
    <OnboardingStack.Screen name="CreateProfile" component={CreateProfileScreen} />
  </OnboardingStack.Navigator>
);

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.loadingText}>Loading EveryMaxx...</Text>
  </View>
);

export const AppNavigator: React.FC = () => {
  const { loading, hasOnboarded, user } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!hasOnboarded || !user ? (
          <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <RootStack.Screen name="Main" component={MainTabs} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
    marginTop: 16,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
  },
  tabIcon: {
    fontSize: 24,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
});
