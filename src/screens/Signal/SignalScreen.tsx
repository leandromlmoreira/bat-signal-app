import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { GothamScene } from '../../components/scene/GothamScene';
import type { Chrome } from '../../components/shell/chrome';
import type { Strike } from '../../hooks/useLightning';
import { useSceneLayout } from '../../hooks/useSceneLayout';
import type { SignalState } from '../../hooks/useSignal';
import { useSignalPower } from '../../hooks/useSignalPower';
import type { Soundscape } from '../../hooks/useSoundscape';
import { colors, isWeb } from '../../theme/tokens';
import { CompactDeck } from './CompactDeck';
import { WideDeck } from './WideDeck';

interface SignalScreenProps {
  signal: SignalState;
  sound: Soundscape;
  chrome: Chrome;
  animated: boolean;
  reducedMotion: boolean;
  fontsReady: boolean;
}

const COMPACT_CHROME_OFFSET = 30;

function feelSwitch(turningOn: boolean) {
  if (isWeb) return;
  const style = turningOn ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light;
  Haptics.impactAsync(style).catch(() => undefined);
}

export function SignalScreen({ signal, sound, chrome, animated, reducedMotion, fontsReady }: SignalScreenProps) {
  const layout = useSceneLayout(chrome.compact ? COMPACT_CHROME_OFFSET : 0);
  const power = useSignalPower(signal.active, reducedMotion);
  const { active, toggle } = signal;

  const handleToggle = useCallback(() => {
    feelSwitch(!active);
    if (active) sound.shutdown();
    else sound.ignite();
    toggle();
  }, [active, toggle, sound]);

  const handleStrike = useCallback((strike: Strike) => sound.thunder(strike.distance), [sound]);

  const Deck = layout.wide ? WideDeck : CompactDeck;

  return (
    <View style={styles.root}>
      <GothamScene layout={layout} power={power} animated={animated} onStrike={handleStrike} />
      {fontsReady && <Deck layout={layout} chrome={chrome} signal={signal} onToggle={handleToggle} animated={animated} />}
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
