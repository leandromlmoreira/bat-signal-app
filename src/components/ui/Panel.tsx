import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '../../theme/tokens';

interface PanelProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const CORNERS = [
  { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 },
  { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 },
  { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 },
  { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 },
] as const;

export function Panel({ children, style, contentStyle }: PanelProps) {
  return (
    <View style={[styles.panel, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
      {CORNERS.map((corner, index) => (
        <View key={index} pointerEvents="none" style={[styles.corner, corner]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radii.panel,
    backgroundColor: 'rgba(9,13,19,0.94)',
    borderWidth: 1,
    borderColor: colors.hairline,
    boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(200,220,255,0.05)',
  },
  content: {
    flexGrow: 1,
    borderRadius: radii.panel,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: 'rgba(160,184,220,0.42)',
  },
});
