import { useEffect, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

import { useAnimatedValue } from '../../hooks/useLoop';
import { easing, nativeDriver } from '../../theme/tokens';

interface RevealProps {
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function Reveal({ delay = 0, distance = 16, duration = 900, style, children }: RevealProps) {
  const progress = useAnimatedValue(0);

  useEffect(() => {
    const entrance = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: easing.out,
      useNativeDriver: nativeDriver,
    });
    entrance.start();
    return () => entrance.stop();
  }, [progress, delay, duration]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] });

  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
