import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BEAM_ANGLE = 13;

const WIDE_BREAKPOINT = 900;
const LANDSCAPE_BREAKPOINT = 640;
const SHORT_HEIGHT = 700;
const TO_RADIANS = Math.PI / 180;

export interface Point {
  x: number;
  y: number;
}

export interface SceneLayout {
  width: number;
  height: number;
  wide: boolean;
  short: boolean;
  narrow: boolean;
  scale: number;
  insets: { top: number; bottom: number };
  angle: number;
  roofY: number;
  pivot: Point;
  lamp: Point;
  target: Point;
  projectionWidth: number;
  beamLength: number;
  skyTop: number;
  drumLength: number;
  drumWidth: number;
  lensOffset: number;
  moon: Point;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function computeSceneLayout(width: number, height: number, top: number, bottom: number): SceneLayout {
  const wide = width >= WIDE_BREAKPOINT || (width > height && width >= LANDSCAPE_BREAKPOINT);
  const scale = wide ? clamp(height / 620, 0.8, 1.7) : 1;
  const angle = BEAM_ANGLE;
  const tangent = Math.tan(angle * TO_RADIANS);

  const drumLength = 30 * scale;
  const drumWidth = 42 * scale;
  const lensOffset = drumLength / 2;

  const projectionWidth = wide
    ? Math.min(width * 0.32, 500, height * 0.5)
    : Math.min(width * 0.7, 300, height * 0.34);
  const projectionHeight = projectionWidth * 0.64;

  const roofY = wide ? height * 0.77 : height - bottom - 292;
  const targetY = wide
    ? Math.max(height * 0.27, projectionHeight * 0.62 + 24)
    : top + 152 + projectionHeight * 0.5;

  const pivotX = wide ? width * 0.62 : Math.min(width * 0.3, 190);
  const pivotY = roofY - 36 * scale;
  const pivot = { x: pivotX, y: pivotY };
  const lamp = {
    x: pivotX + lensOffset * Math.sin(angle * TO_RADIANS),
    y: pivotY - lensOffset * Math.cos(angle * TO_RADIANS),
  };
  const target = { x: lamp.x + tangent * (lamp.y - targetY), y: targetY };
  const beamLength = Math.hypot(target.x - lamp.x, target.y - lamp.y);
  const skyTop = target.y + projectionHeight * 0.55;

  return {
    width,
    height,
    wide,
    short: wide && height < SHORT_HEIGHT,
    narrow: width < 400,
    scale,
    insets: { top, bottom },
    angle,
    roofY,
    pivot,
    lamp,
    target,
    projectionWidth,
    beamLength,
    skyTop,
    drumLength,
    drumWidth,
    lensOffset,
    moon: wide ? { x: width * 0.86, y: height * 0.15 } : { x: width * 0.82, y: skyTop + 18 },
  };
}

export function useSceneLayout(extraTop = 0) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(
    () => computeSceneLayout(width, height, insets.top + extraTop, insets.bottom),
    [width, height, insets.top, insets.bottom, extraTop],
  );
}
