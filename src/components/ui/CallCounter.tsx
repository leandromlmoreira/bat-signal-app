import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAnimatedValue } from '../../hooks/useLoop';
import { formatCallCount } from '../../lib/format';
import { colors, fonts, nativeDriver } from '../../theme/tokens';

interface CallCounterProps {
  calls: number;
  size: number;
}

export function CallCounter({ calls, size }: CallCounterProps) {
  const bump = useAnimatedValue(0);

  useEffect(() => {
    if (calls === 0) return;
    bump.setValue(1);
    const settle = Animated.spring(bump, { toValue: 0, stiffness: 260, damping: 18, useNativeDriver: nativeDriver });
    settle.start();
    return () => settle.stop();
  }, [calls, bump]);

  const scale = bump.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const translateY = bump.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const digits = formatCallCount(calls);
  const leading = digits.length - String(calls).length;

  return (
    <View style={styles.counter} accessible accessibilityLabel={`${calls} chamados nesta noite`}>
      <Text style={styles.label}>Chamados</Text>
      <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
        <Text style={[styles.value, { fontSize: size, lineHeight: size * 1.08 }]}>
          <Text style={styles.leading}>{digits.slice(0, leading)}</Text>
          {digits.slice(leading)}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    minWidth: 76,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.dim,
    marginBottom: 2,
  },
  value: {
    fontFamily: fonts.display,
    color: colors.amber,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  leading: {
    color: 'rgba(255,197,61,0.26)',
  },
});
