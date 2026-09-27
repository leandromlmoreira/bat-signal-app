import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFocusVisible } from '../../hooks/useFocusVisible';
import type { Soundscape } from '../../hooks/useSoundscape';
import { colors, fonts, radii } from '../../theme/tokens';
import { MutedIcon, SpeakerIcon } from '../ui/Icons';

interface SoundToggleProps {
  sound: Soundscape;
  compact: boolean;
}

export function SoundToggle({ sound, compact }: SoundToggleProps) {
  const { focusVisible, onFocus, onBlur } = useFocusVisible();
  const { enabled } = sound;
  const label = enabled ? 'Desligar o som' : 'Ligar o som';

  return (
    <Pressable
      onPress={sound.toggle}
      onFocus={onFocus}
      onBlur={onBlur}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      style={(state) => {
        const { hovered } = state as typeof state & { hovered?: boolean };
        return [styles.button, compact && styles.compact, enabled && styles.on, hovered && styles.hover, focusVisible && styles.focused];
      }}
    >
      {enabled ? <SpeakerIcon color={colors.amber} size={18} /> : <MutedIcon color={colors.muted} size={18} />}
      {!compact && (
        <View style={styles.copy}>
          <Text style={styles.caption}>Som</Text>
          <Text style={[styles.state, enabled && styles.stateOn]}>{enabled ? 'Ligado' : 'Mudo'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: radii.control,
    backgroundColor: 'rgba(6,9,14,0.72)',
    borderWidth: 1,
    borderColor: colors.hairline,
    cursor: 'pointer',
  },
  compact: {
    width: 42,
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  on: {
    borderColor: colors.amberLine,
  },
  hover: {
    borderColor: colors.hairlineStrong,
    backgroundColor: 'rgba(14,19,27,0.9)',
  },
  focused: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.amberHot,
    outlineOffset: 2,
  },
  copy: {
    gap: 1,
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  state: {
    fontFamily: fonts.label,
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  stateOn: {
    color: colors.amber,
  },
});
