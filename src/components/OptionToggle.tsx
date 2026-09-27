import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { PressableScale } from "./PressableScale.tsx";
import { colors, easing, fonts, radii } from "../theme/tokens.ts";

interface Props {
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
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 260,
      easing: easing.drawer,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.08)", colors.signal],
  });
  const knobColor = progress.interpolate({ inputRange: [0, 1], outputRange: [colors.textMuted, colors.ink] });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, TRAVEL] });

  return (
    <Animated.View style={[styles.track, { backgroundColor }]}>
      <Animated.View style={[styles.knob, { backgroundColor: knobColor, transform: [{ translateX }] }]} />
    </Animated.View>
  );
}

export function OptionToggle({ label, hint, sample, value, onToggle }: Props) {
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
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radii.control,
  },
  rowHover: {
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  sample: {
    width: 48,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  sampleOn: {
    backgroundColor: colors.signalSoft,
    borderColor: "rgba(245,200,75,0.22)",
  },
  sampleText: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textFaint,
  },
  sampleTextOn: {
    color: colors.signal,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textMuted,
  },
  track: {
    width: TRACK_WIDTH,
    height: KNOB + 6,
    borderRadius: 13,
    padding: 3,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
  },
});
