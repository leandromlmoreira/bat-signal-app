import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFocusVisible } from '../../hooks/useFocusVisible';
import { colors, fonts, radii } from '../../theme/tokens';

interface AreaTabProps {
  label: string;
  width: number;
  selected: boolean;
  live: boolean;
  icon: (color: string) => ReactNode;
  onPress: () => void;
}

export function AreaTab({ label, width, selected, live, icon, onPress }: AreaTabProps) {
  const { focusVisible, onFocus, onBlur } = useFocusVisible();

  return (
    <Pressable
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      role="tab"
      aria-selected={selected}
      aria-label={label}
      style={[styles.tab, { width }, focusVisible && styles.focused]}
    >
      {(state) => {
        const { hovered } = state as typeof state & { hovered?: boolean };
        const color = selected || hovered ? colors.text : colors.muted;
        return (
          <>
            {icon(selected ? colors.amber : color)}
            <Text style={[styles.label, { color }]}>{label}</Text>
            {live && !selected && <View style={styles.live} />}
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    height: 42,
    borderRadius: radii.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  focused: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.amberHot,
    outlineOffset: 2,
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 15,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  live: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
    boxShadow: '0 0 10px rgba(255,197,61,0.9)',
  },
});
