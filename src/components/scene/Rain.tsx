import { memo, useMemo } from 'react';
import { Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useLoop } from '../../hooks/useLoop';
import { buildRainPaths } from '../../lib/rain';

const BAND_OPACITY = [1, 0.62, 0.34];

export interface RainStyle {
  density: number;
  minLength: number;
  maxLength: number;
  seed: number;
  color: string;
  strokeWidth: number;
  centered?: boolean;
}

interface RainSheetProps extends RainStyle {
  width: number;
  height: number;
  progress: Animated.Value;
}

function RainSheetView({ width, height, progress, color, strokeWidth, ...shape }: RainSheetProps) {
  const { density, minLength, maxLength, seed, centered } = shape;
  const bands = useMemo(
    () => buildRainPaths({ width, height, density, minLength, maxLength, seed, centered }),
    [width, height, density, minLength, maxLength, seed, centered],
  );
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, height] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top: -height, width, height: height * 2, transform: [{ translateY }] }}
    >
      <Svg width={width} height={height * 2}>
        {bands.map((d, band) => (
          <Path
            key={band}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={BAND_OPACITY[band]}
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

export const RainSheet = memo(RainSheetView);

interface RainProps extends RainStyle {
  width: number;
  height: number;
  angle: number;
  opacity: number;
  speed: number;
  animated: boolean;
}

function RainView({ width, height, angle, opacity, speed, animated, ...style }: RainProps) {
  const size = Math.ceil(Math.hypot(width, height)) + 60;
  const progress = useLoop((size / speed) * 1000, animated);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: (width - size) / 2,
        top: (height - size) / 2,
        width: size,
        height: size,
        opacity,
        overflow: 'hidden',
        transform: [{ rotate: `${angle}deg` }],
      }}
    >
      <RainSheet width={size} height={size} progress={progress} {...style} />
    </Animated.View>
  );
}

export const Rain = memo(RainView);
