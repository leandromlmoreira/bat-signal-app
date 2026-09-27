import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radii } from "../theme/tokens.ts";

export function Eyebrow({ label, tone = "muted" }: { label: string; tone?: "muted" | "signal" }) {
  const signal = tone === "signal";
  return (
    <View style={[styles.pill, signal && styles.pillSignal]}>
      {signal ? <View style={styles.dot} /> : null}
      <Text style={[styles.text, signal && styles.textSignal]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  pillSignal: {
    borderColor: "rgba(245,200,75,0.25)",
    backgroundColor: colors.signalSoft,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.signal,
  },
  text: {
    fontFamily: fonts.bodyMedium,
    fontSize: 10.5,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  textSignal: {
    color: colors.signal,
  },
});
