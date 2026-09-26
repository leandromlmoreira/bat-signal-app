import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import type { SceneLayout } from '../../hooks/useSceneLayout';
import { createRandom } from '../../lib/random';
import { LENS_TILT, rooftopGeometry, type RooftopGeometry } from './rooftopGeometry';

interface RooftopProps {
  layout: SceneLayout;
}

function facadeWindows(geometry: RooftopGeometry, height: number) {
  const random = createRandom(2718);
  const { left, right, roofY, scale } = geometry;
  const cellWidth = 14 * scale;
  const cellHeight = 20 * scale;
  let path = '';

  for (let y = roofY + 30 * scale; y < height; y += cellHeight) {
    for (let x = left + 14 * scale; x < right - 14 * scale; x += cellWidth) {
      if (random.chance(0.13)) {
        path += `M${x.toFixed(1)} ${y.toFixed(1)}h${(5 * scale).toFixed(1)}v${(8 * scale).toFixed(1)}h${(-5 * scale).toFixed(1)}Z`;
      }
    }
  }

  return path;
}


function cylinderPath(centerX: number, top: number, bottom: number, radius: number, tilt: number) {
  const left = centerX - radius;
  const right = centerX + radius;
  return `M${left} ${top}L${left} ${bottom}A${radius} ${tilt} 0 0 0 ${right} ${bottom}L${right} ${top}Z`;
}

function ribPath(centerX: number, y: number, radius: number, tilt: number) {
  return `M${centerX - radius} ${y}A${radius} ${tilt} 0 0 0 ${centerX + radius} ${y}`;
}

function Searchlight({ layout }: RooftopProps) {
  const { pivot, drumLength, drumWidth, scale, angle, roofY } = layout;
  const radius = drumWidth / 2;
  const tilt = radius * LENS_TILT;
  const face = pivot.y - drumLength / 2;
  const back = pivot.y + drumLength / 2;
  const deckY = roofY - 12 * scale;
  const armX = radius + 6 * scale;

  return (
    <G>
      <Path
        d={`M${pivot.x - 24 * scale} ${roofY}L${pivot.x + 24 * scale} ${roofY}L${pivot.x + 15 * scale} ${deckY}L${pivot.x - 15 * scale} ${deckY}Z`}
        fill="#121925"
      />
      <Ellipse cx={pivot.x} cy={deckY} rx={20 * scale} ry={4 * scale} fill="#1D2638" />
      <Path
        d={`M${pivot.x - armX} ${pivot.y}L${pivot.x - armX + 4 * scale} ${deckY}L${pivot.x + armX - 4 * scale} ${deckY}L${pivot.x + armX} ${pivot.y}L${pivot.x + armX - 4 * scale} ${pivot.y}L${pivot.x + armX - 7 * scale} ${deckY - 5 * scale}L${pivot.x - armX + 7 * scale} ${deckY - 5 * scale}L${pivot.x - armX + 4 * scale} ${pivot.y}Z`}
        fill="#1A2233"
      />
      <G transform={`rotate(${angle} ${pivot.x} ${pivot.y})`}>
        <Path d={cylinderPath(pivot.x, face, back, radius * 0.7, tilt * 0.7)} fill="#0B0F17" transform={`translate(0 ${6 * scale})`} />
        <Path d={cylinderPath(pivot.x, face, back, radius, tilt)} fill="url(#drum)" />
        {[0.38, 0.62].map((step) => (
          <Path key={step} d={ribPath(pivot.x, face + drumLength * step, radius, tilt)} stroke="#070A10" strokeWidth={1.4 * scale} fill="none" opacity={0.9} />
        ))}
        <Ellipse cx={pivot.x} cy={face} rx={radius + 2.5 * scale} ry={tilt + 2.5 * scale} fill="#2A3447" />
        <Ellipse cx={pivot.x} cy={face} rx={radius} ry={tilt} fill="url(#lens)" />
        <Path d={ribPath(pivot.x, face, radius * 0.72, tilt * 0.72)} stroke="#6F7C96" strokeWidth={1 * scale} fill="none" opacity={0.5} transform={`rotate(180 ${pivot.x} ${face})`} />
      </G>
      <Circle cx={pivot.x - armX + 2 * scale} cy={pivot.y} r={3.4 * scale} fill="#2C374B" />
      <Circle cx={pivot.x + armX - 2 * scale} cy={pivot.y} r={3.4 * scale} fill="#2C374B" />
    </G>
  );
}

function RooftopView({ layout }: RooftopProps) {
  const { width, height } = layout;
  const geometry = useMemo(() => rooftopGeometry(layout), [layout]);
  const windows = useMemo(() => facadeWindows(geometry, height), [geometry, height]);
  const { left, right, roofY, scale, parapetHeight, bulkhead, unit, mast } = geometry;
  const doorX = bulkhead.x + bulkhead.width * 0.46;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="slab" x1="0" y1={roofY} x2="0" y2={height} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#0C111C" />
          <Stop offset="1" stopColor="#03050A" />
        </LinearGradient>
        <LinearGradient id="drum" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#0C1019" />
          <Stop offset="0.55" stopColor="#2B3549" />
          <Stop offset="1" stopColor="#0A0D15" />
        </LinearGradient>
        <RadialGradient id="lens" cx="42%" cy="38%" r="60%">
          <Stop offset="0" stopColor="#46577A" />
          <Stop offset="1" stopColor="#111722" />
        </RadialGradient>
        <RadialGradient id="doorGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFB45C" stopOpacity={0.45} />
          <Stop offset="1" stopColor="#FFB45C" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={left} y={roofY} width={right - left} height={height - roofY} fill="url(#slab)" />
      <Rect x={left} y={roofY + 14 * scale} width={right - left} height={2 * scale} fill="#161E2C" />
      <Path d={windows} fill="#E7A452" opacity={0.3} />
      <Rect x={left - 5 * scale} y={roofY - parapetHeight} width={right - left + 10 * scale} height={parapetHeight} fill="#141B29" />
      <Rect x={left - 5 * scale} y={roofY - parapetHeight} width={right - left + 10 * scale} height={1} fill="#2E3950" />
      <Rect x={bulkhead.x - 4 * scale} y={roofY - bulkhead.height - 5 * scale} width={bulkhead.width + 8 * scale} height={5 * scale} fill="#172031" />
      <Rect x={bulkhead.x} y={roofY - bulkhead.height} width={bulkhead.width} height={bulkhead.height - parapetHeight} fill="#0C111B" />
      <Rect x={doorX} y={roofY - bulkhead.height * 0.66} width={16 * scale} height={bulkhead.height * 0.66 - parapetHeight} fill="#20170B" />
      <Ellipse cx={doorX + 8 * scale} cy={roofY - bulkhead.height * 0.74} rx={22 * scale} ry={16 * scale} fill="url(#doorGlow)" />
      <Circle cx={doorX + 8 * scale} cy={roofY - bulkhead.height * 0.74} r={1.8 * scale} fill="#FFD08A" />
      <Rect x={unit.x} y={roofY - parapetHeight - unit.height} width={unit.width} height={unit.height} rx={2 * scale} fill="#0F1522" />
      <Circle cx={unit.x + unit.width * 0.32} cy={roofY - parapetHeight - unit.height / 2} r={6.5 * scale} fill="none" stroke="#243049" strokeWidth={1.2 * scale} />
      <Rect x={mast.x - 1 * scale} y={mast.top} width={2 * scale} height={roofY - mast.top} fill="#1A2233" />
      {[0.22, 0.48, 0.74].map((step) => (
        <Rect key={step} x={mast.x - 6 * scale} y={mast.top + (roofY - mast.top) * step} width={12 * scale} height={1.2 * scale} fill="#1A2233" />
      ))}
      <Searchlight layout={layout} />
    </Svg>
  );
}

export const Rooftop = memo(RooftopView);
