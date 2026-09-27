import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../../theme/tokens';

interface ScrimProps {
  width: number;
  height: number;
  direction: 'left' | 'bottom' | 'top';
  start: number;
  end: number;
  strength: number;
}

export function Scrim({ width, height, direction, start, end, strength }: ScrimProps) {
  const horizontal = direction === 'left';
  const flipped = direction !== 'bottom';
  const axis = flipped ? { from: end, to: start } : { from: start, to: end };
  const gradient = horizontal
    ? { x1: axis.from, y1: 0, x2: axis.to, y2: 0 }
    : { x1: 0, y1: axis.from, x2: 0, y2: axis.to };

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
