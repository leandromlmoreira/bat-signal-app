import { StyleSheet, Text, View } from 'react-native';

import type { Strength } from '../../domain/strength.ts';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScramble } from '../../hooks/useScramble';
import { colors, fonts, radii } from '../../theme/tokens';
import { Eyebrow } from '../ui/Eyebrow';
import { CheckIcon, CopyIcon, RefreshIcon } from '../ui/Icons';
import { ActionButton } from './ActionButton';
import { PasswordText } from './PasswordText';
import { StrengthMeter } from './StrengthMeter';

interface PasswordPanelProps {
  password: string;
  strength: Strength;
  copied: boolean;
  copyFailed: boolean;
  compact: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
}

function fontSizeFor(length: number, compact: boolean) {
  const sizes = compact ? [20, 16, 14, 12.5] : [30, 26, 22, 18];
  if (length > 40) return sizes[3];
  if (length > 24) return sizes[2];
  if (length > 16) return sizes[1];
  return sizes[0];
}

function statusFor(copied: boolean, copyFailed: boolean) {
  if (copyFailed) return 'Não foi possível copiar';
  if (copied) return 'Copiada para a área de transferência';
  return '';
}

export function PasswordPanel({ password, strength, copied, copyFailed, compact, onCopy, onRegenerate }: PasswordPanelProps) {
  const reducedMotion = useReducedMotion();
  const display = useScramble(password, !reducedMotion);
  const settled = display === password;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Eyebrow label="Senha gerada" tone="amber" />
        <Text style={styles.count}>{password.length} caracteres</Text>
      </View>
      <View style={[styles.readout, compact && styles.readoutCompact]}>
        <Text style={styles.prompt}>›</Text>
        <View style={styles.readoutText}>
          <PasswordText value={display} size={fontSizeFor(password.length, compact)} settled={settled} />
        </View>
      </View>
      <View style={[styles.actions, compact && styles.actionsCompact]}>
        <ActionButton
          grow={!compact}
          label={copied ? 'Copiada' : 'Copiar senha'}
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
        {statusFor(copied, copyFailed)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  readout: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: radii.control + 2,
    backgroundColor: 'rgba(3,5,10,0.7)',
    borderWidth: 1,
    borderColor: colors.hairline,
    boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.5)',
  },
  readoutCompact: {
    minHeight: 96,
    paddingHorizontal: 16,
    gap: 10,
  },
  prompt: {
    fontFamily: fonts.monoBold,
    fontSize: 22,
    color: colors.amber,
  },
  readoutText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionsCompact: {
    flexDirection: 'column',
  },
  status: {
    marginTop: -8,
    minHeight: 18,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.amber,
  },
  statusError: {
    color: colors.alert,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairline,
  },
});
