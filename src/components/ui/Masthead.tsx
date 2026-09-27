import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../../theme/tokens';
import { Reveal } from './Reveal';

interface MastheadProps {
  titleSize: number;
  showLead: boolean;
  stacked: boolean;
  baseDelay: number;
}

export function Masthead({ titleSize, showLead, stacked, baseDelay }: MastheadProps) {
  return (
    <View>
      <Reveal delay={baseDelay}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { fontSize: titleSize, lineHeight: titleSize * (stacked ? 0.92 : 1.02) }]}
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
  title: {
    fontFamily: fonts.display,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    includeFontPadding: false,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 40,
  },
  titleDash: {
    color: colors.amber,
  },
  lead: {
    marginTop: 20,
    maxWidth: 420,
    fontFamily: fonts.body,
    fontSize: 20,
    lineHeight: 29,
    letterSpacing: 0.2,
    color: colors.muted,
  },
});
