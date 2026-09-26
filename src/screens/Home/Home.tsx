import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import { GothamScene } from '../../components/scene/GothamScene';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSceneLayout } from '../../hooks/useSceneLayout';
import { useSignal } from '../../hooks/useSignal';
import { useSignalPower } from '../../hooks/useSignalPower';
import { useAppFonts } from '../../theme/fonts';
import { colors, isWeb } from '../../theme/tokens';
import { CompactDeck } from './CompactDeck';
import { WideDeck } from './WideDeck';

function feelSwitch(turningOn: boolean) {
  if (isWeb) return;
  const style = turningOn ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light;
  Haptics.impactAsync(style).catch(() => undefined);
}

export default function Home() {
  const layout = useSceneLayout();
  const signal = useSignal();
  const reducedMotion = useReducedMotion();
  const fontsReady = useAppFonts();
  const power = useSignalPower(signal.active, reducedMotion);
  const animated = !reducedMotion;
  const { active, toggle } = signal;

  const handleToggle = useCallback(() => {
    feelSwitch(!active);
    toggle();
  }, [active, toggle]);

  const Deck = layout.wide ? WideDeck : CompactDeck;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <GothamScene layout={layout} power={power} animated={animated} />
      {fontsReady && <Deck layout={layout} signal={signal} onToggle={handleToggle} animated={animated} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.night,
    overflow: 'hidden',
  },
});
