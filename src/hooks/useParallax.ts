import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

import { isWeb } from '../theme/tokens';
import { useAnimatedValue, useSwing } from './useLoop';

function usePointerTilt(enabled: boolean) {
  const tilt = useAnimatedValue(0);

  useEffect(() => {
    if (!enabled || !isWeb || typeof window === 'undefined') return;
    const handleMove = (event: PointerEvent) => {
      const toValue = (event.clientX / window.innerWidth) * 2 - 1;
      Animated.spring(tilt, { toValue, stiffness: 36, damping: 16, mass: 1, useNativeDriver: false }).start();
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [enabled, tilt]);

  return tilt;
}

export function useParallax(enabled: boolean) {
  const drift = useSwing(28000, enabled);
  const tilt = usePointerTilt(enabled);
  const combined = useMemo(() => Animated.add(drift, tilt), [drift, tilt]);

  return useMemo(
    () => (amplitude: number) =>
      combined.interpolate({
        inputRange: [-2, 2],
        outputRange: [amplitude, -amplitude],
        extrapolate: 'clamp',
      }),
    [combined],
  );
}
