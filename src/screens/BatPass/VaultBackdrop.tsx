import { memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../../theme/tokens';

function VaultBackdropView() {
  const { width, height } = useWindowDimensions();

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="vaultSky" x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#050915" />
          <Stop offset="0.55" stopColor={colors.night} />
          <Stop offset="1" stopColor="#02030A" />
        </LinearGradient>
        <RadialGradient id="vaultGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={colors.amberDeep} stopOpacity={0.16} />
          <Stop offset="1" stopColor={colors.amberDeep} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="vaultCold" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#3A5FA8" stopOpacity={0.1} />
          <Stop offset="1" stopColor="#3A5FA8" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#vaultSky)" />
      <Ellipse cx={width * 0.82} cy={-height * 0.05} rx={width * 0.5} ry={height * 0.45} fill="url(#vaultGlow)" />
      <Ellipse cx={width * 0.1} cy={height * 0.95} rx={width * 0.5} ry={height * 0.4} fill="url(#vaultCold)" />
    </Svg>
  );
}

export const VaultBackdrop = memo(VaultBackdropView);
