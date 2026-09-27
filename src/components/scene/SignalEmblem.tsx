import { memo } from 'react';
import Svg, { Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { BAT_SYMBOL } from './batSymbol';

export const EMBLEM_VIEW = { width: 380, height: 280 };
export const EMBLEM_DISC = { cx: 190, cy: 140, rx: 100, ry: 64 };

const BAT_SCALE = 0.66;
const BAT_X = EMBLEM_DISC.cx - BAT_SYMBOL.center.x * BAT_SCALE;
const BAT_Y = EMBLEM_DISC.cy - BAT_SYMBOL.center.y * BAT_SCALE;

const CLOUD_SHADES = [
  { cx: 132, cy: 118, rx: 46, ry: 14, opacity: 0.16 },
  { cx: 238, cy: 170, rx: 58, ry: 12, opacity: 0.14 },
  { cx: 176, cy: 188, rx: 40, ry: 9, opacity: 0.12 },
  { cx: 262, cy: 104, rx: 34, ry: 10, opacity: 0.1 },
];

interface SignalEmblemProps {
  id: string;
  width: number;
  clouds?: boolean;
  halo?: boolean;
}

export function emblemWidthForDisc(discWidth: number) {
  return discWidth * (EMBLEM_VIEW.width / (EMBLEM_DISC.rx * 2));
}

function SignalEmblemView({ id, width, clouds = true, halo = true }: SignalEmblemProps) {
  const height = width * (EMBLEM_VIEW.height / EMBLEM_VIEW.width);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${EMBLEM_VIEW.width} ${EMBLEM_VIEW.height}`}>
      <Defs>
        <RadialGradient id={`${id}Halo`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFC45A" stopOpacity={0.5} />
          <Stop offset="0.45" stopColor="#E8952B" stopOpacity={0.18} />
          <Stop offset="1" stopColor="#E8952B" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}Disc`} cx="50%" cy="46%" r="50%">
          <Stop offset="0" stopColor="#FFF3CF" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#FFD579" stopOpacity={0.97} />
          <Stop offset="0.86" stopColor="#F5B347" stopOpacity={0.92} />
          <Stop offset="0.95" stopColor="#E8952B" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#E8952B" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {halo && <Ellipse cx={EMBLEM_DISC.cx} cy={EMBLEM_DISC.cy} rx={188} ry={138} fill={`url(#${id}Halo)`} />}
      <Ellipse cx={EMBLEM_DISC.cx} cy={EMBLEM_DISC.cy} rx={EMBLEM_DISC.rx + 6} ry={EMBLEM_DISC.ry + 5} fill={`url(#${id}Disc)`} />
      <Ellipse
        cx={EMBLEM_DISC.cx}
        cy={EMBLEM_DISC.cy}
        rx={EMBLEM_DISC.rx - 1}
        ry={EMBLEM_DISC.ry - 1}
        fill="none"
        stroke="#FFE3A0"
        strokeWidth={1.5}
        opacity={0.45}
      />
      {clouds && CLOUD_SHADES.map((shade) => <Ellipse key={shade.cx} {...shade} fill="#5A3A14" />)}
      <G transform={`translate(${BAT_X} ${BAT_Y}) scale(${BAT_SCALE}) ${BAT_SYMBOL.transform}`}>
        <Path d={BAT_SYMBOL.path} fill="#3A2408" opacity={0.35} stroke="#3A2408" strokeWidth={0.35} strokeLinejoin="round" />
        <Path d={BAT_SYMBOL.path} fill="#140C04" opacity={0.92} />
      </G>
    </Svg>
  );
}

export const SignalEmblem = memo(SignalEmblemView);
