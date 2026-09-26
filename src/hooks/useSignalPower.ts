import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

import { createRandom } from '../lib/random';
import { easing, nativeDriver } from '../theme/tokens';
import { useAnimatedValue } from './useLoop';

const timing = (value: Animated.Value, toValue: number, duration: number) =>
  Animated.timing(value, { toValue, duration, easing: easing.out, useNativeDriver: nativeDriver });

function flickerSequence(value: Animated.Value) {
  const random = createRandom(1939);
  const steps = Array.from({ length: 14 }, () =>
    Animated.timing(value, {
      toValue: random.between(0.84, 1),
      duration: random.between(50, 190),
      easing: easing.linear,
      useNativeDriver: nativeDriver,
    }),
  );
  return Animated.loop(Animated.sequence([...steps, Animated.delay(random.between(300, 900))]));
}

export function useSignalPower(active: boolean, reducedMotion: boolean) {
  const power = useAnimatedValue(0);
  const strike = useAnimatedValue(0);
  const flicker = useAnimatedValue(1);

  useEffect(() => {
    if (!active) {
      const shutdown = timing(power, 0, 460);
      shutdown.start();
      return () => shutdown.stop();
    }

    if (reducedMotion) {
      const fade = timing(power, 1, 500);
      fade.start();
      return () => fade.stop();
    }

    const ignition = Animated.parallel([
      Animated.sequence([timing(strike, 1, 70), timing(strike, 0, 700)]),
      Animated.sequence([
        timing(power, 0.6, 60),
        timing(power, 0.14, 90),
        Animated.timing(power, { toValue: 1, duration: 1200, easing: easing.drawer, useNativeDriver: nativeDriver }),
      ]),
    ]);
    ignition.start();
    return () => ignition.stop();
  }, [active, reducedMotion, power, strike]);

  useEffect(() => {
    if (!active || reducedMotion) {
      flicker.setValue(1);
      return;
    }
    const loop = flickerSequence(flicker);
    loop.start();
    return () => loop.stop();
  }, [active, reducedMotion, flicker]);

  const shimmer = useMemo(
    () => flicker.interpolate({ inputRange: [0.84, 1], outputRange: [0.9, 1] }),
    [flicker],
  );
  const lit = useMemo(() => Animated.multiply(power, shimmer), [power, shimmer]);

  return { power, strike, shimmer, lit };
}

export type SignalPower = ReturnType<typeof useSignalPower>;
