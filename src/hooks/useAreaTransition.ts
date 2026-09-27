import { useEffect, useRef, useState } from 'react';
import { Animated, type EasingFunction } from 'react-native';

import { easing, nativeDriver } from '../theme/tokens';
import type { Area } from './useAreaRoute';
import { useAnimatedValue } from './useLoop';

const COVER_MS = 480;
const REVEAL_MS = 560;
const SETTLE_MS = 240;
const REDUCED_FACTOR = 0.35;

export function useAreaTransition(area: Area, reducedMotion: boolean) {
  const progress = useAnimatedValue(0);
  const [shown, setShown] = useState(area);
  const shownRef = useRef(area);

  useEffect(() => {
    const factor = reducedMotion ? REDUCED_FACTOR : 1;
    const run = (toValue: number, duration: number, curve: EasingFunction) =>
      Animated.timing(progress, { toValue, duration: duration * factor, easing: curve, useNativeDriver: nativeDriver });

    progress.stopAnimation((value) => {
      if (value > 1) progress.setValue(2 - value);
    });

    if (area === shownRef.current) {
      run(0, SETTLE_MS, easing.out).start();
      return;
    }

    run(1, COVER_MS, easing.linear).start(({ finished }) => {
      if (!finished) return;
      shownRef.current = area;
      setShown(area);
      run(2, REVEAL_MS, easing.out).start(({ finished: revealed }) => {
        if (revealed) progress.setValue(0);
      });
    });
  }, [area, progress, reducedMotion]);

  return { shown, progress };
}

export type AreaProgress = Animated.Value;
