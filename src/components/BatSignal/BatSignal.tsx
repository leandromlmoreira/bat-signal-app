import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { styles } from './BatSignalStyles';

interface BatSignalProps {
  active: boolean;
  size?: number;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

/**
 * Desenho do sinal do Batman: um facho circular amarelo com o morcego
 * recortado no centro. Quando ativo, pulsa suavemente (efeito de projetor).
 */
export function BatSignal({ active, size = 240 }: BatSignalProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [active, pulse]);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <AnimatedSvg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{ transform: [{ scale: pulse }] }}
      >
        <Circle
          cx="100"
          cy="100"
          r="96"
          fill={active ? '#F5C242' : '#3A3A3A'}
          opacity={active ? 0.95 : 0.4}
        />
        {/* Silhueta do morcego (estilo clássico do Bat-Sinal), recortada sobre o facho */}
        <Path
          d="M100,78
             C93,64 76,62 62,70
             C64,56 50,46 30,48
             C40,62 34,74 16,80
             C32,86 40,96 34,110
             C48,104 60,108 66,122
             C72,110 84,106 92,116
             C96,104 100,100 100,112
             C100,100 104,104 108,116
             C116,106 128,110 134,122
             C140,108 152,104 166,110
             C160,96 168,86 184,80
             C166,74 160,62 170,48
             C150,46 136,56 138,70
             C124,62 107,64 100,78 Z"
          fill={active ? '#111111' : '#1a1a1a'}
          opacity={active ? 1 : 0.6}
        />
      </AnimatedSvg>
    </View>
  );
}
