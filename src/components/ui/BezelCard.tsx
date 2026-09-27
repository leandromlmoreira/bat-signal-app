import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '../../theme/tokens';

interface BezelCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  coreStyle?: StyleProp<ViewStyle>;
}

export function BezelCard({ children, style, coreStyle }: BezelCardProps) {
  return (
    <View style={[styles.shell, style]}>
      <View style={[styles.core, coreStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    padding: 6,
    borderRadius: radii.shell,
    backgroundColor: colors.shell,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  core: {
    flexGrow: 1,
    borderRadius: radii.core,
    backgroundColor: colors.core,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
});
