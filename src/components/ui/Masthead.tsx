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
