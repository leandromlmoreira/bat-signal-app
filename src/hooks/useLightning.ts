import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { nextStrikeDelay } from '../lib/lightning';
import { createRandom } from '../lib/random';
import { easing, nativeDriver } from '../theme/tokens';
import { useAnimatedValue } from './useLoop';

export interface Strike {
  seed: number;
  position: number;
  distance: number;
}

const FIRST_STRIKE_MS = 3800;

const step = (value: Animated.Value, toValue: number, duration: number, curve = easing.linear) =>
  Animated.timing(value, { toValue, duration, easing: curve, useNativeDriver: nativeDriver });

function strikeSequence(flash: Animated.Value, bolt: Animated.Value) {
  return Animated.parallel([
    Animated.sequence([step(flash, 1, 40), step(flash, 0.18, 90), step(flash, 0.85, 45), step(flash, 0, 900, easing.out)]),
    Animated.sequence([step(bolt, 1, 30), step(bolt, 0.25, 80), step(bolt, 1, 40), step(bolt, 0, 320, easing.out)]),
  ]);
}

export function useLightning(enabled: boolean, onStrike?: (strike: Strike) => void) {
  const flash = useAnimatedValue(0);
  const bolt = useAnimatedValue(0);
  const [strike, setStrike] = useState<Strike | null>(null);
  const callback = useRef(onStrike);

  useEffect(() => {
    callback.current = onStrike;
  }, [onStrike]);

  useEffect(() => {
    if (!enabled) {
      flash.setValue(0);
      bolt.setValue(0);
      return;
    }
    const random = createRandom(Date.now() % 100000);
    let timer: ReturnType<typeof setTimeout>;
    let running: Animated.CompositeAnimation | null = null;

    const fire = () => {
      const next = { seed: Math.floor(random.next() * 1e6), position: random.between(0.08, 0.92), distance: random.next() };
      setStrike(next);
      running = strikeSequence(flash, bolt);
      running.start();
      const thunderDelay = 350 + next.distance * 1500;
      setTimeout(() => callback.current?.(next), thunderDelay);
      timer = setTimeout(fire, nextStrikeDelay(random));
    };

    timer = setTimeout(fire, FIRST_STRIKE_MS);
    return () => {
      clearTimeout(timer);
      running?.stop();
    };
  }, [enabled, flash, bolt]);

  return { flash, bolt, strike };
}
