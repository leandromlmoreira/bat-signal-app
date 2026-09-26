import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useParallax } from '../../hooks/useParallax';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { colors } from '../../theme/tokens';
import { Flash, OpeningFade, Vignette } from './Atmosphere';
import { Beam, RAIN_SPEED } from './Beam';
import { CloudBand } from './CloudBand';
import { Projection } from './Projection';
import { Rain } from './Rain';
import { Rooftop } from './Rooftop';
import { SearchlightGlow } from './SearchlightGlow';
import { SkylineLayer } from './SkylineLayer';
import { Sky } from './Sky';

interface GothamSceneProps {
  layout: SceneLayout;
  power: SignalPower;
  animated: boolean;
}

const PARALLAX_MARGIN = 32;

function useSkylineShapes(layout: SceneLayout) {
  const { skyTop, roofY, scale } = layout;
  const span = roofY - skyTop;

  return useMemo(
    () => ({
      far: {
        minTop: skyTop,
        maxTop: skyTop + span * 0.55,
        minWidth: 26 * scale,
        maxWidth: 72 * scale,
        seed: 11,
        litChance: 0.05,
        windowScale: 0.7 * scale,
        blinkChance: 0.05,
      },
      mid: {
        minTop: skyTop + span * 0.28,
        maxTop: skyTop + span * 0.85,
        minWidth: 34 * scale,
        maxWidth: 92 * scale,
        seed: 29,
        litChance: 0.08,
        windowScale: 0.95 * scale,
        blinkChance: 0.08,
      },
      near: {
        minTop: roofY + 18 * scale,
        maxTop: roofY + 96 * scale,
        minWidth: 56 * scale,
        maxWidth: 130 * scale,
        seed: 53,
        litChance: 0.07,
        windowScale: 1.05 * scale,
        blinkChance: 0.07,
      },
    }),
    [skyTop, span, roofY, scale],
  );
}

function GothamSceneView({ layout, power, animated }: GothamSceneProps) {
  const { width, height, target, projectionWidth, skyTop, roofY, angle, scale } = layout;
  const projectionHeight = projectionWidth * 0.64;
  const shapes = useSkylineShapes(layout);
  const parallax = useParallax(animated);
  const far = useMemo(() => parallax(5), [parallax]);
  const mid = useMemo(() => parallax(11), [parallax]);
  const near = useMemo(() => parallax(20), [parallax]);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scene]}>
      <Sky width={width} height={height} horizonY={roofY} moon={layout.moon} />
      <CloudBand id="cloudHigh" width={width} top={-30} height={target.y + 30} seed={3} duration={170000} color="#131B2D" opacity={0.95} density={1.4} animated={animated} />
      <CloudBand id="cloudMid" width={width} top={target.y - projectionHeight * 0.8} height={projectionHeight * 1.6} seed={7} duration={115000} color="#2A3349" opacity={0.9} density={1.3} animated={animated} />
      <Projection layout={layout} power={power} animated={animated} />
      <CloudBand id="cloudLow" width={width} top={skyTop - 60 * scale} height={120 * scale} seed={13} duration={140000} color="#2F2A36" opacity={0.75} density={1} animated={animated} />
      <SkylineLayer id="fogFar" width={width} height={height} margin={PARALLAX_MARGIN} fill="#0F1526" lightOpacity={0.4} fogColor="#1C2132" fogTop={skyTop + (roofY - skyTop) * 0.45} fogBottom={roofY + 40} shape={shapes.far} parallax={far} animated={animated} />
      <SkylineLayer id="fogMid" width={width} height={height} margin={PARALLAX_MARGIN} fill="#0A0F1B" lightOpacity={0.72} fogColor="#141927" fogTop={roofY - 20} fogBottom={roofY + 110} shape={shapes.mid} parallax={mid} animated={animated} />
      <Beam layout={layout} power={power} animated={animated} />
      <CloudBand id="cloudWisp" width={width} top={target.y - projectionHeight * 0.3} height={projectionHeight * 0.6} seed={21} duration={75000} color="#3A4460" opacity={0.3} density={0.6} animated={animated} />
      <Rain width={width} height={height} angle={angle} opacity={0.2} speed={RAIN_SPEED * 0.65} animated={animated} density={0.7} minLength={10} maxLength={20} seed={5} color="#9FB2D6" strokeWidth={0.8} />
      <SkylineLayer id="fogNear" width={width} height={height} margin={PARALLAX_MARGIN} fill="#05080E" lightOpacity={0.5} fogColor={colors.night} fogTop={roofY + 110 * scale} fogBottom={height} shape={shapes.near} parallax={near} animated={animated} />
      <Rooftop layout={layout} />
      <SearchlightGlow layout={layout} power={power} animated={animated} />
      <Rain width={width} height={height} angle={angle} opacity={0.32} speed={RAIN_SPEED} animated={animated} density={0.45} minLength={18} maxLength={34} seed={9} color="#C3D0E8" strokeWidth={1.1} />
      <Flash power={power} />
      <Vignette width={width} height={height} />
      <OpeningFade />
    </View>
  );
}

export const GothamScene = memo(GothamSceneView);

const styles = StyleSheet.create({
  scene: { backgroundColor: colors.night, overflow: 'hidden' },
});
