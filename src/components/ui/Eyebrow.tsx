import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '../../theme/tokens';

interface EyebrowProps {
  label: string;
  tone?: 'muted' | 'amber';
}

export function Eyebrow({ label, tone = 'muted' }: EyebrowProps) {
  const amber = tone === 'amber';

  return (
    <View style={[styles.eyebrow, amber && styles.eyebrowAmber]}>
      <View style={styles.mark} />
      <Text style={[styles.text, amber && styles.textAmber]}>{label}</Text>
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
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  eyebrowAmber: {
    backgroundColor: colors.amberWash,
    borderColor: colors.amberLine,
  },
  mark: {
    width: 6,
    height: 6,
    backgroundColor: colors.amber,
    transform: [{ rotate: '45deg' }],
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  textAmber: {
    color: colors.amber,
  },
});
