import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import type { Strike, useLightning } from '../../hooks/useLightning';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import { buildBolt } from '../../lib/lightning';

function Bolt({ layout, strike }: { layout: SceneLayout; strike: Strike }) {
  const { width, height, skyTop, roofY } = layout;
  const shape = useMemo(
    () =>
      buildBolt({
        seed: strike.seed,
        startX: width * strike.position,
        startY: height * 0.04,
        endY: skyTop + (roofY - skyTop) * 0.55,
        spread: Math.min(90, width * 0.08),
        segments: 11,
      }),
    [width, height, skyTop, roofY, strike],
  );
  const thickness = 1.6 - strike.distance * 0.7;

  return (
    <G>
      <Path d={shape.trunk} stroke="#9FB8E0" strokeWidth={thickness * 6} strokeOpacity={0.18} fill="none" strokeLinejoin="round" />
      <Path d={shape.branches} stroke="#DCE7FA" strokeWidth={thickness * 0.6} strokeOpacity={0.6} fill="none" strokeLinejoin="round" />
      <Path d={shape.trunk} stroke="#F4F8FF" strokeWidth={thickness} fill="none" strokeLinejoin="round" />
    </G>
  );
}

type LightningState = ReturnType<typeof useLightning>;

interface LightningSkyProps {
  layout: SceneLayout;
  lightning: LightningState;
}

function LightningSkyView({ layout, lightning }: LightningSkyProps) {
  const { flash, bolt, strike } = lightning;
  const { width, height, roofY } = layout;

  if (!strike) return null;

  const glowX = width * strike.position;
  const skyOpacity = flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.8 - strike.distance * 0.35] });

  return (
    <>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: skyOpacity }]}>
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient id="stormGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#C6D6F2" stopOpacity={0.8} />
              <Stop offset="0.45" stopColor="#6F87B0" stopOpacity={0.38} />
              <Stop offset="1" stopColor="#2A3A58" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={glowX} cy={roofY * 0.45} rx={Math.max(width * 0.7, 520)} ry={roofY * 0.75} fill="url(#stormGlow)" />
        </Svg>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: bolt }]}>
        <Svg width={width} height={height}>
          <Bolt layout={layout} strike={strike} />
        </Svg>
      </Animated.View>
    </>
  );
}

export const LightningSky = memo(LightningSkyView);

export function LightningWash({ lightning }: { lightning: LightningState }) {
  const opacity = lightning.flash.interpolate({ inputRange: [0, 1], outputRange: [0, 0.07] });
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wash, { opacity }]} />;
}

const styles = StyleSheet.create({
  wash: { backgroundColor: '#C9D8F2' },
});
