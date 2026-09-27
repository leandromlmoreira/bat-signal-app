import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, radii } from "../theme/tokens.ts";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  coreStyle?: StyleProp<ViewStyle>;
}

export function BezelCard({ children, style, coreStyle }: Props) {
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
    borderColor: colors.hairline,
  },
  core: {
    flexGrow: 1,
    borderRadius: radii.core,
    backgroundColor: colors.core,
    borderTopWidth: 1,
    borderTopColor: colors.highlight,
    overflow: "hidden",
  },
});
