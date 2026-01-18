import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { UserProvider } from './src/context/UserContext';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
  },
});
