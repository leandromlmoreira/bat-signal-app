import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

interface SkyProps {
  width: number;
  height: number;
  horizonY: number;
  moon: { x: number; y: number };
}

function SkyLayer({ width, height, horizonY, moon }: SkyProps) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2={horizonY} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#010205" />
          <Stop offset="0.45" stopColor="#060A12" />
          <Stop offset="0.8" stopColor="#0F1622" />
          <Stop offset="1" stopColor="#1B2533" />
        </LinearGradient>
        <RadialGradient id="horizonFog" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#4A5D78" stopOpacity={0.4} />
          <Stop offset="0.55" stopColor="#2B384C" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#141B26" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="moonDisc" cx="42%" cy="40%" r="60%">
          <Stop offset="0" stopColor="#E3E9F2" stopOpacity={0.62} />
          <Stop offset="0.7" stopColor="#AEBBD0" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#8093B2" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#B9C8E0" stopOpacity={0.2} />
          <Stop offset="0.4" stopColor="#8093B2" stopOpacity={0.07} />
          <Stop offset="1" stopColor="#8093B2" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />
      <Ellipse cx={moon.x} cy={moon.y} rx={190} ry={190} fill="url(#moonHalo)" />
      <Circle cx={moon.x} cy={moon.y} r={19} fill="url(#moonDisc)" />
      <Ellipse cx={width * 0.5} cy={horizonY} rx={width * 0.95} ry={height * 0.3} fill="url(#horizonFog)" />
    </Svg>
  );
}

export const Sky = memo(SkyLayer);
