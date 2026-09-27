import { StyleSheet, View, Animated, useWindowDimensions } from 'react-native';

import { colors } from '../../theme/tokens';
import { EMBLEM_VIEW, SignalEmblem } from '../scene/SignalEmblem';

interface BatWipeProps {
  progress: Animated.Value;
  animated: boolean;
}

export function BatWipe({ progress, animated }: BatWipeProps) {
  const { width } = useWindowDimensions();
  const emblemWidth = Math.min(420, width * 0.78);
  const emblemHeight = emblemWidth * (EMBLEM_VIEW.height / EMBLEM_VIEW.width);

  const veil = progress.interpolate({ inputRange: [0, 0.62, 1, 2], outputRange: [0, 0, 1, 0], extrapolate: 'clamp' });
  const emblemOpacity = progress.interpolate({ inputRange: [0, 0.16, 0.84, 1], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });
  const scale = progress.interpolate({
    inputRange: [0, 0.32, 0.58, 0.8, 1],
    outputRange: [0.62, 1, 2.3, 7, 26],
    extrapolate: 'clamp',
  });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '4deg'], extrapolate: 'clamp' });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.layer]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.veil, { opacity: veil }]} />
      {animated && (
        <View style={styles.center}>
          <Animated.View style={{ width: emblemWidth, height: emblemHeight, opacity: emblemOpacity, transform: [{ rotate }, { scale }] }}>
            <SignalEmblem id="wipe" width={emblemWidth} />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    zIndex: 2,
  },
  veil: {
    backgroundColor: colors.night,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
