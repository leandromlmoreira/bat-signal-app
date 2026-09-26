import { memo, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useAnimatedValue } from '../../hooks/useLoop';
import type { SignalPower } from '../../hooks/useSignalPower';
import { colors, easing, nativeDriver } from '../../theme/tokens';

interface SizeProps {
  width: number;
  height: number;
}

function VignetteView({ width, height }: SizeProps) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="vignette" cx="50%" cy="42%" r="72%">
          <Stop offset="0.5" stopColor="#000000" stopOpacity={0} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0.72} />
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />
    </Svg>
  );
}

export const Vignette = memo(VignetteView);

export function Flash({ power }: { power: SignalPower }) {
  const opacity = power.strike.interpolate({ inputRange: [0, 1], outputRange: [0, 0.26] });
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.flash, { opacity }]} />;
}

export function OpeningFade() {
  const curtain = useAnimatedValue(1);

  useEffect(() => {
    const reveal = Animated.timing(curtain, {
      toValue: 0,
      duration: 1600,
      delay: 150,
      easing: easing.drawer,
      useNativeDriver: nativeDriver,
    });
    reveal.start();
    return () => reveal.stop();
  }, [curtain]);

  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.curtain, { opacity: curtain }]} />;
}

const styles = StyleSheet.create({
  flash: { backgroundColor: '#FFE7B0' },
  curtain: { backgroundColor: colors.night },
});
