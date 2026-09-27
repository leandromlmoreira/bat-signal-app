import { StyleSheet, Text, View } from "react-native";
import { BatGlyph, ShieldIcon } from "./Icons.tsx";
import { colors, fonts, radii } from "../theme/tokens.ts";

export function BrandBar({ compact }: { compact: boolean }) {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <View style={styles.mark}>
          <BatGlyph size={26} color={colors.ink} />
        </View>
        <Text style={styles.wordmark}>
          Bat<Text style={styles.wordmarkAccent}>Pass</Text>
        </Text>
      </View>
      <View style={styles.badge}>
        <ShieldIcon color={colors.signal} size={15} />
        <Text style={styles.badgeText}>{compact ? "Offline" : "Tudo no seu aparelho, nada no servidor"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.signal,
  },
  wordmark: {
    fontFamily: fonts.displayBlack,
    fontSize: 26,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.text,
  },
  wordmarkAccent: {
    color: colors.signal,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  badgeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.textMuted,
  },
});
