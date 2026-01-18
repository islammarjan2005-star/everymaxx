import React from 'react';
import { View, ViewStyle } from 'react-native';

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
  // Calculate CSS gradient direction from start/end points
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;

  const webStyle = {
    ...style,
    background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
  };

  return (
    <View style={webStyle as any}>
      {children}
    </View>
  );
};

export default Gradient;
