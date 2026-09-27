import { createRandom } from './random.ts';

export interface DustOptions {
  width: number;
  length: number;
  topWidth: number;
  baseWidth: number;
  count: number;
  groups: number;
  minRadius: number;
  maxRadius: number;
  seed: number;
}

export interface Mote {
  x: number;
  y: number;
  radius: number;
  group: number;
}

const fixed = (value: number) => Math.round(value * 10) / 10;

export function coneHalfWidth(y: number, length: number, topWidth: number, baseWidth: number) {
  return (baseWidth + (topWidth - baseWidth) * (1 - y / length)) / 2;
}

export function scatterDust({ width, length, topWidth, baseWidth, count, groups, minRadius, maxRadius, seed }: DustOptions): Mote[] {
  const random = createRandom(seed);
  const center = width / 2;

  return Array.from({ length: count }, (_, index) => {
    const y = length * (0.3 + 0.66 * Math.pow(random.next(), 0.8));
    const spread = (random.next() + random.next()) - 1;
    const half = coneHalfWidth(y, length, topWidth, baseWidth) * 0.92;
    return {
      x: center + spread * half,
      y,
      radius: random.between(minRadius, maxRadius),
      group: index % groups,
    };
  });
}

export function motesPath(motes: readonly Mote[]) {
  return motes
    .map(({ x, y, radius }) => `M${fixed(x - radius)} ${fixed(y)}a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(radius * 2)} 0a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(-radius * 2)} 0Z`)
    .join('');
}
