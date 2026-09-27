import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, easing, fonts, radii } from '../../theme/tokens';
import { PressableScale } from '../ui/PressableScale';

interface OptionToggleProps {
  label: string;
  hint: string;
  sample: string;
  value: boolean;
  onToggle: () => void;
}

const TRACK_WIDTH = 46;
const KNOB = 20;
const TRAVEL = TRACK_WIDTH - KNOB - 6;

function Switch({ value }: { value: boolean }) {
  const progress = useAnimatedValue(value ? 1 : 0);

  useEffect(() => {
    Animated.timing(progress, { toValue: value ? 1 : 0, duration: 260, easing: easing.drawer, useNativeDriver: false }).start();
  }, [progress, value]);

  const backgroundColor = progress.interpolate({ inputRange: [0, 1], outputRange: ['rgba(160,184,220,0.12)', colors.amber] });
  const knobColor = progress.interpolate({ inputRange: [0, 1], outputRange: [colors.muted, colors.onAmber] });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });

  return (
    <Animated.View style={[styles.track, { backgroundColor }]}>
      <Animated.View style={[styles.knob, { backgroundColor: knobColor, transform: [{ translateX }] }]} />
    </Animated.View>
  );
}

export function OptionToggle({ label, hint, sample, value, onToggle }: OptionToggleProps) {
  return (
    <PressableScale
      onPress={onToggle}
      pressedScale={0.985}
      focusRadius={radii.control + 4}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={({ hovered }) => [styles.row, hovered && styles.rowHover]}
    >
      <View style={[styles.sample, value && styles.sampleOn]}>
        <Text style={[styles.sampleText, value && styles.sampleTextOn]}>{sample}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Switch value={value} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: radii.control,
  },
  rowHover: {
    backgroundColor: 'rgba(160,184,220,0.05)',
  },
  sample: {
    width: 50,
    height: 40,
    borderRadius: radii.control,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(160,184,220,0.03)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  sampleOn: {
    backgroundColor: colors.amberWash,
    borderColor: colors.amberLine,
  },
  sampleText: {
    fontFamily: fonts.code,
    fontSize: 12,
    color: colors.dim,
  },
  sampleTextOn: {
    color: colors.amber,
  },
  copy: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 17,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 19,
    color: colors.muted,
  },
  track: {
    width: TRACK_WIDTH,
    height: KNOB + 6,
    borderRadius: radii.control,
    padding: 3,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: radii.tight,
  },
});
