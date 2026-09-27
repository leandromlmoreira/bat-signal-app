import { Platform, StyleSheet, Text, type TextStyle } from 'react-native';

import { classify } from '../../domain/charsets.ts';
import { colors, fonts } from '../../theme/tokens';
import { glyphColors } from './palette';

const breakAnywhere = Platform.select<TextStyle>({ web: { wordBreak: 'break-all' } as TextStyle, default: {} });

interface PasswordTextProps {
  value: string;
  size: number;
  settled: boolean;
}

export function PasswordText({ value, size, settled }: PasswordTextProps) {
  return (
    <Text
      selectable
      accessibilityLabel={`Senha gerada: ${value}`}
      style={[styles.text, breakAnywhere, { fontSize: size, lineHeight: size * 1.45 }]}
    >
      {[...value].map((char, index) => (
        <Text key={index} style={{ color: settled ? glyphColors[classify(char)] : colors.dim }}>
          {char}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.mono,
    letterSpacing: 1,
    color: colors.text,
  },
});
