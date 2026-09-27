import { Platform, StyleSheet, Text, type TextStyle } from "react-native";
import { classify } from "../domain/charsets.ts";
import { colors, fonts, glyphColors } from "../theme/tokens.ts";

const breakAnywhere = Platform.select<TextStyle>({ web: { wordBreak: "break-all" } as TextStyle, default: {} });

interface Props {
  value: string;
  size: number;
  settled: boolean;
}

export function PasswordText({ value, size, settled }: Props) {
  return (
    <Text
      selectable
      accessibilityLabel={`Senha gerada: ${value}`}
      style={[styles.text, breakAnywhere, { fontSize: size, lineHeight: size * 1.45 }]}
    >
      {[...value].map((char, index) => (
        <Text key={index} style={{ color: settled ? glyphColors[classify(char)] : colors.textFaint }}>
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
