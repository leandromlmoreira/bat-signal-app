import { useRef, useState, type ReactNode } from "react";
import { Animated, Platform, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { colors, easing, useNativeDriver } from "../theme/tokens.ts";

export interface InteractionState {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}

interface Props extends Omit<PressableProps, "style" | "children"> {
  style?: StyleProp<ViewStyle> | ((state: InteractionState) => StyleProp<ViewStyle>);
  wrapperStyle?: StyleProp<ViewStyle>;
  children: ReactNode | ((state: InteractionState) => ReactNode);
  pressedScale?: number;
  focusRadius?: number;
}

function isFocusVisible(target: unknown): boolean {
  if (Platform.OS !== "web") return true;
  const element = target as { matches?: (selector: string) => boolean } | null;
  return element?.matches?.(":focus-visible") ?? true;
}

export function PressableScale({
  style,
  wrapperStyle,
  children,
  pressedScale = 0.97,
  focusRadius = 999,
  disabled,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);
  const state = { hovered: hovered && !disabled, pressed, focused };

  const animateTo = (toValue: number, duration: number) =>
    Animated.timing(scale, { toValue, duration, easing: easing.out, useNativeDriver }).start();

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        {...rest}
        disabled={disabled}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPressIn={() => {
          setPressed(true);
          animateTo(pressedScale, 120);
        }}
        onPressOut={() => {
          setPressed(false);
          animateTo(1, 320);
        }}
        onFocus={(event) => setFocused(isFocusVisible(event.target))}
        onBlur={() => setFocused(false)}
        style={[styles.base, typeof style === "function" ? style(state) : style]}
      >
        {typeof children === "function" ? children(state) : children}
        {focused ? <View pointerEvents="none" style={[styles.focusRing, { borderRadius: focusRadius }]} /> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    cursor: "pointer",
  },
  focusRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: colors.signal,
  },
});
