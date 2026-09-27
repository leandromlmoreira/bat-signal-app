import { memo, useMemo, type ReactNode } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useBlink } from '../../hooks/useLoop';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { LENS_TILT, rooftopGeometry } from './rooftopGeometry';

interface GlowProps {
  layout: SceneLayout;
  power: SignalPower;
  animated: boolean;
}

interface RadialProps {
  id: string;
  width: number;
  height: number;
  stops: readonly (readonly [number, string, number])[];
}

function RadialSprite({ id, width, height, stops }: RadialProps) {
  return (
    <Svg width={width} height={height}>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          {stops.map(([offset, color, opacity]) => (
            <Stop key={offset} offset={offset} stopColor={color} stopOpacity={opacity} />
          ))}
        </RadialGradient>
      </Defs>
      <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill={`url(#${id})`} />
    </Svg>
  );
}

interface CenteredProps {
  x: number;
  y: number;
  width: number;
  height: number;
  style: object;
  children: ReactNode;
}

function Centered({ x, y, width, height, style, children }: CenteredProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: x - width / 2, top: y - height / 2, width, height }, style]}
    >
      {children}
    </Animated.View>
  );
}

const GLOW_STOPS = [
  [0, '#FFFBEF', 1],
  [0.12, '#FFE9B3', 0.85],
  [0.4, '#FFC247', 0.28],
  [1, '#E8952B', 0],
] as const;

const FLARE_STOPS = [
  [0, '#FFF4D6', 0.9],
  [0.35, '#FFD27A', 0.35],
  [1, '#FFC247', 0],
] as const;

const STRIKE_STOPS = [
  [0, '#FFF6E0', 0.9],
  [0.3, '#FFE2A0', 0.4],
  [1, '#FFC247', 0],
] as const;

const WASH_STOPS = [
  [0, '#FFC247', 0.4],
  [1, '#FFC247', 0],
] as const;

const BEACON_STOPS = [
  [0, '#FF6A55', 1],
  [0.25, '#FF5B4A', 0.55],
  [1, '#FF5B4A', 0],
] as const;

function LitLens({ layout, opacity }: { layout: SceneLayout; opacity: SignalPower['lit'] }) {
  const { lamp, drumWidth, scale, angle } = layout;
  const size = drumWidth + 16 * scale;
  const radius = drumWidth / 2;
  const center = size / 2;

  return (
    <Centered x={lamp.x} y={lamp.y} width={size} height={size} style={{ opacity }}>
      <Svg width={size} height={size}>
        <Ellipse
          cx={center}
          cy={center}
          rx={radius}
          ry={radius * LENS_TILT}
          fill="#FFF7E0"
          transform={`rotate(${angle} ${center} ${center})`}
        />
      </Svg>
    </Centered>
  );
}

function SearchlightGlowView({ layout, power, animated }: GlowProps) {
  const { lamp, scale, width, pivot, roofY } = layout;
  const geometry = useMemo(() => rooftopGeometry(layout), [layout]);
  const beacon = useBlink(1400, 900, animated);

  const glowSize = 240 * scale;
  const flareWidth = Math.min(width * 1.2, 980 * scale);
  const strikeSize = 760 * scale;
  const washWidth = (geometry.right - geometry.left) * 1.1;

  const glowScale = power.strike.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] });
  const flareOpacity = power.lit.interpolate({ inputRange: [0, 1], outputRange: [0, 0.75] });
  const strikeScale = power.strike.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] });
  const parapetOpacity = power.lit.interpolate({ inputRange: [0, 1], outputRange: [0, 0.9] });

  return (
    <>
      <Centered x={pivot.x} y={roofY - 4 * scale} width={washWidth} height={70 * scale} style={{ opacity: power.lit }}>
        <RadialSprite id="roofWash" width={washWidth} height={70 * scale} stops={WASH_STOPS} />
      </Centered>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: geometry.left - 5 * scale,
          top: roofY - geometry.parapetHeight,
          width: geometry.right - geometry.left + 10 * scale,
          height: 1.5 * scale,
          opacity: parapetOpacity,
        }}
      >
        <Svg width={geometry.right - geometry.left + 10 * scale} height={1.5 * scale}>
          <Defs>
            <LinearGradient id="parapetRim" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFC247" stopOpacity={0} />
              <Stop offset={(pivot.x - geometry.left) / (geometry.right - geometry.left)} stopColor="#FFD58A" stopOpacity={1} />
              <Stop offset="1" stopColor="#FFC247" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={geometry.right - geometry.left + 10 * scale} height={1.5 * scale} fill="url(#parapetRim)" />
        </Svg>
      </Animated.View>
      <Centered x={lamp.x} y={lamp.y} width={strikeSize} height={strikeSize} style={{ opacity: power.strike, transform: [{ scale: strikeScale }] }}>
        <RadialSprite id="strike" width={strikeSize} height={strikeSize} stops={STRIKE_STOPS} />
      </Centered>
      <LitLens layout={layout} opacity={power.lit} />
      <Centered x={lamp.x} y={lamp.y} width={glowSize} height={glowSize} style={{ opacity: power.lit, transform: [{ scale: glowScale }] }}>
        <RadialSprite id="lampGlow" width={glowSize} height={glowSize} stops={GLOW_STOPS} />
      </Centered>
      <Centered x={lamp.x} y={lamp.y} width={flareWidth} height={14 * scale} style={{ opacity: flareOpacity }}>
        <RadialSprite id="flare" width={flareWidth} height={14 * scale} stops={FLARE_STOPS} />
      </Centered>
      <Centered x={geometry.mast.x} y={geometry.mast.top} width={16 * scale} height={16 * scale} style={{ opacity: beacon }}>
        <RadialSprite id="beacon" width={16 * scale} height={16 * scale} stops={BEACON_STOPS} />
      </Centered>
    </>
  );
}

export const SearchlightGlow = memo(SearchlightGlowView);
