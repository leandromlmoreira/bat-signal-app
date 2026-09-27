import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type { Strength } from '../../domain/strength.ts';
import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, easing, fonts, nativeDriver } from '../../theme/tokens';
import { strengthColors } from './palette';

const SEGMENTS = 4;

function Segment({ active, color, delay }: { active: boolean; color: string; delay: number }) {
  const fill = useAnimatedValue(active ? 1 : 0);

  useEffect(() => {
    Animated.timing(fill, { toValue: active ? 1 : 0, duration: 420, delay, easing: easing.out, useNativeDriver: nativeDriver }).start();
  }, [active, delay, fill]);

  return (
    <View style={styles.segment}>
      <Animated.View style={[styles.segmentFill, { backgroundColor: color, opacity: fill }]} />
    </View>
  );
}

export function StrengthMeter({ strength }: { strength: Strength }) {
  const color = strengthColors[strength.level];

  return (
    <View style={styles.container} accessible accessibilityLabel={`Força ${strength.label}, ${Math.round(strength.bits)} bits de entropia`}>
      <View style={styles.header}>
        <Text style={[styles.level, { color }]}>{strength.label}</Text>
        <Text style={styles.bits}>
          <Text style={styles.bitsValue}>{Math.round(strength.bits)}</Text> bits
        </Text>
      </View>
      <View style={styles.track}>
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <Segment key={index} active={index < strength.score} color={color} delay={index * 60} />
        ))}
      </View>
      <Text style={styles.crack}>
        Força bruta a 100 bilhões de tentativas por segundo levaria <Text style={styles.crackValue}>{strength.crackTime}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  level: {
    fontFamily: fonts.display,
    fontSize: 30,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  bits: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  bitsValue: {
    fontFamily: fonts.monoBold,
    fontSize: 13,
    color: colors.text,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  segmentFill: {
    ...StyleSheet.absoluteFill,
  },
  crack: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.muted,
  },
  crackValue: {
    fontFamily: fonts.label,
    color: colors.text,
  },
});
