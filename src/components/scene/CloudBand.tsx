import { memo, useMemo } from 'react';
import { Animated } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { useLoop } from '../../hooks/useLoop';
import { createRandom } from '../../lib/random';

interface CloudBandProps {
  id: string;
  width: number;
  top: number;
  height: number;
  seed: number;
  duration: number;
  color: string;
  opacity: number;
  density: number;
  animated: boolean;
}

interface Puff {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

function createPuffs(width: number, height: number, seed: number, density: number) {
  const random = createRandom(seed);
  const count = Math.ceil((width / 80) * density);
  const puffs: Puff[] = [];

  for (let index = 0; index < count; index += 1) {
    const rx = random.between(70, 190);
    puffs.push({
      cx: random.between(0, width),
      cy: random.between(height * 0.3, height * 0.7),
      rx,
      ry: Math.min(height * 0.5, rx * random.between(0.22, 0.34)),
    });
  }

  return puffs;
}

function tilePuffs(puffs: Puff[], width: number) {
  return [-width, 0, width, width * 2]
    .flatMap((offset) => puffs.map((puff) => ({ ...puff, cx: puff.cx + offset })))
    .filter((puff) => puff.cx + puff.rx > 0 && puff.cx - puff.rx < width * 2);
}

function CloudBandLayer({ id, width, top, height, seed, duration, color, opacity, density, animated }: CloudBandProps) {
  const progress = useLoop(duration, animated);
  const puffs = useMemo(
    () => tilePuffs(createPuffs(width, height, seed, density), width),
    [width, height, seed, density],
  );
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -width] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top, width: width * 2, height, opacity, transform: [{ translateX }] }}
    >
      <Svg width={width * 2} height={height}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={0.9} />
            <Stop offset="0.55" stopColor={color} stopOpacity={0.45} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {puffs.map((puff, index) => (
          <Ellipse key={index} cx={puff.cx} cy={puff.cy} rx={puff.rx} ry={puff.ry} fill={`url(#${id})`} />
        ))}
      </Svg>
    </Animated.View>
  );
}

export const CloudBand = memo(CloudBandLayer);
