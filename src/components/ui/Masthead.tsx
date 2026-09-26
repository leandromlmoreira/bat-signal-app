import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { Reveal } from './Reveal';

interface MastheadProps {
  titleSize: number;
  showLead: boolean;
  stacked: boolean;
  baseDelay: number;
}

export function Eyebrow({ label }: { label: string }) {
  return (
    <View style={styles.eyebrow}>
      <View style={styles.eyebrowMark} />
      <Text style={styles.eyebrowText}>{label}</Text>
    </View>
  );
}

export function Masthead({ titleSize, showLead, stacked, baseDelay }: MastheadProps) {
  return (
    <View>
      <Reveal delay={baseDelay}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * (stacked ? 0.84 : 0.9) }]}
          numberOfLines={stacked ? 2 : 1}
          adjustsFontSizeToFit
        >
          Bat<Text style={styles.titleDash}>-</Text>
          {stacked ? '\n' : ''}
          Sinal
        </Text>
      </Reveal>
      {showLead && (
        <Reveal delay={baseDelay + 90}>
          <Text style={styles.lead}>
            Quando a cidade não dá conta, o comissário sobe ao telhado. Um toque acende o holofote e
            projeta o chamado nas nuvens de Gotham.
          </Text>
        </Reveal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  eyebrowMark: {
    width: 6,
    height: 6,
    backgroundColor: colors.amber,
    transform: [{ rotate: '45deg' }],
  },
  eyebrowText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  titleDash: {
    color: colors.amber,
  },
  lead: {
    marginTop: 18,
    maxWidth: 440,
    fontFamily: fonts.body,
    fontSize: 21,
    lineHeight: 28,
    color: colors.muted,
  },
});
