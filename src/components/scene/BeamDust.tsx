import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useLoop, useSwing } from '../../hooks/useLoop';
import { motesPath, scatterDust } from '../../lib/dust';

interface BeamDustProps {
  width: number;
  length: number;
  topWidth: number;
  baseWidth: number;
  scale: number;
  animated: boolean;
}

const GROUPS = 3;
const TWINKLE = [
  [1, 0.15, 0.55, 1],
  [0.55, 1, 0.15, 0.55],
  [0.15, 0.55, 1, 0.15],
];

function BeamDustView({ width, length, topWidth, baseWidth, scale, animated }: BeamDustProps) {
  const twinkle = useLoop(5200, animated);
  const float = useSwing(11000, animated);
  const groups = useMemo(() => {
    const motes = scatterDust({
      width,
      length,
      topWidth,
      baseWidth,
      count: Math.round(Math.min(220, length / 3.2)),
      groups: GROUPS,
      minRadius: 0.45 * scale,
      maxRadius: 1.5 * scale,
      seed: 404,
    });
    return Array.from({ length: GROUPS }, (_, group) => motesPath(motes.filter((mote) => mote.group === group)));
  }, [width, length, topWidth, baseWidth, scale]);

  const translateY = float.interpolate({ inputRange: [-1, 1], outputRange: [10 * scale, -10 * scale] });
  const translateX = float.interpolate({ inputRange: [-1, 0, 1], outputRange: [-3, 2, -1] });

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateX }, { translateY }] }]}>
      {groups.map((path, group) => (
        <Animated.View
          key={group}
          style={[
            StyleSheet.absoluteFill,
            { opacity: twinkle.interpolate({ inputRange: [0, 0.33, 0.66, 1], outputRange: TWINKLE[group] }) },
          ]}
        >
          <Svg width={width} height={length}>
            <Path d={path} fill="#FFF3D0" opacity={0.85} />
          </Svg>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

export const BeamDust = memo(BeamDustView);
