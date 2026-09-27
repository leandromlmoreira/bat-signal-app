import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { METER_MARKS, meterProgress, type Strength } from '../../domain/strength.ts';
import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, easing, fonts } from '../../theme/tokens';
import { strengthColors } from './palette';

const TICKS = 40;
const TICK_KEYS = Array.from({ length: TICKS }, (_, index) => index);

const RAMP = TICK_KEYS.map((key) => 0.35 + (0.65 * key) / (TICKS - 1));

function TickRow({ color, width, ramp = false }: { color: string; width?: number; ramp?: boolean }) {
  return (
    <View style={[styles.tickRow, width ? { width } : null]}>
      {TICK_KEYS.map((key) => (
        <View key={key} style={[styles.tick, { backgroundColor: color, opacity: ramp ? RAMP[key] : 1 }]} />
      ))}
    </View>
  );
}

function useFill(progress: number) {
  const fill = useAnimatedValue(progress);

  useEffect(() => {
    const move = Animated.timing(fill, { toValue: progress, duration: 620, easing: easing.out, useNativeDriver: false });
    move.start();
    return () => move.stop();
  }, [fill, progress]);

  return fill;
}

function Gauge({ progress, color }: { progress: number; color: string }) {
  const [width, setWidth] = useState(0);
  const fill = useFill(progress);
  const litWidth = fill.interpolate({ inputRange: [0, 1], outputRange: [0, width] });

  return (
    <View>
      <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <TickRow color="rgba(160,184,220,0.12)" />
        {width > 0 && (
          <Animated.View style={[styles.lit, { width: litWidth }]}>
            <TickRow color={color} width={width} ramp />
          </Animated.View>
        )}
      </View>
      <View style={styles.marks}>
        {METER_MARKS.map((mark) => (
          <View key={mark.bits} style={[styles.mark, { left: `${mark.progress * 100}%` }]}>
            <View style={styles.markLine} />
            <Text style={styles.markText}>{mark.bits}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function StrengthMeter({ strength }: { strength: Strength }) {
  const color = strengthColors[strength.level];
  const bits = Math.round(strength.bits);

  return (
    <View style={styles.container} accessible accessibilityLabel={`Força ${strength.label}, ${bits} bits de entropia`}>
      <View style={styles.header}>
        <Text style={styles.caption}>Análise de entropia</Text>
        <Text style={styles.caption}>
          Nível <Text style={styles.captionValue}>{strength.score}/4</Text>
        </Text>
      </View>
      <View style={styles.readout}>
        <Text style={styles.bits}>
          <Text style={[styles.bitsValue, { color }]}>{bits}</Text>
          <Text style={styles.bitsUnit}> bits</Text>
        </Text>
        <Text style={[styles.level, { color }]}>{strength.label}</Text>
      </View>
      <Gauge progress={meterProgress(strength.bits)} color={color} />
      <View style={styles.crack}>
        <Text style={styles.crackLabel}>Força bruta a 100 bi tentativas/s</Text>
        <Text style={styles.crackValue}>{strength.crackTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  captionValue: {
    color: colors.muted,
  },
  readout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  bits: {
    includeFontPadding: false,
  },
  bitsValue: {
    fontFamily: fonts.display,
    fontSize: 58,
    lineHeight: 64,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  bitsUnit: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  level: {
    marginBottom: 10,
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  tickRow: {
    height: 22,
    flexDirection: 'row',
    gap: 3,
  },
  tick: {
    flex: 1,
    borderRadius: 1,
  },
  lit: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  marks: {
    height: 20,
  },
  mark: {
    position: 'absolute',
    top: 0,
    alignItems: 'flex-start',
  },
  markLine: {
    width: 1,
    height: 6,
    backgroundColor: colors.hairlineStrong,
  },
  markText: {
    marginTop: 2,
    marginLeft: -2,
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.dim,
  },
  crack: {
    gap: 3,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  crackLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  crackValue: {
    fontFamily: fonts.label,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 0.4,
    color: colors.text,
  },
});
