import { memo } from 'react';
import Svg, { Defs, Ellipse, G, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { BAT_SYMBOL } from './batSymbol';
import { CLOUD_TEXTURE } from './cloudTexture';
import { EMBLEM_DISC, EMBLEM_VIEW } from './emblemGeometry';

export { EMBLEM_DISC, EMBLEM_VIEW };

const BAT_SCALE = 0.66;
const BAT_X = EMBLEM_DISC.cx - BAT_SYMBOL.center.x * BAT_SCALE;
const BAT_Y = EMBLEM_DISC.cy - BAT_SYMBOL.center.y * BAT_SCALE;
const BAT_TRANSFORM = `translate(${BAT_X} ${BAT_Y}) scale(${BAT_SCALE}) ${BAT_SYMBOL.transform}`;
const PENUMBRA = [
  { width: 1.1, opacity: 0.22 },
  { width: 0.6, opacity: 0.45 },
  { width: 0.25, opacity: 0.8 },
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

function BatShadow() {
  return (
    <G transform={BAT_TRANSFORM}>
      {PENUMBRA.map((ring) => (
        <Path
          key={ring.width}
          d={BAT_SYMBOL.path}
          fill="#000000"
          stroke="#000000"
          strokeOpacity={ring.opacity}
          strokeWidth={ring.width}
          strokeLinejoin="round"
        />
      ))}
    </G>
  );
}

function SignalEmblemView({ id, width, clouds = true, halo = true }: SignalEmblemProps) {
  const height = width * (EMBLEM_VIEW.height / EMBLEM_VIEW.width);
  const { cx, cy, rx, ry } = EMBLEM_DISC;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${EMBLEM_VIEW.width} ${EMBLEM_VIEW.height}`}>
      <Defs>
        <RadialGradient id={`${id}Halo`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFC24A" stopOpacity={0.34} />
          <Stop offset="0.5" stopColor="#C98A2A" stopOpacity={0.12} />
          <Stop offset="1" stopColor="#C98A2A" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}Feather`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="0.72" stopColor="#FFFFFF" stopOpacity={0.96} />
          <Stop offset="0.86" stopColor="#FFFFFF" stopOpacity={0.7} />
          <Stop offset="0.95" stopColor="#FFFFFF" stopOpacity={0.22} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}Light`} cx="50%" cy="44%" r="55%">
          <Stop offset="0" stopColor="#FFF6DC" />
          <Stop offset="0.5" stopColor="#FFDA7E" />
          <Stop offset="0.85" stopColor="#F4B444" />
          <Stop offset="1" stopColor="#D98E1F" />
        </RadialGradient>
        <RadialGradient id={`${id}Puff`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#000000" stopOpacity={0.6} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <Mask id={`${id}Mask`} maskUnits="userSpaceOnUse" x={0} y={0} width={EMBLEM_VIEW.width} height={EMBLEM_VIEW.height}>
          <Ellipse cx={cx} cy={cy} rx={rx + 10} ry={ry + 8} fill={`url(#${id}Feather)`} />
          {clouds && CLOUD_TEXTURE.map((puff) => <Ellipse key={`${puff.cx}-${puff.cy}`} {...puff} fill={`url(#${id}Puff)`} />)}
          <BatShadow />
        </Mask>
      </Defs>
      {halo && <Ellipse cx={cx} cy={cy} rx={186} ry={136} fill={`url(#${id}Halo)`} />}
      <Rect x={0} y={0} width={EMBLEM_VIEW.width} height={EMBLEM_VIEW.height} fill={`url(#${id}Light)`} mask={`url(#${id}Mask)`} />
      <G transform={BAT_TRANSFORM}>
        <Path d={BAT_SYMBOL.path} fill="#06070A" opacity={0.55} />
      </G>
    </Svg>
  );
}

export const SignalEmblem = memo(SignalEmblemView);
