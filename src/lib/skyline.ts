import { createRandom, type Random } from './random';

export interface WindowLights {
  group: number;
  color: string;
  path: string;
}

export interface Skyline {
  path: string;
  lights: WindowLights[];
}

export interface SkylineOptions {
  width: number;
  bottom: number;
  minTop: number;
  maxTop: number;
  minWidth: number;
  maxWidth: number;
  seed: number;
  litChance: number;
  windowScale: number;
  blinkChance: number;
}

type Crown = 'flat' | 'setback' | 'spire' | 'antenna' | 'tank' | 'deco';

const CROWNS: readonly Crown[] = ['flat', 'flat', 'setback', 'spire', 'antenna', 'tank', 'deco', 'setback'];
const WARM_LIGHTS = ['#FFD27A', '#FFC463', '#F4AE55', '#FFE2A3'];
const COOL_LIGHTS = ['#9CC3FF', '#B9D4FF'];
export const BLINK_GROUPS = 3;

const fixed = (value: number) => Math.round(value * 10) / 10;

function rect(x: number, y: number, width: number, height: number) {
  return `M${fixed(x)} ${fixed(y)}h${fixed(width)}v${fixed(height)}h${fixed(-width)}Z`;
}

function triangle(left: number, right: number, base: number, apex: number) {
  const center = (left + right) / 2;
  return `M${fixed(left)} ${fixed(base)}L${fixed(center)} ${fixed(apex)}L${fixed(right)} ${fixed(base)}Z`;
}

function crownShape(crown: Crown, x: number, top: number, width: number, height: number) {
  const center = x + width / 2;
  const unit = Math.min(width, height) * 0.1;

  switch (crown) {
    case 'setback':
      return [
        rect(x + width * 0.14, top - unit * 2.2, width * 0.72, unit * 2.2 + 1),
        rect(x + width * 0.3, top - unit * 3.8, width * 0.4, unit * 1.6 + 1),
      ];
    case 'spire':
      return [
        rect(x + width * 0.2, top - unit * 1.6, width * 0.6, unit * 1.6 + 1),
        triangle(x + width * 0.28, x + width * 0.72, top - unit * 1.6, top - unit * 6),
        rect(center - 0.6, top - unit * 9, 1.2, unit * 3.2),
      ];
    case 'antenna':
      return [rect(x + width * 0.62, top - unit * 5.5, 1.4, unit * 5.5), rect(x + width * 0.2, top - unit, width * 0.3, unit + 1)];
    case 'tank':
      return [
        rect(x + width * 0.18, top - unit * 2.4, unit * 2.2, unit * 1.8),
        triangle(x + width * 0.18 - 1, x + width * 0.18 + unit * 2.2 + 1, top - unit * 2.4, top - unit * 3.2),
        rect(x + width * 0.18 + 1, top - unit * 0.6, 1, unit * 0.6),
        rect(x + width * 0.18 + unit * 2.2 - 2, top - unit * 0.6, 1, unit * 0.6),
      ];
    case 'deco':
      return [
        rect(x + width * 0.1, top - unit * 1.4, width * 0.8, unit * 1.4 + 1),
        rect(x + width * 0.22, top - unit * 2.8, width * 0.56, unit * 1.4 + 1),
        rect(x + width * 0.34, top - unit * 4.2, width * 0.32, unit * 1.4 + 1),
        triangle(x + width * 0.4, x + width * 0.6, top - unit * 4.2, top - unit * 7.5),
      ];
    default:
      return [];
  }
}

function lightColor(random: Random) {
  return random.chance(0.18) ? random.pick(COOL_LIGHTS) : random.pick(WARM_LIGHTS);
}

function addWindows(
  random: Random,
  buckets: Map<string, string[]>,
  building: { x: number; top: number; width: number; bottom: number },
  options: SkylineOptions,
) {
  const scale = options.windowScale;
  const cellWidth = 7 * scale;
  const cellHeight = 10 * scale;
  const windowWidth = 2.8 * scale;
  const windowHeight = 4.4 * scale;
  const margin = 4 * scale;
  const columns = Math.floor((building.width - margin * 2) / cellWidth);
  const occupancy = random.between(0.25, 1.6);

  if (columns < 1) return;

  for (let y = building.top + margin * 1.5; y < building.bottom - cellHeight; y += cellHeight) {
    const floorBoost = random.chance(0.12) ? 3 : 1;
    for (let column = 0; column < columns; column += 1) {
      if (!random.chance(options.litChance * occupancy * floorBoost)) continue;
      const group = random.chance(options.blinkChance) ? 1 + Math.floor(random.next() * BLINK_GROUPS) : 0;
      const key = `${group}|${lightColor(random)}`;
      const x = building.x + margin + column * cellWidth;
      const bucket = buckets.get(key) ?? [];
      bucket.push(rect(x, y, windowWidth, windowHeight));
      buckets.set(key, bucket);
    }
  }
}

export function buildSkyline(options: SkylineOptions): Skyline {
  const random = createRandom(options.seed);
  const shapes: string[] = [];
  const buckets = new Map<string, string[]>();
  const range = options.maxTop - options.minTop;

  let x = -random.between(0, options.maxWidth);
  while (x < options.width) {
    const width = random.between(options.minWidth, options.maxWidth);
    const tower = random.chance(0.16);
    const crown = random.pick(CROWNS);
    const crownRoom = crown === 'flat' ? 0 : range * 0.28;
    const highest = tower ? options.minTop : options.minTop + range * 0.3;
    const top = random.between(highest, options.maxTop) + crownRoom;
    const height = options.bottom - top;

    shapes.push(rect(x, top, width, height + 1));
    shapes.push(...crownShape(crown, x, top, width, Math.min(height, range)));
    addWindows(random, buckets, { x, top, width, bottom: options.bottom }, options);

    x += width + (random.chance(0.25) ? random.between(2, 10) : -random.between(0, 6));
  }

  const lights = Array.from(buckets.entries()).map(([key, paths]) => {
    const [group, color] = key.split('|');
    return { group: Number(group), color, path: paths.join('') };
  });

  return { path: shapes.join(''), lights };
}
