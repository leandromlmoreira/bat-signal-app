import { useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useFocusVisible } from '../../hooks/useFocusVisible';
import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, easing, nativeDriver } from '../../theme/tokens';

export interface InteractionState {
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
}

interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle> | ((state: InteractionState) => StyleProp<ViewStyle>);
  wrapperStyle?: StyleProp<ViewStyle>;
  children: ReactNode | ((state: InteractionState) => ReactNode);
  pressedScale?: number;
  focusRadius?: number;
}

export function PressableScale({
  style,
  wrapperStyle,
  children,
  pressedScale = 0.97,
  focusRadius = 999,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useAnimatedValue(1);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { focusVisible, onFocus, onBlur } = useFocusVisible();
  const state = { hovered: hovered && !disabled, pressed, focused: focusVisible };

  const animateTo = (toValue: number, duration: number) =>
    Animated.timing(scale, { toValue, duration, easing: easing.out, useNativeDriver: nativeDriver }).start();

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
        onFocus={onFocus}
        onBlur={onBlur}
        style={[styles.base, typeof style === 'function' ? style(state) : style]}
      >
        {typeof children === 'function' ? children(state) : children}
        {focusVisible && <View pointerEvents="none" style={[styles.focusRing, { borderRadius: focusRadius }]} />}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    cursor: 'pointer',
  },
  focusRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: colors.amberHot,
  },
});
