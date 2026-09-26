import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BatSignal } from '../../components/BatSignal/BatSignal';
import { styles } from './styles';

export default function Home() {
  const [active, setActive] = useState(false);
  const [activationCount, setActivationCount] = useState(0);
  const { width } = useWindowDimensions();

  // Responsivo: o sinal ocupa uma fração da largura da tela, com limites
  // para não ficar minúsculo em telas pequenas nem gigante em tablets.
  const signalSize = Math.min(320, Math.max(180, width * 0.6));

  function handleToggle() {
    setActive((current) => {
      const next = !current;
      if (next) setActivationCount((count) => count + 1);
      return next;
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>GOTHAM CITY</Text>
      <Text style={styles.subtitle}>
        {active ? 'O sinal foi lançado no céu.' : 'O céu está calmo... por enquanto.'}
      </Text>

      <View style={styles.signalArea}>
        <BatSignal active={active} size={signalSize} />
      </View>

      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.button,
          active ? styles.buttonActive : styles.buttonInactive,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, active && styles.buttonTextActive]}>
          {active ? 'DESLIGAR SINAL' : 'ACIONAR SINAL'}
        </Text>
      </Pressable>

      <Text style={styles.counter}>
        Sinal acionado {activationCount} {activationCount === 1 ? 'vez' : 'vezes'} nesta sessão
      </Text>
    </View>
  );
}
