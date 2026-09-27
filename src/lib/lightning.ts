import { createRandom, type Random } from './random.ts';

export interface BoltOptions {
  seed: number;
  startX: number;
  startY: number;
  endY: number;
  spread: number;
  segments: number;
}

export interface Bolt {
  trunk: string;
  branches: string;
  points: { x: number; y: number }[];
}

export const STRIKE_DELAY = { min: 6500, max: 15000 };

const fixed = (value: number) => Math.round(value * 10) / 10;

function walk(random: Random, fromX: number, fromY: number, toY: number, steps: number, jitter: number, limit: { min: number; max: number }) {
  const points = [{ x: fromX, y: fromY }];
  let x = fromX;
  for (let index = 1; index <= steps; index += 1) {
    const y = fromY + ((toY - fromY) * index) / steps + (index < steps ? random.between(-0.25, 0.25) * ((toY - fromY) / steps) : 0);
    x = Math.min(limit.max, Math.max(limit.min, x + random.between(-jitter, jitter)));
    points.push({ x, y });
  }
  return points;
}

const toPath = (points: { x: number; y: number }[]) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${fixed(point.x)} ${fixed(point.y)}`).join('');

export function buildBolt({ seed, startX, startY, endY, spread, segments }: BoltOptions): Bolt {
  const random = createRandom(seed);
  const limit = { min: startX - spread, max: startX + spread };
  const jitter = spread / 3;
  const points = walk(random, startX, startY, endY, segments, jitter, limit);
  const branchCount = 2 + Math.floor(random.next() * 2);
  const branches: string[] = [];

  for (let index = 0; index < branchCount; index += 1) {
    const origin = points[1 + Math.floor(random.next() * Math.max(1, points.length - 3))];
    const reach = (endY - origin.y) * random.between(0.25, 0.5);
    const direction = random.chance(0.5) ? 1 : -1;
    const branch = walk(random, origin.x, origin.y, origin.y + reach, 4, jitter * 0.8, {
      min: direction < 0 ? limit.min : origin.x,
      max: direction < 0 ? origin.x : limit.max,
    });
    branches.push(toPath(branch));
  }

  return { trunk: toPath(points), branches: branches.join(''), points };
}

export function nextStrikeDelay(random: Random) {
  return Math.round(random.between(STRIKE_DELAY.min, STRIKE_DELAY.max));
}
