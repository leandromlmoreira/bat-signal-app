import { useEffect, useMemo } from 'react';
import { Animated } from 'react-native';

import { IGNITION, type FlickerStep } from '../lib/ignition';
import { createRandom } from '../lib/random';
import { easing, nativeDriver } from '../theme/tokens';
import { useAnimatedValue } from './useLoop';

const timing = (value: Animated.Value, toValue: number, duration: number, curve = easing.out) =>
  Animated.timing(value, { toValue, duration, easing: curve, useNativeDriver: nativeDriver });

function stutter(value: Animated.Value, steps: readonly FlickerStep[]) {
  return Animated.sequence(
    steps.map((step, index) => {
      if (index === steps.length - 1) return timing(value, step.level, step.duration, easing.drawer);
      const snap = Math.min(24, step.duration);
      return Animated.sequence([timing(value, step.level, snap, easing.linear), Animated.delay(step.duration - snap)]);
    }),
  );
}

function flickerSequence(value: Animated.Value) {
  const random = createRandom(1939);
  const steps = Array.from({ length: 14 }, () =>
    Animated.timing(value, {
      toValue: random.between(0.86, 1),
      duration: random.between(50, 190),
      easing: easing.linear,
      useNativeDriver: nativeDriver,
    }),
  );
  return Animated.loop(Animated.sequence([...steps, Animated.delay(random.between(300, 900))]));
}

export function useSignalPower(active: boolean, reducedMotion: boolean) {
  const power = useAnimatedValue(0);
  const reach = useAnimatedValue(0);
  const strike = useAnimatedValue(0);
  const flicker = useAnimatedValue(1);

  useEffect(() => {
    if (!active) {
      const shutdown = Animated.parallel([
        timing(power, 0, 520, easing.plunge),
        Animated.sequence([Animated.delay(360), timing(reach, 0, 420)]),
      ]);
      shutdown.start();
      return () => shutdown.stop();
    }

    if (reducedMotion) {
      reach.setValue(1);
      const fade = timing(power, 1, 500);
      fade.start();
      return () => fade.stop();
    }

    const ignition = Animated.parallel([
      Animated.sequence([timing(strike, 1, 50), timing(strike, 0, 620)]),
      timing(reach, 1, 420),
      stutter(power, IGNITION),
    ]);
    ignition.start();
    return () => ignition.stop();
  }, [active, reducedMotion, power, reach, strike]);

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
    () => flicker.interpolate({ inputRange: [0.86, 1], outputRange: [0.92, 1] }),
    [flicker],
  );
  const lit = useMemo(() => Animated.multiply(power, shimmer), [power, shimmer]);

  return { power, reach, strike, shimmer, lit };
}

export type SignalPower = ReturnType<typeof useSignalPower>;
