import { createRandom } from '../../lib/random';
import { EMBLEM_DISC } from './emblemGeometry';

function buildTexture(seed: number) {
  const random = createRandom(seed);
  const { cx, cy, rx, ry } = EMBLEM_DISC;
  return Array.from({ length: 22 }, () => {
    const angle = random.between(0, Math.PI * 2);
    const distance = Math.sqrt(random.next());
    const size = random.between(22, 64);
    return {
      cx: Math.round(cx + Math.cos(angle) * distance * rx),
      cy: Math.round(cy + Math.sin(angle) * distance * ry),
      rx: Math.round(size),
      ry: Math.round(size * random.between(0.22, 0.38)),
      opacity: Math.round(random.between(0.16, 0.42) * 100) / 100,
    };
  });
}

export const CLOUD_TEXTURE = buildTexture(61);
