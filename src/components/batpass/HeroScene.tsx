import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { buildSkyline } from '../../lib/skyline';
import { colors } from '../../theme/tokens';
import { EMBLEM_DISC, EMBLEM_VIEW, SignalEmblem, emblemWidthForDisc } from '../scene/SignalEmblem';

interface HeroSceneProps {
  width: number;
  height: number;
  compact: boolean;
}

interface Point {
  x: number;
  y: number;
}

function sceneGeometry(width: number, height: number, compact: boolean) {
  if (compact) {
    const horizon = 250;
    return {
      horizon,
      disc: Math.min(width * 0.52, 210),
      target: { x: width * 0.66, y: 92 },
      lamp: { x: width * 0.2, y: horizon - 34 },
      far: { minTop: horizon - 110, maxTop: horizon - 40 },
      near: { minTop: horizon - 50, maxTop: horizon - 14 },
    };
  }

  const horizon = height * 0.86;
  const disc = Math.min(width * 0.26, 190);
  return {
    horizon,
    disc,
    target: { x: width - disc * 0.66, y: 36 + disc * 0.36 },
    lamp: { x: width * 0.7, y: horizon - 70 },
    far: { minTop: height * 0.5, maxTop: height * 0.74 },
    near: { minTop: horizon - 90, maxTop: horizon - 20 },
  };
}

function beamPath(lamp: Point, target: Point, spread: number) {
  const dx = target.x - lamp.x;
  const dy = target.y - lamp.y;
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  return `M${lamp.x - 3} ${lamp.y}L${target.x + nx * spread} ${target.y + ny * spread}L${target.x - nx * spread} ${target.y - ny * spread}L${lamp.x + 3} ${lamp.y}Z`;
}

function HeroSceneView({ width, height, compact }: HeroSceneProps) {
  const geometry = useMemo(() => sceneGeometry(width, height, compact), [width, height, compact]);
  const { horizon, disc, target, lamp } = geometry;

  const skylines = useMemo(() => {
    const shared = { width, bottom: horizon, blinkChance: 0 };
    return {
      far: buildSkyline({ ...shared, ...geometry.far, minWidth: 22, maxWidth: 58, seed: 11, litChance: 0.05, windowScale: 0.7 }),
      near: buildSkyline({ ...shared, ...geometry.near, minWidth: 40, maxWidth: 96, seed: 53, litChance: 0.07, windowScale: 0.95 }),
    };
  }, [width, horizon, geometry]);

  const emblemWidth = emblemWidthForDisc(disc);
  const emblemHeight = emblemWidth * (EMBLEM_VIEW.height / EMBLEM_VIEW.width);
  const beam = beamPath(lamp, target, disc * 0.46);
  const fadeTop = compact ? horizon - 60 : height * 0.6;
  const roof = `M${lamp.x - 46} ${lamp.y + 7}h92v${horizon - lamp.y}h-92Z`;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="heroSky" x1="0" y1="0" x2="0" y2={horizon} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#010205" />
            <Stop offset="0.6" stopColor="#070B13" />
            <Stop offset="0.9" stopColor="#111926" />
            <Stop offset="1" stopColor="#1E2938" />
          </LinearGradient>
          <LinearGradient id="heroBeam" x1={lamp.x} y1={lamp.y} x2={target.x} y2={target.y} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFE3A0" stopOpacity={0.55} />
            <Stop offset="0.6" stopColor={colors.amber} stopOpacity={0.14} />
            <Stop offset="1" stopColor={colors.amber} stopOpacity={0.04} />
          </LinearGradient>
          <RadialGradient id="heroLamp" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFE9B3" stopOpacity={0.9} />
            <Stop offset="1" stopColor={colors.amber} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="heroFade" x1="0" y1={fadeTop} x2="0" y2={height} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors.core} stopOpacity={0} />
            <Stop offset={compact ? '0.35' : '1'} stopColor={colors.core} stopOpacity={0.96} />
          </LinearGradient>
          <LinearGradient id="heroScrim" x1="0" y1="0" x2={width * 0.62} y2="0" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={colors.night} stopOpacity={compact ? 0 : 0.72} />
            <Stop offset="1" stopColor={colors.night} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={horizon} fill="url(#heroSky)" />
        <Path d={beam} fill="url(#heroBeam)" />
        <Path d={skylines.far.path} fill="#0D131D" />
        {skylines.far.lights.map((light) => (
          <Path key={`far${light.color}`} d={light.path} fill={light.color} opacity={0.4} />
        ))}
        <Path d={skylines.near.path} fill="#070A10" />
        {skylines.near.lights.map((light) => (
          <Path key={`near${light.color}`} d={light.path} fill={light.color} opacity={0.55} />
        ))}
        <Path d={roof} fill="#05080E" />
        <Circle cx={lamp.x} cy={lamp.y} r={26} fill="url(#heroLamp)" />
        <Circle cx={lamp.x} cy={lamp.y} r={3.5} fill="#FFF3CF" />
        <Rect x={0} y={horizon} width={width} height={Math.max(0, height - horizon)} fill={colors.ink} />
        <Rect x={0} y={0} width={width} height={height} fill="url(#heroScrim)" />
        <Rect x={0} y={fadeTop} width={width} height={Math.max(0, height - fadeTop)} fill="url(#heroFade)" />
      </Svg>
      <View
        style={[
          styles.emblem,
          {
            left: target.x - emblemWidth / 2,
            top: target.y - (EMBLEM_DISC.cy / EMBLEM_VIEW.height) * emblemHeight,
            width: emblemWidth,
            height: emblemHeight,
          },
        ]}
      >
        <SignalEmblem id="hero" width={emblemWidth} clouds={false} />
      </View>
    </View>
  );
}

export const HeroScene = memo(HeroSceneView);

const styles = StyleSheet.create({
  emblem: {
    position: 'absolute',
    transform: [{ rotate: '4deg' }],
  },
});
