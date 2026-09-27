import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { BezelCard } from "./BezelCard.tsx";
import { Eyebrow } from "./Eyebrow.tsx";
import { SignalScene } from "./SignalScene.tsx";
import { colors, fonts } from "../theme/tokens.ts";

const FACTS = [
  { value: "Web Crypto", label: "aleatoriedade criptográfica" },
  { value: "0 bytes", label: "enviados para servidores" },
  { value: "8 a 64", label: "caracteres por senha" },
];

function Facts({ compact }: { compact: boolean }) {
  return (
    <View style={compact ? styles.factsCompact : styles.facts}>
      {FACTS.map((fact, index) => (
        <View
          key={fact.value}
          style={compact ? [styles.factCompact, index > 0 && styles.factDivider] : styles.fact}
        >
          <Text style={[styles.factValue, compact && styles.factValueCompact]}>{fact.value}</Text>
          <Text style={styles.factLabel}>{fact.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function HeroCard({ compact }: { compact: boolean }) {
  const titleSize = compact ? 54 : 92;
  return (
    <BezelCard style={styles.shell} coreStyle={[styles.core, compact && styles.coreCompact]}>
      <SignalScene anchor={compact ? "right" : "center"} />
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={["rgba(5,6,10,0)", "rgba(5,6,10,0.88)"]}
        locations={compact ? [0.2, 0.5] : [0.55, 1]}
      />
      <View style={[styles.content, compact && styles.contentCompact]}>
        <Eyebrow label="Gerador de senhas" />
        <Text accessibilityRole="header" style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 0.9 }]}>
          Senhas que{"\n"}Gotham{"\n"}
          <Text style={styles.titleAccent}>não quebra.</Text>
        </Text>
        <Text style={[styles.lead, compact && styles.leadCompact]}>
          Força medida em bits de entropia de verdade, gerada com aleatoriedade criptográfica e guardada só com você.
        </Text>
      </View>
      <Facts compact={compact} />
    </BezelCard>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexGrow: 1,
  },
  core: {
    minHeight: 620,
    padding: 40,
    justifyContent: "space-between",
    backgroundColor: colors.night,
  },
  coreCompact: {
    minHeight: 0,
    padding: 22,
  },
  content: {
    gap: 20,
    maxWidth: 520,
  },
  contentCompact: {
    gap: 16,
    paddingTop: 150,
  },
  title: {
    fontFamily: fonts.displayBlack,
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: colors.text,
  },
  titleAccent: {
    color: colors.signal,
  },
  lead: {
    maxWidth: 400,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 25,
    color: "#B9BCC6",
  },
  leadCompact: {
    fontSize: 15,
    lineHeight: 23,
  },
  facts: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  fact: {
    flex: 1,
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(8,10,16,0.78)",
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  factsCompact: {
    marginTop: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(8,10,16,0.82)",
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  factCompact: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
  },
  factDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  factValue: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 0.5,
    color: colors.text,
  },
  factValueCompact: {
    fontSize: 18,
  },
  factLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
