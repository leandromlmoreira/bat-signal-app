import { createRandom, type Random } from './random.ts';

export interface RainOptions {
  width: number;
  height: number;
  density: number;
  minLength: number;
  maxLength: number;
  seed: number;
  centered?: boolean;
}

const fixed = (value: number) => Math.round(value * 10) / 10;

function centeredOffset(random: Random) {
  return (random.next() + random.next() + random.next()) / 3 - 0.5;
}

function bandForOffset(offset: number) {
  const distance = Math.abs(offset);
  if (distance < 0.1) return 0;
  if (distance < 0.2) return 1;
  return 2;
}

export function buildRainPaths({ width, height, density, minLength, maxLength, seed, centered = false }: RainOptions) {
  const random = createRandom(seed);
  const count = Math.round(((width * height) / 10000) * density);
  const bands = ['', '', ''];

  for (let index = 0; index < count; index += 1) {
    const offset = centered ? centeredOffset(random) : random.next() - 0.5;
    const band = centered ? bandForOffset(offset) : Math.floor(random.next() * 3);
    const x = fixed(width / 2 + offset * width);
    const y = random.between(0, height);
    const length = fixed(random.between(minLength, maxLength));
    bands[band] += `M${x} ${fixed(y)}v${length}M${x} ${fixed(y + height)}v${length}`;
  }

  return bands;
}
