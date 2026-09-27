import { createRandom, type Random } from './random.ts';

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

export type Crown = 'flat' | 'battlement' | 'setback' | 'spire' | 'gable' | 'cathedral' | 'clock' | 'antenna';

interface Building {
  x: number;
  top: number;
  width: number;
  bottom: number;
}

const CROWNS: readonly Crown[] = ['flat', 'battlement', 'setback', 'spire', 'gable', 'cathedral', 'clock', 'setback', 'gable', 'flat', 'antenna'];
const WARM_LIGHTS = ['#E9B45A', '#F2C878', '#D9A04E', '#F7DDA0'];
const COOL_LIGHTS = ['#A9C4E6', '#C8D8EE'];
export const BLINK_GROUPS = 3;

const fixed = (value: number) => Math.round(value * 10) / 10;

function rect(x: number, y: number, width: number, height: number) {
  return `M${fixed(x)} ${fixed(y)}h${fixed(width)}v${fixed(height)}h${fixed(-width)}Z`;
}

function triangle(left: number, right: number, base: number, apex: number) {
  const center = (left + right) / 2;
  return `M${fixed(left)} ${fixed(base)}L${fixed(center)} ${fixed(apex)}L${fixed(right)} ${fixed(base)}Z`;
}

function disc(cx: number, cy: number, radius: number) {
  return `M${fixed(cx - radius)} ${fixed(cy)}a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(radius * 2)} 0a${fixed(radius)} ${fixed(radius)} 0 1 0 ${fixed(-radius * 2)} 0Z`;
}

function spireAt(center: number, width: number, base: number, height: number) {
  return [
    rect(center - width / 2, base - height * 0.22, width, height * 0.22 + 1),
    triangle(center - width / 2 - 1, center + width / 2 + 1, base - height * 0.22, base - height),
    rect(center - 0.5, base - height * 1.12, 1, height * 0.14),
  ];
}

function battlements(x: number, top: number, width: number, unit: number) {
  const merlon = Math.max(2, unit * 0.9);
  const count = Math.max(2, Math.floor(width / (merlon * 2)));
  const step = width / count;
  return Array.from({ length: count }, (_, index) => rect(x + index * step + step * 0.25, top - merlon, step * 0.5, merlon + 1));
}

export function crownShape(crown: Crown, x: number, top: number, width: number, room: number) {
  const center = x + width / 2;
  const unit = Math.min(width * 0.1, room * 0.1);

  switch (crown) {
    case 'battlement':
      return battlements(x, top, width, unit);
    case 'setback':
      return [
        rect(x + width * 0.12, top - unit * 2.2, width * 0.76, unit * 2.2 + 1),
        rect(x + width * 0.28, top - unit * 4, width * 0.44, unit * 1.8 + 1),
        triangle(x + width * 0.4, x + width * 0.6, top - unit * 4, top - unit * 7.5),
        rect(center - 0.5, top - unit * 9.5, 1, unit * 2.2),
      ];
    case 'spire':
      return spireAt(center, width * 0.46, top, unit * 9);
    case 'gable':
      return [
        triangle(x, x + width, top + 1, top - width * 0.62),
        ...spireAt(x + unit * 0.8, unit * 1.2, top, unit * 3.4),
        ...spireAt(x + width - unit * 0.8, unit * 1.2, top, unit * 3.4),
      ];
    case 'cathedral':
      return [
        triangle(x + width * 0.22, x + width * 0.78, top + 1, top - width * 0.4),
        ...spireAt(x + width * 0.12, width * 0.2, top, unit * 8),
        ...spireAt(x + width * 0.88, width * 0.2, top, unit * 8),
      ];
    case 'clock':
      return [
        rect(x + width * 0.25, top - unit * 5, width * 0.5, unit * 5 + 1),
        triangle(x + width * 0.2, x + width * 0.8, top - unit * 5, top - unit * 9),
        rect(center - 0.5, top - unit * 10.5, 1, unit * 1.6),
      ];
    case 'antenna':
      return [rect(x + width * 0.62, top - unit * 6, 1.2, unit * 6), rect(x + width * 0.2, top - unit, width * 0.3, unit + 1)];
    default:
      return [];
  }
}

function lightColor(random: Random) {
  return random.chance(0.28) ? random.pick(COOL_LIGHTS) : random.pick(WARM_LIGHTS);
}

function bucketFor(buckets: Map<string, string[]>, key: string) {
  const bucket = buckets.get(key) ?? [];
  buckets.set(key, bucket);
  return bucket;
}

function addWindows(random: Random, buckets: Map<string, string[]>, building: Building, options: SkylineOptions) {
  const scale = options.windowScale;
  const slits = random.chance(0.35);
  const cellWidth = (slits ? 6 : 7) * scale;
  const cellHeight = (slits ? 16 : 10) * scale;
  const windowWidth = (slits ? 1.8 : 2.8) * scale;
  const windowHeight = (slits ? 9 : 4.4) * scale;
  const margin = 4 * scale;
  const columns = Math.floor((building.width - margin * 2) / cellWidth);
  const occupancy = random.between(0.25, 1.6);

  if (columns < 1) return;

  for (let y = building.top + margin * 1.5; y < building.bottom - cellHeight; y += cellHeight) {
    const floorBoost = random.chance(0.12) ? 3 : 1;
    for (let column = 0; column < columns; column += 1) {
      if (!random.chance(options.litChance * occupancy * floorBoost)) continue;
      const group = random.chance(options.blinkChance) ? 1 + Math.floor(random.next() * BLINK_GROUPS) : 0;
      const x = building.x + margin + column * cellWidth;
      bucketFor(buckets, `${group}|${lightColor(random)}`).push(rect(x, y, windowWidth, windowHeight));
    }
  }
}

function addClockFace(buckets: Map<string, string[]>, building: Building, room: number, scale: number) {
  const unit = Math.min(building.width * 0.1, room * 0.1);
  const radius = Math.max(1.2, Math.min(building.width * 0.09, unit * 1.2, 3.2 * scale));
  bucketFor(buckets, `0|${WARM_LIGHTS[3]}`).push(disc(building.x + building.width / 2, building.top - unit * 2.6, radius));
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
    const building = { x, top, width, bottom: options.bottom };
    const room = Math.min(options.bottom - top, range);

    shapes.push(rect(x, top, width, options.bottom - top + 1));
    shapes.push(...crownShape(crown, x, top, width, room));
    addWindows(random, buckets, building, options);
    if (crown === 'clock') addClockFace(buckets, building, room, options.windowScale);

    x += width + (random.chance(0.25) ? random.between(2, 10) : -random.between(0, 6));
  }

  const lights = Array.from(buckets.entries()).map(([key, paths]) => {
    const [group, color] = key.split('|');
    return { group: Number(group), color, path: paths.join('') };
  });

  return { path: shapes.join(''), lights };
}
