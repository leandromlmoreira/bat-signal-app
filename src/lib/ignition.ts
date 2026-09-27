import { createRandom } from './random.ts';

export interface FlickerStep {
  level: number;
  duration: number;
}

const clampLevel = (value: number) => Math.min(1, Math.max(0, value));

export function buildIgnition(seed: number, flickers = 6): FlickerStep[] {
  const random = createRandom(seed);
  const steps: FlickerStep[] = [];

  for (let index = 0; index < flickers; index += 1) {
    const progress = flickers > 1 ? index / (flickers - 1) : 1;
    const peak = clampLevel(0.3 + progress * 0.55 + random.between(-0.06, 0.06));
    const trough = clampLevel(0.02 + progress * 0.28 * random.next());
    steps.push({ level: peak, duration: Math.round(random.between(35, 80)) });
    steps.push({ level: trough, duration: Math.round(random.between(55, 140) * (1 - progress * 0.4)) });
  }

  steps.push({ level: 1, duration: 820 });
  return steps;
}

export function ignitionDuration(steps: readonly FlickerStep[]) {
  return steps.reduce((total, step) => total + step.duration, 0);
}

export const IGNITION = buildIgnition(1939);
