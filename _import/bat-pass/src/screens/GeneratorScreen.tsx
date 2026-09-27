import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BezelCard } from "../components/BezelCard.tsx";
import { BrandBar } from "../components/BrandBar.tsx";
import { FadeIn } from "../components/FadeIn.tsx";
import { HeroCard } from "../components/HeroCard.tsx";
import { HistoryPanel } from "../components/HistoryPanel.tsx";
import { OptionsPanel } from "../components/OptionsPanel.tsx";
import { PasswordPanel } from "../components/PasswordPanel.tsx";
import type { HistoryEntry } from "../domain/history.ts";
import { useBreakpoint } from "../hooks/useBreakpoint.ts";
import { useCopyFeedback } from "../hooks/useCopyFeedback.ts";
import { useHistory } from "../hooks/useHistory.ts";
import { usePasswordGenerator } from "../hooks/usePasswordGenerator.ts";
import { colors, fonts } from "../theme/tokens.ts";

const CURRENT_KEY = "current";

export function GeneratorScreen() {
  const { wide, compact } = useBreakpoint();
  const generator = usePasswordGenerator();
  const history = useHistory();
  const clipboard = useCopyFeedback();

  const copyCurrent = useCallback(() => {
    clipboard.copy(generator.password, CURRENT_KEY);
    history.record(generator.password, generator.strength.bits);
  }, [clipboard, generator.password, generator.strength.bits, history]);

  const copyEntry = useCallback((entry: HistoryEntry) => clipboard.copy(entry.password, entry.id), [clipboard]);

  const generatorCard = (
    <BezelCard coreStyle={[styles.cardCore, compact && styles.cardCoreCompact]}>
      <PasswordPanel
        password={generator.password}
        strength={generator.strength}
        compact={compact}
        copied={clipboard.copiedKey === CURRENT_KEY}
        copyFailed={clipboard.failed}
        onCopy={copyCurrent}
        onRegenerate={generator.regenerate}
      />
      <View style={styles.sectionGap} />
      <OptionsPanel options={generator.options} onLengthChange={generator.setLength} onToggle={generator.toggle} />
    </BezelCard>
  );

  const historyCard = (
    <BezelCard coreStyle={[styles.cardCore, compact && styles.cardCoreCompact]}>
      <HistoryPanel
        entries={history.entries}
        ready={history.ready}
        copiedKey={clipboard.copiedKey}
        onCopy={copyEntry}
        onClear={history.clear}
      />
    </BezelCard>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, compact && styles.contentCompact]}>
      <View style={styles.frame}>
        <FadeIn>
          <BrandBar compact={!wide} />
        </FadeIn>
        {wide ? (
          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              <FadeIn delay={80} style={styles.grow}>
                <HeroCard compact={false} />
              </FadeIn>
              <FadeIn delay={240}>{historyCard}</FadeIn>
            </View>
            <FadeIn delay={160} style={styles.rightColumn}>
              {generatorCard}
            </FadeIn>
          </View>
        ) : (
          <View style={styles.stack}>
            <FadeIn delay={80}>
              <HeroCard compact={compact} />
            </FadeIn>
            <FadeIn delay={160}>{generatorCard}</FadeIn>
            <FadeIn delay={240}>{historyCard}</FadeIn>
          </View>
        )}
        <Text style={styles.footer}>
          BatPass · React Native + Expo · nada sai do seu aparelho
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.night,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 48,
  },
  contentCompact: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  frame: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
    gap: 28,
  },
  columns: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 20,
  },
  leftColumn: {
    flex: 1,
    gap: 20,
  },
  rightColumn: {
    width: 520,
  },
  grow: {
    flexGrow: 1,
  },
  stack: {
    gap: 16,
  },
  cardCore: {
    padding: 32,
  },
  cardCoreCompact: {
    padding: 20,
  },
  sectionGap: {
    height: 36,
  },
  footer: {
    textAlign: "center",
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.textFaint,
  },
});
