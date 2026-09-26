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
          <Stop offset="0" stopColor="#02040A" />
          <Stop offset="0.5" stopColor="#081024" />
          <Stop offset="0.82" stopColor="#171B2C" />
          <Stop offset="1" stopColor="#3A2A26" />
        </LinearGradient>
        <RadialGradient id="smog" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#8A5A34" stopOpacity={0.42} />
          <Stop offset="0.55" stopColor="#4A3230" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#1A1622" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#C9D4EA" stopOpacity={0.22} />
          <Stop offset="1" stopColor="#C9D4EA" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#sky)" />
      <Ellipse cx={moon.x} cy={moon.y} rx={170} ry={170} fill="url(#moonHalo)" />
      <Circle cx={moon.x} cy={moon.y} r={19} fill="#DCE3F0" opacity={0.62} />
      <Ellipse cx={width * 0.55} cy={horizonY} rx={width * 0.9} ry={height * 0.32} fill="url(#smog)" />
    </Svg>
  );
}

export const Sky = memo(SkyLayer);
