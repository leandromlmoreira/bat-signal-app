import { memo, useMemo } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { useSwing } from '../../hooks/useLoop';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { BAT_SYMBOL } from './batSymbol';

const VIEW_WIDTH = 380;
const VIEW_HEIGHT = 280;
const DISC = { cx: 190, cy: 140, rx: 100, ry: 64 };
const BAT_SCALE = 0.66;

const CLOUD_SHADES = [
  { cx: 132, cy: 118, rx: 46, ry: 14, opacity: 0.16 },
  { cx: 238, cy: 170, rx: 58, ry: 12, opacity: 0.14 },
  { cx: 176, cy: 188, rx: 40, ry: 9, opacity: 0.12 },
  { cx: 262, cy: 104, rx: 34, ry: 10, opacity: 0.1 },
];

interface ProjectionProps {
  layout: SceneLayout;
  power: SignalPower;
  animated: boolean;
}

function ProjectionView({ layout, power, animated }: ProjectionProps) {
  const width = layout.projectionWidth * (VIEW_WIDTH / (DISC.rx * 2));
  const height = width * (VIEW_HEIGHT / VIEW_WIDTH);
  const sway = useSwing(7000, animated);

  const opacity = useMemo(
    () =>
      Animated.multiply(
        power.power.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0, 0, 1] }),
        power.shimmer,
      ),
    [power.power, power.shimmer],
  );
  const scale = power.power.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0.9, 0.9, 1] });
  const drift = sway.interpolate({ inputRange: [-1, 1], outputRange: [-3, 3] });
  const breathe = sway.interpolate({ inputRange: [-1, 0, 1], outputRange: [1, 1.012, 1] });

  const batX = DISC.cx - BAT_SYMBOL.center.x * BAT_SCALE;
  const batY = DISC.cy - BAT_SYMBOL.center.y * BAT_SCALE;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: layout.target.x - width / 2,
        top: layout.target.y - height / 2,
        width,
        height,
        opacity,
        transform: [{ translateX: drift }, { rotate: `${layout.angle * 0.3}deg` }, { scale }, { scaleX: breathe }],
      }}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
        <Defs>
          <RadialGradient id="projectionHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFC45A" stopOpacity={0.5} />
            <Stop offset="0.45" stopColor="#E8952B" stopOpacity={0.18} />
            <Stop offset="1" stopColor="#E8952B" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="projectionDisc" cx="50%" cy="46%" r="50%">
            <Stop offset="0" stopColor="#FFF3CF" stopOpacity={1} />
            <Stop offset="0.55" stopColor="#FFD579" stopOpacity={0.97} />
            <Stop offset="0.86" stopColor="#F5B347" stopOpacity={0.92} />
            <Stop offset="0.95" stopColor="#E8952B" stopOpacity={0.5} />
            <Stop offset="1" stopColor="#E8952B" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={DISC.cx} cy={DISC.cy} rx={188} ry={138} fill="url(#projectionHalo)" />
        <Ellipse cx={DISC.cx} cy={DISC.cy} rx={DISC.rx + 6} ry={DISC.ry + 5} fill="url(#projectionDisc)" />
        <Ellipse cx={DISC.cx} cy={DISC.cy} rx={DISC.rx - 1} ry={DISC.ry - 1} fill="none" stroke="#FFE3A0" strokeWidth={1.5} opacity={0.45} />
        {CLOUD_SHADES.map((shade) => (
          <Ellipse key={shade.cx} {...shade} fill="#5A3A14" />
        ))}
        <G transform={`translate(${batX} ${batY}) scale(${BAT_SCALE}) ${BAT_SYMBOL.transform}`}>
          <Path d={BAT_SYMBOL.path} fill="#3A2408" opacity={0.35} stroke="#3A2408" strokeWidth={0.35} strokeLinejoin="round" />
          <Path d={BAT_SYMBOL.path} fill="#140C04" opacity={0.92} />
        </G>
      </Svg>
    </Animated.View>
  );
}

export const Projection = memo(ProjectionView);
