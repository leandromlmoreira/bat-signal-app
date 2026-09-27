import { Easing, Platform } from "react-native";
import type { StrengthLevel } from "../domain/strength.ts";
import type { CharClass } from "../domain/charsets.ts";

export const colors = {
  night: "#05060A",
  nightRaised: "#0A0C12",
  shell: "rgba(255,255,255,0.035)",
  core: "#0E1118",
  coreRaised: "#141824",
  hairline: "rgba(255,255,255,0.07)",
  hairlineStrong: "rgba(255,255,255,0.13)",
  highlight: "rgba(255,255,255,0.06)",
  text: "#EEEAE0",
  textMuted: "#8E93A1",
  textFaint: "#5A606E",
  signal: "#F5C84B",
  signalDeep: "#D9A61E",
  signalSoft: "rgba(245,200,75,0.12)",
  signalGlow: "rgba(245,200,75,0.28)",
  ice: "#8CB8FF",
  ink: "#0B0B0D",
};

export const strengthColors: Record<StrengthLevel, string> = {
  weak: "#FF6B5E",
  fair: "#F5A54B",
  strong: "#F5C84B",
  fortress: "#7BE3B5",
};

export const glyphColors: Record<CharClass, string> = {
  lowercase: colors.text,
  uppercase: colors.text,
  numbers: colors.signal,
  symbols: colors.ice,
};

export const fonts = {
  display: "BigShouldersDisplay_800ExtraBold",
  displayBlack: "BigShouldersDisplay_900Black",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
  mono: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
};

export const radii = {
  shell: 30,
  core: 24,
  control: 16,
  pill: 999,
};

export const easing = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
};

export const useNativeDriver = Platform.OS !== "web";
