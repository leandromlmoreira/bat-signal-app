import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PressableScale } from "./PressableScale.tsx";
import { colors, fonts, radii } from "../theme/tokens.ts";

interface Props {
  label: string;
  icon: (color: string) => ReactNode;
  onPress: () => void;
  variant?: "primary" | "ghost";
  accessibilityHint?: string;
  grow?: boolean;
}

export function ActionButton({ label, icon, onPress, variant = "primary", accessibilityHint, grow }: Props) {
  const primary = variant === "primary";
  const foreground = primary ? colors.ink : colors.text;
  return (
    <PressableScale
      wrapperStyle={grow ? styles.grow : undefined}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ hovered }) => [
        styles.button,
        primary ? styles.primary : styles.ghost,
        hovered && (primary ? styles.primaryHover : styles.ghostHover),
      ]}
    >
      {({ hovered }) => (
        <>
          <Text style={[styles.label, { color: foreground }]}>{label}</Text>
          <View
            style={[
              styles.iconWell,
              primary ? styles.iconWellPrimary : styles.iconWellGhost,
              hovered && styles.iconWellHover,
            ]}
          >
            {icon(foreground)}
          </View>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  button: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    paddingLeft: 24,
    paddingRight: 8,
    borderRadius: radii.pill,
  },
  primary: {
    backgroundColor: colors.signal,
  },
  primaryHover: {
    backgroundColor: "#FFD563",
  },
  ghost: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  ghostHover: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWellPrimary: {
    backgroundColor: "rgba(11,11,13,0.1)",
  },
  iconWellGhost: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  iconWellHover: {
    transform: [{ translateX: 2 }, { scale: 1.06 }],
  },
});
