import { useEffect } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, easing, fonts, isWeb, nativeDriver } from '../../theme/tokens';
import { PowerIcon } from './PowerIcon';

interface SignalButtonProps {
  active: boolean;
  onPress: () => void;
  animated: boolean;
  dense?: boolean;
  style?: StyleProp<ViewStyle>;
}

function useInvitePulse(enabled: boolean) {
  const pulse = useAnimatedValue(0);

  useEffect(() => {
    if (!enabled) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1800, easing: easing.out, useNativeDriver: nativeDriver }),
        Animated.delay(900),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, pulse]);

  return pulse;
}

export function SignalButton({ active, onPress, animated, dense = false, style }: SignalButtonProps) {
  const press = useAnimatedValue(1);
  const pulse = useInvitePulse(!active && animated);

  const animatePress = (toValue: number) =>
    Animated.spring(press, { toValue, stiffness: 520, damping: 30, mass: 0.6, useNativeDriver: nativeDriver }).start();

  const pulseOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.07] });
  const label = active ? 'Desligar o sinal' : 'Acionar o sinal';

  return (
    <Animated.View style={[styles.wrapper, style, { transform: [{ scale: press }] }]}>
      {!active && (
        <Animated.View
          pointerEvents="none"
          style={[styles.pulse, { opacity: pulseOpacity, transform: [{ scaleX: pulseScale }, { scaleY: pulseScale }] }]}
        />
      )}
      <Pressable
        onPress={onPress}
        onPressIn={() => animatePress(0.97)}
        onPressOut={() => animatePress(1)}
        role="switch"
        aria-checked={active}
        aria-label={label}
        style={(state) => {
          const { hovered, focused } = state as typeof state & { hovered?: boolean; focused?: boolean };
          return [
            styles.button,
            dense && styles.buttonDense,
            active ? styles.buttonActive : styles.buttonIdle,
            hovered && (active ? styles.hoverActive : styles.hoverIdle),
            focused && isWeb && styles.focused,
          ];
        }}
      >
        <Text style={[styles.label, dense && styles.labelDense, active && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
        <View style={[styles.icon, dense && styles.iconDense, active ? styles.iconActive : styles.iconIdle]}>
          <PowerIcon size={18} color={colors.onAmber} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 0,
  },
  pulse: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: colors.amber,
  },
  button: {
    height: 62,
    borderRadius: 999,
    paddingLeft: 26,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderWidth: 1,
  },
  buttonDense: {
    height: 56,
    paddingLeft: 20,
    paddingRight: 6,
    gap: 10,
  },
  buttonIdle: {
    backgroundColor: colors.amber,
    borderColor: 'rgba(255,233,179,0.8)',
    boxShadow: '0 12px 40px rgba(255,194,71,0.32), inset 0 1px 0 rgba(255,255,255,0.55)',
  },
  buttonActive: {
    backgroundColor: 'rgba(12,16,26,0.72)',
    borderColor: 'rgba(255,194,71,0.45)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  hoverIdle: {
    backgroundColor: colors.amberSoft,
  },
  hoverActive: {
    borderColor: 'rgba(255,194,71,0.8)',
  },
  focused: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: colors.amberHot,
    outlineOffset: 3,
  },
  label: {
    flexShrink: 1,
    fontFamily: fonts.label,
    fontSize: 19,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.onAmber,
  },
  labelDense: {
    fontSize: 17,
    letterSpacing: 1,
  },
  labelActive: {
    color: colors.amber,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDense: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  iconIdle: {
    backgroundColor: 'rgba(22,16,5,0.1)',
  },
  iconActive: {
    backgroundColor: colors.amber,
  },
});
