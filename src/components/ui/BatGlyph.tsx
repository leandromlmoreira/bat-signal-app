import Svg, { Path } from 'react-native-svg';

import { BAT_SYMBOL } from '../scene/batSymbol';

interface BatGlyphProps {
  size: number;
  color: string;
}

export function BatGlyph({ size, color }: BatGlyphProps) {
  return (
    <Svg width={size} height={(size * BAT_SYMBOL.height) / BAT_SYMBOL.width} viewBox={`0 0 ${BAT_SYMBOL.width} ${BAT_SYMBOL.height}`}>
      <Path d={BAT_SYMBOL.path} transform={BAT_SYMBOL.transform} fill={color} />
    </Svg>
  );
}
