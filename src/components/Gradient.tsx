import React from 'react';
import { View, Platform, StyleSheet, ViewStyle } from 'react-native';

interface GradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Gradient: React.FC<GradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
  children,
}) => {
  if (Platform.OS === 'web') {
    // Calculate CSS gradient direction
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;
    const gradientStyle = {
      background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
    };

    return (
      <View style={[style, gradientStyle as any]}>
        {children}
      </View>
    );
  }

  // For native, use expo-linear-gradient
  const { LinearGradient } = require('expo-linear-gradient');
  return (
    <LinearGradient colors={colors} start={start} end={end} style={style}>
      {children}
    </LinearGradient>
  );
};

export default Gradient;
