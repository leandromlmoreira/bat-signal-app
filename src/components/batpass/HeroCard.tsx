import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { Panel } from '../ui/Panel';
import { HeroScene } from './HeroScene';

const STACKED_FACTS_WIDTH = 600;

const FACTS = [
  { value: 'Web Crypto', label: 'sorteio criptográfico' },
  { value: '0 bytes', label: 'enviados para servidores' },
  { value: '8 a 64', label: 'caracteres por senha' },
];

function Facts({ compact }: { compact: boolean }) {
  return (
    <View style={compact ? styles.factsCompact : styles.facts}>
      {FACTS.map((fact, index) => (
        <View key={fact.value} style={compact ? [styles.factCompact, index > 0 && styles.factDivider] : styles.fact}>
          <Text style={[styles.factValue, compact && styles.factValueCompact]} numberOfLines={1}>
            {fact.value}
          </Text>
          <Text style={[styles.factLabel, compact && styles.factLabelCompact]}>{fact.label}</Text>
        </View>
      ))}
    </View>
  );
}

function titleSizeFor(width: number, compact: boolean) {
  if (!width) return compact ? 52 : 84;
  return compact ? Math.min(64, (width - 44) / 5.2) : Math.min(90, (width - 88) / 7.2);
}

export function HeroCard({ compact }: { compact: boolean }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const titleSize = titleSizeFor(size.width, compact);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  };

  return (
    <Panel style={styles.shell} contentStyle={[styles.core, compact && styles.coreCompact]}>
      <View style={StyleSheet.absoluteFill} onLayout={handleLayout}>
        {size.width > 0 && <HeroScene width={size.width} height={size.height} compact={compact} />}
      </View>
      <View style={[styles.content, compact && styles.contentCompact]}>
        <Text accessibilityRole="header" style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 0.98 }]}>
          Senhas que{'\n'}Gotham{'\n'}
          <Text style={styles.titleAccent}>não quebra.</Text>
        </Text>
        <Text style={[styles.lead, compact && styles.leadCompact]}>
          O BatPass gera senhas com aleatoriedade criptográfica, mede a força em bits de entropia de verdade e guarda o
          histórico só com você.
        </Text>
      </View>
      <Facts compact={compact || size.width < STACKED_FACTS_WIDTH} />
    </Panel>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexGrow: 1,
  },
  core: {
    minHeight: 640,
    padding: 44,
    justifyContent: 'space-between',
    backgroundColor: colors.night,
  },
  coreCompact: {
    minHeight: 0,
    padding: 22,
  },
  content: {
    gap: 22,
    maxWidth: 540,
  },
  contentCompact: {
    gap: 16,
    paddingTop: 214,
  },
  title: {
    fontFamily: fonts.display,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.text,
    includeFontPadding: false,
  },
  titleAccent: {
    color: colors.amber,
  },
  lead: {
    maxWidth: 420,
    fontFamily: fonts.body,
    fontSize: 19,
    lineHeight: 28,
    color: colors.muted,
  },
  leadCompact: {
    fontSize: 17,
    lineHeight: 25,
  },
  facts: {
    flexDirection: 'row',
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: 'rgba(6,9,14,0.7)',
  },
  fact: {
    flex: 1,
    gap: 4,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRightWidth: 1,
    borderRightColor: colors.hairline,
  },
  factsCompact: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: 'rgba(9,13,19,0.9)',
  },
  factCompact: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  factDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  factValue: {
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.text,
  },
  factValueCompact: {
    flexShrink: 0,
    fontSize: 18,
  },
  factLabelCompact: {
    flexShrink: 1,
    textAlign: 'right',
  },
  factLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.dim,
  },
});
