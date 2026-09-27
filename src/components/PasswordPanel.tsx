import { StyleSheet, Text, View } from "react-native";
import type { Strength } from "../domain/strength.ts";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";
import { useScramble } from "../hooks/useScramble.ts";
import { ActionButton } from "./ActionButton.tsx";
import { Eyebrow } from "./Eyebrow.tsx";
import { CheckIcon, CopyIcon, RefreshIcon } from "./Icons.tsx";
import { PasswordText } from "./PasswordText.tsx";
import { StrengthMeter } from "./StrengthMeter.tsx";
import { colors, fonts } from "../theme/tokens.ts";

interface Props {
  password: string;
  strength: Strength;
  copied: boolean;
  copyFailed: boolean;
  compact: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
}

function fontSizeFor(length: number, compact: boolean): number {
  const sizes = compact ? [22, 18, 16, 14] : [30, 26, 22, 18];
  if (length > 40) return sizes[3];
  if (length > 24) return sizes[2];
  if (length > 16) return sizes[1];
  return sizes[0];
}

export function PasswordPanel({ password, strength, copied, copyFailed, compact, onCopy, onRegenerate }: Props) {
  const reducedMotion = useReducedMotion();
  const display = useScramble(password, !reducedMotion);
  const settled = display === password;
  const status = copyFailed ? "Não foi possível copiar" : copied ? "Copiada para a área de transferência" : "";

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Eyebrow label="Senha gerada" tone="signal" />
        <Text style={styles.count}>{password.length} caracteres</Text>
      </View>
      <View style={styles.display}>
        <PasswordText value={display} size={fontSizeFor(password.length, compact)} settled={settled} />
      </View>
      <View style={[styles.actions, compact && styles.actionsCompact]}>
        <ActionButton
          grow={!compact}
          label={copied ? "Copiada" : "Copiar senha"}
          onPress={onCopy}
          accessibilityHint="Copia a senha e guarda no histórico deste aparelho"
          icon={(color) => (copied ? <CheckIcon color={color} /> : <CopyIcon color={color} />)}
        />
        <ActionButton
          grow={!compact}
          variant="ghost"
          label="Gerar outra"
          onPress={onRegenerate}
          icon={(color) => <RefreshIcon color={color} />}
        />
      </View>
      <Text style={[styles.status, copyFailed && styles.statusError]} accessibilityLiveRegion="polite">
        {status}
      </Text>
      <View style={styles.divider} />
      <StrengthMeter strength={strength} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  display: {
    minHeight: 96,
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionsCompact: {
    flexDirection: "column",
  },
  status: {
    marginTop: -8,
    minHeight: 18,
    fontFamily: fonts.bodyMedium,
    fontSize: 12.5,
    color: colors.signal,
  },
  statusError: {
    color: "#FF6B5E",
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairline,
  },
});
