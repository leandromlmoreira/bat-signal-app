import type { ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface AreaStageProps {
  visible: boolean;
  progress: Animated.Value;
  children: ReactNode;
}

export function AreaStage({ visible, progress, children }: AreaStageProps) {
  const opacity = progress.interpolate({ inputRange: [0, 0.7, 1, 2], outputRange: [1, 0.2, 0, 1], extrapolate: 'clamp' });
  const scale = progress.interpolate({ inputRange: [0, 1, 1, 2], outputRange: [1, 1.06, 0.97, 1], extrapolate: 'clamp' });

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      aria-hidden={!visible}
      style={[StyleSheet.absoluteFill, visible ? { opacity, transform: [{ scale }] } : styles.hidden]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});
