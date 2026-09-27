import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { BezelCard } from '../ui/BezelCard';
import { Eyebrow } from '../ui/Eyebrow';
import { HeroScene } from './HeroScene';

const STACKED_FACTS_WIDTH = 600;

const FACTS = [
  { value: 'Web Crypto', label: 'aleatoriedade criptográfica' },
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
  return compact ? Math.min(56, (width - 44) / 5.5) : Math.min(84, (width - 88) / 6.2);
}

export function HeroCard({ compact }: { compact: boolean }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const titleSize = titleSizeFor(size.width, compact);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  };

  return (
    <BezelCard style={styles.shell} coreStyle={[styles.core, compact && styles.coreCompact]}>
      <View style={StyleSheet.absoluteFill} onLayout={handleLayout}>
        {size.width > 0 && <HeroScene width={size.width} height={size.height} compact={compact} />}
      </View>
      <View style={[styles.content, compact && styles.contentCompact]}>
        <Eyebrow label={compact ? 'Área 02 · Senhas' : 'Área 02 · Cofre de senhas'} />
        <Text accessibilityRole="header" style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * 0.88 }]}>
          Senhas que{'\n'}Gotham{'\n'}
          <Text style={styles.titleAccent}>não quebra.</Text>
        </Text>
        <Text style={[styles.lead, compact && styles.leadCompact]}>
          O BatPass gera senhas com aleatoriedade criptográfica, mede a força em bits de entropia de verdade e guarda o
          histórico só com você.
        </Text>
      </View>
      <Facts compact={compact || size.width < STACKED_FACTS_WIDTH} />
    </BezelCard>
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
    letterSpacing: 0.5,
    color: colors.text,
    includeFontPadding: false,
  },
  titleAccent: {
    color: colors.amber,
  },
  lead: {
    maxWidth: 440,
    fontFamily: fonts.body,
    fontSize: 21,
    lineHeight: 28,
    color: colors.muted,
  },
  leadCompact: {
    fontSize: 18,
    lineHeight: 24,
  },
  facts: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 36,
  },
  fact: {
    flex: 1,
    gap: 2,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(5,8,15,0.72)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  factsCompact: {
    marginTop: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(5,8,15,0.72)',
    borderWidth: 1,
    borderColor: colors.hairline,
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
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: 0.5,
    color: colors.amber,
  },
  factValueCompact: {
    flexShrink: 0,
    fontSize: 21,
  },
  factLabelCompact: {
    flexShrink: 1,
    textAlign: 'right',
  },
  factLabel: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
  },
});
