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
  confirmed?: boolean;
}

export function ActionButton({ label, icon, onPress, variant = 'primary', accessibilityHint, grow, confirmed = false }: ActionButtonProps) {
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
        confirmed && styles.confirmed,
      ]}
    >
      {({ hovered }) => (
        <>
          <Text style={[styles.label, { color: foreground }]} numberOfLines={1}>
            {label}
          </Text>
          <View
            style={[
              styles.iconWell,
              primary ? styles.iconWellPrimary : styles.iconWellGhost,
              hovered && styles.iconWellHover,
              confirmed && styles.iconWellConfirmed,
            ]}
          >
            {icon(confirmed ? colors.amber : foreground)}
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
    borderRadius: radii.control,
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.amber,
    borderColor: colors.amberSoft,
    boxShadow: '0 12px 36px rgba(255,197,61,0.22), inset 0 1px 0 rgba(255,255,255,0.5)',
  },
  primaryHover: {
    backgroundColor: colors.amberSoft,
  },
  ghost: {
    backgroundColor: 'rgba(160,184,220,0.04)',
    borderColor: colors.hairlineStrong,
  },
  ghostHover: {
    backgroundColor: 'rgba(160,184,220,0.08)',
    borderColor: colors.amberLine,
  },
  label: {
    flexShrink: 1,
    fontFamily: fonts.heading,
    fontSize: 16,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  iconWell: {
    width: 42,
    height: 42,
    borderRadius: radii.tight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWellPrimary: {
    backgroundColor: 'rgba(20,14,2,0.12)',
  },
  iconWellGhost: {
    backgroundColor: 'rgba(160,184,220,0.08)',
  },
  confirmed: {
    backgroundColor: colors.amberHot,
    boxShadow: '0 0 0 4px rgba(255,197,61,0.18), 0 12px 40px rgba(255,197,61,0.35)',
  },
  iconWellConfirmed: {
    backgroundColor: colors.onAmber,
  },
  iconWellHover: {
    transform: [{ translateX: 2 }, { scale: 1.06 }],
  },
});
