import { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { useLoop } from '../../hooks/useLoop';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { RainSheet, type RainStyle } from './Rain';

export const RAIN_SPEED = 1100;

const CONE_LAYERS = [
  { top: 1, base: 34, opacity: 0.06 },
  { top: 0.8, base: 26, opacity: 0.08 },
  { top: 0.58, base: 18, opacity: 0.11 },
  { top: 0.36, base: 12, opacity: 0.15 },
  { top: 0.17, base: 7, opacity: 0.2 },
];

const LIT_RAIN: RainStyle = {
  density: 9,
  minLength: 12,
  maxLength: 28,
  seed: 77,
  color: '#FFE6AE',
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

function coneWidthAt(y: number, length: number, topWidth: number, baseWidth: number) {
  return baseWidth + (topWidth - baseWidth) * (1 - y / length);
}

function BeamView({ layout, power, animated }: BeamProps) {
  const width = layout.projectionWidth * 0.92;
  const length = layout.beamLength;
  const scale = layout.scale;
  const rain = useLoop((length / RAIN_SPEED) * 1000, animated);

  const scaleY = power.power.interpolate({ inputRange: [0, 1], outputRange: [0.04, 1] });
  const opacity = power.lit.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.5, 1] });
  const rainOpacity = power.power.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0, 1] });

  const rainTop = length * 0.06;
  const sliceHeight = (length - rainTop) / SLICE_FADE.length;
  const rainCone = CONE_LAYERS[2];
  const slices = Array.from({ length: SLICE_FADE.length }, (_, index) => {
    const top = rainTop + index * sliceHeight;
    const sliceWidth = coneWidthAt(top + sliceHeight / 2, length, width * rainCone.top, rainCone.base * scale) * 0.9;
    return { top, width: sliceWidth, left: (width - sliceWidth) / 2, opacity: SLICE_FADE[index] };
  });

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
            <Stop offset="0.16" stopColor="#FFD98C" stopOpacity={0.55} />
            <Stop offset="0.7" stopColor="#FFD27A" stopOpacity={0.85} />
            <Stop offset="1" stopColor="#FFF1CF" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {CONE_LAYERS.map((layer) => (
          <Path
            key={layer.top}
            d={conePath(width, length, width * layer.top, layer.base * scale)}
            fill="url(#beamFade)"
            opacity={layer.opacity}
          />
        ))}
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: rainOpacity }]}>
        {slices.map((slice) => (
          <View
            key={slice.top}
            style={{
              position: 'absolute',
              left: slice.left,
              top: slice.top,
              width: slice.width,
              height: sliceHeight + 0.5,
              overflow: 'hidden',
              opacity: slice.opacity,
            }}
          >
            <View style={{ position: 'absolute', left: -slice.left, top: -slice.top, width, height: length }}>
              <RainSheet width={width} height={length} progress={rain} {...LIT_RAIN} strokeWidth={LIT_RAIN.strokeWidth * scale} />
            </View>
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
}

export const Beam = memo(BeamView);
