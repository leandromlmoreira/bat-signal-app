import { useEffect, useState } from 'react';
import { Animated, type EasingFunction } from 'react-native';

import { easing, nativeDriver } from '../theme/tokens';

export function useAnimatedValue(initial = 0) {
  const [value] = useState(() => new Animated.Value(initial));
  return value;
}

export function useLoop(duration: number, enabled: boolean, curve: EasingFunction = easing.linear) {
  const value = useAnimatedValue(0);

  useEffect(() => {
    if (!enabled) return;
    value.setValue(0);
    const loop = Animated.loop(
      Animated.timing(value, { toValue: 1, duration, easing: curve, useNativeDriver: nativeDriver }),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, enabled, curve]);

  return value;
}

export function useSwing(duration: number, enabled: boolean) {
  const value = useAnimatedValue(0);

  useEffect(() => {
    if (!enabled) return;
    const half = duration / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: half, easing: easing.drift, useNativeDriver: nativeDriver }),
        Animated.timing(value, { toValue: -1, duration: half, easing: easing.drift, useNativeDriver: nativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration, enabled]);

  return value;
}

export function useBlink(onFor: number, offFor: number, enabled: boolean, offset = 0) {
  const value = useAnimatedValue(1);

  useEffect(() => {
    if (!enabled) {
      value.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(onFor),
        Animated.timing(value, { toValue: 0, duration: 90, easing: easing.out, useNativeDriver: nativeDriver }),
        Animated.delay(offFor),
        Animated.timing(value, { toValue: 1, duration: 140, easing: easing.out, useNativeDriver: nativeDriver }),
      ]),
    );
    const timer = setTimeout(() => loop.start(), offset);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [value, onFor, offFor, enabled, offset]);

  return value;
}
