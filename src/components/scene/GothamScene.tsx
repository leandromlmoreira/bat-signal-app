import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useLightning, type Strike } from '../../hooks/useLightning';
import { useParallax } from '../../hooks/useParallax';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { colors } from '../../theme/tokens';
import { Flash, OpeningFade, Vignette } from './Atmosphere';
import { Beam, RAIN_SPEED } from './Beam';
import { CloudBand } from './CloudBand';
import { LightningSky, LightningWash } from './Lightning';
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
  onStrike?: (strike: Strike) => void;
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

function GothamSceneView({ layout, power, animated, onStrike }: GothamSceneProps) {
  const { width, height, target, projectionWidth, skyTop, roofY, angle, scale } = layout;
  const projectionHeight = projectionWidth * 0.64;
  const shapes = useSkylineShapes(layout);
  const parallax = useParallax(animated);
  const lightning = useLightning(animated, onStrike);
  const far = useMemo(() => parallax(5), [parallax]);
  const mid = useMemo(() => parallax(11), [parallax]);
  const near = useMemo(() => parallax(20), [parallax]);
  const span = roofY - skyTop;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.scene]}>
      <Sky width={width} height={height} horizonY={roofY} moon={layout.moon} />
      <CloudBand id="cloudHigh" width={width} top={-40} height={target.y + 40} seed={3} duration={190000} color="#0C121C" opacity={0.95} density={1.5} animated={animated} />
      <CloudBand id="cloudMid" width={width} top={target.y - projectionHeight * 0.85} height={projectionHeight * 1.7} seed={7} duration={120000} color="#1A2332" opacity={0.92} density={1.4} animated={animated} />
      <Projection layout={layout} power={power} animated={animated} />
      <CloudBand id="cloudLow" width={width} top={skyTop - 70 * scale} height={130 * scale} seed={13} duration={150000} color="#1E2837" opacity={0.8} density={1.1} animated={animated} />
      <LightningSky layout={layout} lightning={lightning} />
      <SkylineLayer id="fogFar" width={width} height={height} margin={PARALLAX_MARGIN} fill="#0B111B" lightOpacity={0.38} fogColor="#1A2638" fogTop={skyTop + span * 0.4} fogBottom={roofY + 40} shape={shapes.far} parallax={far} animated={animated} />
      <CloudBand id="fogBank" width={width} top={skyTop + span * 0.45} height={span * 0.7} seed={31} duration={95000} color="#2A3950" opacity={0.42} density={1.2} animated={animated} />
      <SkylineLayer id="fogMid" width={width} height={height} margin={PARALLAX_MARGIN} fill="#070C14" lightOpacity={0.7} fogColor="#111A28" fogTop={roofY - 20} fogBottom={roofY + 110} shape={shapes.mid} parallax={mid} animated={animated} />
      <Beam layout={layout} power={power} animated={animated} />
      <CloudBand id="cloudWisp" width={width} top={target.y - projectionHeight * 0.35} height={projectionHeight * 0.7} seed={21} duration={70000} color="#2C3A52" opacity={0.34} density={0.7} animated={animated} />
      {animated && <Rain width={width} height={height} angle={angle} opacity={0.2} speed={RAIN_SPEED * 0.65} animated={animated} density={0.8} minLength={10} maxLength={20} seed={5} color="#9FB2D6" strokeWidth={0.7} />}
      <SkylineLayer id="fogNear" width={width} height={height} margin={PARALLAX_MARGIN} fill="#04070C" lightOpacity={0.5} fogColor={colors.night} fogTop={roofY + 110 * scale} fogBottom={height} shape={shapes.near} parallax={near} animated={animated} />
      <Rooftop layout={layout} />
      <SearchlightGlow layout={layout} power={power} animated={animated} />
      {animated && <Rain width={width} height={height} angle={angle} opacity={0.3} speed={RAIN_SPEED} animated={animated} density={0.5} minLength={18} maxLength={34} seed={9} color="#C3D0E8" strokeWidth={1} />}
      <LightningWash lightning={lightning} />
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
