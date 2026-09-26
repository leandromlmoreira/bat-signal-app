import type { SceneLayout } from '../../hooks/useSceneLayout';

export const LENS_TILT = 0.34;

export function rooftopGeometry(layout: SceneLayout) {
  const { pivot, roofY, scale, width } = layout;
  const left = Math.max(-40, pivot.x - (layout.wide ? 260 : 190) * scale);
  const right = Math.min(width + 40, pivot.x + (layout.wide ? 230 : 170) * scale);

  return {
    left,
    right,
    roofY,
    scale,
    parapetHeight: 7 * scale,
    pedestalTop: roofY - 12 * scale,
    mast: { x: right - 22 * scale, top: roofY - 128 * scale },
    bulkhead: { x: layout.wide ? pivot.x + 62 * scale : left + 26 * scale, width: 60 * scale, height: 40 * scale },
    unit: { x: right - 86 * scale, width: 46 * scale, height: 20 * scale },
  };
}

export type RooftopGeometry = ReturnType<typeof rooftopGeometry>;
