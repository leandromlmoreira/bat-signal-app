import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BatWipe } from '../../components/shell/BatWipe';
import { CommandBar } from '../../components/shell/CommandBar';
import { computeChrome } from '../../components/shell/chrome';
import { useAreaRoute } from '../../hooks/useAreaRoute';
import { useAreaTransition } from '../../hooks/useAreaTransition';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSignal } from '../../hooks/useSignal';
import { useSoundscape } from '../../hooks/useSoundscape';
import { useVisited } from '../../hooks/useVisited';
import { useAppFonts } from '../../theme/fonts';
import { colors } from '../../theme/tokens';
import { BatPassScreen } from '../BatPass/BatPassScreen';
import { SignalScreen } from '../Signal/SignalScreen';
import { AreaStage } from './AreaStage';

export default function Central() {
  const fontsReady = useAppFonts();
  const reducedMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const chrome = computeChrome(width, height, insets.top);
  const signal = useSignal();
  const sound = useSoundscape(signal.active);
  const { area, navigate } = useAreaRoute();
  const { shown, progress } = useAreaTransition(area, reducedMotion);
  const visited = useVisited(shown);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {fontsReady && <CommandBar area={area} chrome={chrome} signalActive={signal.active} sound={sound} onNavigate={navigate} />}
      {visited.has('signal') && (
        <AreaStage visible={shown === 'signal'} progress={progress}>
          <SignalScreen signal={signal} sound={sound} chrome={chrome} animated={!reducedMotion && shown === 'signal'} reducedMotion={reducedMotion} fontsReady={fontsReady} />
        </AreaStage>
      )}
      {fontsReady && visited.has('batpass') && (
        <AreaStage visible={shown === 'batpass'} progress={progress}>
          <BatPassScreen chrome={chrome} />
        </AreaStage>
      )}
      <BatWipe progress={progress} animated={!reducedMotion} />
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
