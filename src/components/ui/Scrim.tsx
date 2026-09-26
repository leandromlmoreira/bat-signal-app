import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../../theme/tokens';

interface ScrimProps {
  width: number;
  height: number;
  direction: 'left' | 'bottom';
  start: number;
  end: number;
  strength: number;
}

export function Scrim({ width, height, direction, start, end, strength }: ScrimProps) {
  const horizontal = direction === 'left';
  const gradient = horizontal
    ? { x1: end, y1: 0, x2: start, y2: 0 }
    : { x1: 0, y1: start, x2: 0, y2: end };

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id={`scrim-${direction}`} gradientUnits="userSpaceOnUse" {...gradient}>
          <Stop offset="0" stopColor={colors.night} stopOpacity={0} />
          <Stop offset="1" stopColor={colors.night} stopOpacity={strength} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#scrim-${direction})`} />
    </Svg>
  );
}
