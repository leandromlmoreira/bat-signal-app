import { StyleSheet, View } from 'react-native';

import { CallCounter } from '../../components/ui/CallCounter';
import { Masthead } from '../../components/ui/Masthead';
import { PoliceTerminal } from '../../components/ui/PoliceTerminal';
import { Reveal } from '../../components/ui/Reveal';
import { Scrim } from '../../components/ui/Scrim';
import { SignalButton } from '../../components/ui/SignalButton';
import type { DeckProps } from './deckProps';

const PANEL_HEIGHT = 250;
const MASTHEAD_OFFSET = 60;

export function CompactDeck({ layout, signal, onToggle, animated }: DeckProps) {
  const { width, height, insets } = layout;
  const panelTop = height - insets.bottom - PANEL_HEIGHT;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Scrim width={width} height={height} direction="bottom" start={panelTop - 110} end={height - 30} strength={0.94} />
      <View style={[styles.header, { top: insets.top + MASTHEAD_OFFSET }]} pointerEvents="box-none">
        <Masthead titleSize={Math.min(88, (width - 40) / 4.2)} showLead={false} stacked={false} baseDelay={580} />
      </View>
      <View style={[styles.panel, { bottom: insets.bottom + 18 }]} pointerEvents="box-none">
        <Reveal delay={700}>
          <PoliceTerminal
            active={signal.active}
            activatedAt={signal.activatedAt}
            events={signal.events}
            visibleEvents={2}
            dense={layout.narrow}
          />
        </Reveal>
        <Reveal delay={780} style={styles.controls}>
          <CallCounter calls={signal.calls} size={layout.narrow ? 42 : 50} />
          <SignalButton active={signal.active} onPress={onToggle} animated={animated} dense={layout.narrow} style={styles.button} />
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignSelf: 'center',
    maxWidth: 560,
    gap: 16,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 18,
    paddingLeft: 6,
  },
  button: {
    flex: 1,
  },
});
