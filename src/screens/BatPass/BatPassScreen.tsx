import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroCard } from '../../components/batpass/HeroCard';
import { HistoryPanel } from '../../components/batpass/HistoryPanel';
import { OptionsPanel } from '../../components/batpass/OptionsPanel';
import { PasswordPanel } from '../../components/batpass/PasswordPanel';
import type { Chrome } from '../../components/shell/chrome';
import { BezelCard } from '../../components/ui/BezelCard';
import { Reveal } from '../../components/ui/Reveal';
import { Scrim } from '../../components/ui/Scrim';
import type { HistoryEntry } from '../../domain/history.ts';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useCopyFeedback } from '../../hooks/useCopyFeedback';
import { useHistory } from '../../hooks/useHistory';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { colors, fonts } from '../../theme/tokens';
import { VaultBackdrop } from './VaultBackdrop';

const CURRENT_KEY = 'current';

export function BatPassScreen({ chrome }: { chrome: Chrome }) {
  const { wide, compact } = useBreakpoint();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const fadeHeight = chrome.top + chrome.height + 44;
  const generator = usePasswordGenerator();
  const history = useHistory();
  const clipboard = useCopyFeedback();
  const { copy } = clipboard;
  const { password, strength } = generator;
  const { record } = history;

  const copyCurrent = useCallback(() => {
    copy(password, CURRENT_KEY);
    record(password, strength.bits);
  }, [copy, password, record, strength.bits]);

  const copyEntry = useCallback((entry: HistoryEntry) => copy(entry.password, entry.id), [copy]);

  const coreStyle = [styles.cardCore, compact && styles.cardCoreCompact];

  const generatorCard = (
    <BezelCard coreStyle={coreStyle}>
      <PasswordPanel
        password={password}
        strength={strength}
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
    <BezelCard style={wide && styles.grow} coreStyle={coreStyle}>
      <HistoryPanel entries={history.entries} ready={history.ready} copiedKey={clipboard.copiedKey} onCopy={copyEntry} onClear={history.clear} />
    </BezelCard>
  );

  return (
    <View style={styles.screen}>
      <VaultBackdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingTop: chrome.top + chrome.height + (compact ? 16 : 28),
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: chrome.gutter,
        }}
      >
        {wide ? (
          <View style={styles.columns}>
            <View style={styles.leftColumn}>
              <Reveal delay={60} duration={760}>
                <HeroCard compact={false} />
              </Reveal>
              <Reveal delay={220} duration={760} style={styles.grow}>
                {historyCard}
              </Reveal>
            </View>
            <Reveal delay={140} duration={760} style={styles.rightColumn}>
              {generatorCard}
            </Reveal>
          </View>
        ) : (
          <View style={styles.stack}>
            <Reveal delay={60} duration={760}>
              <HeroCard compact={compact} />
            </Reveal>
            <Reveal delay={140} duration={760}>
              {generatorCard}
            </Reveal>
            <Reveal delay={220} duration={760}>
              {historyCard}
            </Reveal>
          </View>
        )}
        <Text style={styles.footer}>Central do GCPD · BatPass · nada sai do seu aparelho</Text>
      </ScrollView>
      <View pointerEvents="none" style={[styles.topFade, { height: fadeHeight }]}>
        <Scrim width={width} height={fadeHeight} direction="top" start={chrome.top + chrome.height * 0.6} end={fadeHeight} strength={0.96} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.night,
  },
  scroll: {
    flex: 1,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'stretch',
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
    marginTop: 36,
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.dim,
  },
});
