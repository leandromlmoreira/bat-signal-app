import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { useBlink } from '../../hooks/useLoop';
import { BLINK_GROUPS, buildSkyline, type SkylineOptions, type WindowLights } from '../../lib/skyline';

interface SkylineLayerProps {
  id: string;
  width: number;
  height: number;
  margin: number;
  fill: string;
  lightOpacity: number;
  fogColor: string;
  fogTop: number;
  fogBottom: number;
  shape: Omit<SkylineOptions, 'width' | 'bottom'>;
  parallax: Animated.AnimatedInterpolation<number>;
  animated: boolean;
}

interface BlinkingLightsProps {
  group: number;
  lights: WindowLights[];
  width: number;
  height: number;
  opacity: number;
  animated: boolean;
}

function Lights({ lights, opacity }: { lights: WindowLights[]; opacity: number }) {
  return lights.map((light) => <Path key={`${light.group}${light.color}`} d={light.path} fill={light.color} opacity={opacity} />);
}

function BlinkingLights({ group, lights, width, height, opacity, animated }: BlinkingLightsProps) {
  const visibility = useBlink(2600 + group * 1700, 600 + group * 900, animated, group * 1300);

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: visibility }]}>
      <Svg width={width} height={height}>
        <Lights lights={lights} opacity={opacity} />
      </Svg>
    </Animated.View>
  );
}

function SkylineLayerView({
  id,
  width,
  height,
  margin,
  fill,
  lightOpacity,
  fogColor,
  fogTop,
  fogBottom,
  shape,
  parallax,
  animated,
}: SkylineLayerProps) {
  const layerWidth = width + margin * 2;
  const skyline = useMemo(
    () => buildSkyline({ ...shape, width: layerWidth, bottom: height }),
    [shape, layerWidth, height],
  );
  const steady = skyline.lights.filter((light) => light.group === 0);
  const groups = Array.from({ length: BLINK_GROUPS }, (_, index) => index + 1);

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: -margin, width: layerWidth, height, transform: [{ translateX: parallax }] }}
    >
      <Svg width={layerWidth} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1={fogTop} x2="0" y2={fogBottom} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={fogColor} stopOpacity={0} />
            <Stop offset="1" stopColor={fogColor} stopOpacity={0.85} />
          </LinearGradient>
        </Defs>
        <Path d={skyline.path} fill={fill} />
        <Lights lights={steady} opacity={lightOpacity} />
        <Rect x={0} y={fogTop} width={layerWidth} height={Math.max(0, height - fogTop)} fill={`url(#${id})`} />
      </Svg>
      {groups.map((group) => (
        <BlinkingLights
          key={group}
          group={group}
          lights={skyline.lights.filter((light) => light.group === group)}
          width={layerWidth}
          height={height}
          opacity={lightOpacity}
          animated={animated}
        />
      ))}
    </Animated.View>
  );
}

export const SkylineLayer = memo(SkylineLayerView);
