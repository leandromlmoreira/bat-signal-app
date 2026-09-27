import { StyleSheet, Text, View } from 'react-native';

import type { PasswordOptions } from '../../domain/password.ts';
import type { ToggleOption } from '../../hooks/usePasswordGenerator';
import { colors, fonts } from '../../theme/tokens';
import { LengthControl } from './LengthControl';
import { OptionToggle } from './OptionToggle';

interface OptionsPanelProps {
  options: PasswordOptions;
  onLengthChange: (length: number) => void;
  onToggle: (key: ToggleOption) => void;
}

const TOGGLES: { key: ToggleOption; label: string; hint: string; sample: string }[] = [
  { key: 'uppercase', label: 'Maiúsculas', hint: 'Letras de A a Z', sample: 'ABC' },
  { key: 'numbers', label: 'Números', hint: 'Dígitos de 0 a 9', sample: '123' },
  { key: 'symbols', label: 'Símbolos', hint: 'Sinais como # $ % &', sample: '#$%' },
  { key: 'avoidAmbiguous', label: 'Evitar ambíguos', hint: 'Remove I, l, 1, O, 0 e afins', sample: 'Il1' },
];

export function OptionsPanel({ options, onLengthChange, onToggle }: OptionsPanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>
      <LengthControl value={options.length} onChange={onLengthChange} />
      <View style={styles.toggles}>
        {TOGGLES.map((toggle) => (
          <OptionToggle
            key={toggle.key}
            label={toggle.label}
            hint={toggle.hint}
            sample={toggle.sample}
            value={options[toggle.key]}
            onToggle={() => onToggle(toggle.key)}
          />
        ))}
      </View>
      <Text style={styles.note}>Minúsculas estão sempre presentes. Cada tipo ativo aparece ao menos uma vez.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.text,
  },
  toggles: {
    marginHorizontal: -12,
    gap: 2,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 20,
    color: colors.dim,
  },
});
