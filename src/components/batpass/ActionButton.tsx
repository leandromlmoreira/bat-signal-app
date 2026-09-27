import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '../../theme/tokens';
import { PressableScale } from '../ui/PressableScale';

interface ActionButtonProps {
  label: string;
  icon: (color: string) => ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  accessibilityHint?: string;
  grow?: boolean;
}

export function ActionButton({ label, icon, onPress, variant = 'primary', accessibilityHint, grow }: ActionButtonProps) {
  const primary = variant === 'primary';
  const foreground = primary ? colors.onAmber : colors.text;

  return (
    <PressableScale
      wrapperStyle={grow && styles.grow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ hovered }) => [
        styles.button,
        primary ? styles.primary : styles.ghost,
        hovered && (primary ? styles.primaryHover : styles.ghostHover),
      ]}
    >
      {({ hovered }) => (
        <>
          <Text style={[styles.label, { color: foreground }]} numberOfLines={1}>
            {label}
          </Text>
          <View style={[styles.iconWell, primary ? styles.iconWellPrimary : styles.iconWellGhost, hovered && styles.iconWellHover]}>
            {icon(foreground)}
          </View>
        </>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  button: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingLeft: 22,
    paddingRight: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.amber,
    borderColor: 'rgba(255,233,179,0.8)',
    boxShadow: '0 12px 36px rgba(255,194,71,0.26), inset 0 1px 0 rgba(255,255,255,0.55)',
  },
  primaryHover: {
    backgroundColor: colors.amberSoft,
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: colors.hairlineStrong,
  },
  ghostHover: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: colors.amberLine,
  },
  label: {
    flexShrink: 1,
    fontFamily: fonts.label,
    fontSize: 18,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  iconWell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWellPrimary: {
    backgroundColor: 'rgba(22,16,5,0.1)',
  },
  iconWellGhost: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  iconWellHover: {
    transform: [{ translateX: 2 }, { scale: 1.06 }],
  },
});
