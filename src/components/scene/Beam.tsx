import { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useLoop } from '../../hooks/useLoop';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { coneHalfWidth } from '../../lib/dust';
import { BeamDust } from './BeamDust';
import { RainSheet, type RainStyle } from './Rain';

export const RAIN_SPEED = 1100;

const CONE_LAYERS = [
  { top: 1.04, base: 36, opacity: 0.05 },
  { top: 0.86, base: 28, opacity: 0.07 },
  { top: 0.64, base: 20, opacity: 0.09 },
  { top: 0.42, base: 13, opacity: 0.12 },
  { top: 0.22, base: 8, opacity: 0.16 },
  { top: 0.08, base: 4, opacity: 0.22 },
];

const LIT_RAIN: RainStyle = {
  density: 9,
  minLength: 12,
  maxLength: 28,
  seed: 77,
  color: '#FFE8B4',
  strokeWidth: 1.1,
  centered: true,
};

const SLICE_FADE = [0.15, 0.45, 0.75, 1, 1, 1];

interface BeamProps {
  layout: SceneLayout;
  power: SignalPower;
  animated: boolean;
}

function conePath(width: number, length: number, topWidth: number, baseWidth: number) {
  const center = width / 2;
  return `M${center - topWidth / 2} 0L${center + topWidth / 2} 0L${center + baseWidth / 2} ${length}L${center - baseWidth / 2} ${length}Z`;
}

function edgePath(width: number, length: number, topWidth: number, baseWidth: number, side: 1 | -1) {
  const center = width / 2;
  return `M${center + (side * topWidth) / 2} 0L${center + (side * baseWidth) / 2} ${length}`;
}

function LitRain({ width, length, scale, animated }: { width: number; length: number; scale: number; animated: boolean }) {
  const rain = useLoop((length / RAIN_SPEED) * 1000, animated);
  const rainTop = length * 0.06;
  const sliceHeight = (length - rainTop) / SLICE_FADE.length;
  const cone = CONE_LAYERS[2];

  return SLICE_FADE.map((fade, index) => {
    const top = rainTop + index * sliceHeight;
    const sliceWidth = coneHalfWidth(top + sliceHeight / 2, length, width * cone.top, cone.base * scale) * 1.8;
    const left = (width - sliceWidth) / 2;
    return (
      <View key={top} style={{ position: 'absolute', left, top, width: sliceWidth, height: sliceHeight + 0.5, overflow: 'hidden', opacity: fade }}>
        <View style={{ position: 'absolute', left: -left, top: -top, width, height: length }}>
          <RainSheet width={width} height={length} progress={rain} {...LIT_RAIN} strokeWidth={LIT_RAIN.strokeWidth * scale} />
        </View>
      </View>
    );
  });
}

function BeamView({ layout, power, animated }: BeamProps) {
  const width = layout.projectionWidth * 0.94;
  const length = layout.beamLength;
  const scale = layout.scale;
  const outer = CONE_LAYERS[1];

  const scaleY = power.reach.interpolate({ inputRange: [0, 1], outputRange: [0.03, 1] });
  const opacity = power.lit.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.45, 1] });
  const settled = power.power.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0, 0, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: layout.lamp.x - width / 2,
        top: layout.lamp.y - length,
        width,
        height: length,
        opacity,
        transformOrigin: '50% 100%',
        transform: [{ rotate: `${layout.angle}deg` }, { scaleY }],
      }}
    >
      <Svg width={width} height={length} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="beamFade" x1="0" y1="0" x2="0" y2={length} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFD98C" stopOpacity={0} />
            <Stop offset="0.12" stopColor="#FFD98C" stopOpacity={0.5} />
            <Stop offset="0.65" stopColor="#FFD37D" stopOpacity={0.85} />
            <Stop offset="1" stopColor="#FFF4D8" stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="beamEdge" x1="0" y1="0" x2="0" y2={length} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFE3A6" stopOpacity={0} />
            <Stop offset="0.3" stopColor="#FFE3A6" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#FFF4D8" stopOpacity={0.6} />
          </LinearGradient>
        </Defs>
        {CONE_LAYERS.map((layer) => (
          <Path key={layer.top} d={conePath(width, length, width * layer.top, layer.base * scale)} fill="url(#beamFade)" opacity={layer.opacity} />
        ))}
        {([1, -1] as const).map((side) => (
          <Path key={side} d={edgePath(width, length, width * outer.top, outer.base * scale, side)} stroke="url(#beamEdge)" strokeWidth={1.1 * scale} opacity={0.5} />
        ))}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: settled }]}>
        <BeamDust width={width} length={length} topWidth={width * outer.top} baseWidth={outer.base * scale} scale={scale} animated={animated} />
        {animated && <LitRain width={width} length={length} scale={scale} animated={animated} />}
      </Animated.View>
    </Animated.View>
  );
}

export const Beam = memo(BeamView);
