import { StyleSheet, View } from 'react-native';

import { CallCounter } from '../../components/ui/CallCounter';
import { Masthead } from '../../components/ui/Masthead';
import { PoliceTerminal } from '../../components/ui/PoliceTerminal';
import { Reveal } from '../../components/ui/Reveal';
import { Scrim } from '../../components/ui/Scrim';
import { SignalButton } from '../../components/ui/SignalButton';
import type { DeckProps } from './deckProps';

function deckMetrics(width: number, height: number, short: boolean) {
  const columnWidth = Math.min(560, width * (short ? 0.46 : 0.4));

  if (short) {
    return { columnWidth, titleSize: Math.min(columnWidth / 4.6, height * 0.2), counterSize: 48, events: 1, gap: 14 };
  }

  const tall = height >= 820;
  return {
    columnWidth,
    titleSize: Math.min(columnWidth / 2.55, height * 0.21),
    counterSize: 66,
    events: tall ? 3 : 2,
    gap: tall ? 36 : 26,
  };
}

export function WideDeck({ layout, chrome, signal, onToggle, animated }: DeckProps) {
  const { width, height, short } = layout;
  const { gutter } = chrome;
  const { columnWidth, titleSize, counterSize, events, gap } = deckMetrics(width, height, short);
  const top = chrome.top + chrome.height;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Scrim width={width} height={height} direction="left" start={0} end={gutter + columnWidth * 1.35} strength={0.9} />
      <View style={[styles.column, { left: gutter, width: columnWidth, top }]} pointerEvents="box-none">
        <View>
          <Masthead titleSize={titleSize} showLead={!short} stacked={!short} baseDelay={580} />
        </View>
        <Reveal delay={760} style={[styles.controls, { marginTop: gap }]}>
          <CallCounter calls={signal.calls} size={counterSize} />
          <SignalButton active={signal.active} onPress={onToggle} animated={animated} dense={short} style={styles.button} />
        </Reveal>
        <Reveal delay={860} style={{ marginTop: short ? 12 : gap * 0.75 }}>
          <PoliceTerminal
            active={signal.active}
            activatedAt={signal.activatedAt}
            events={signal.events}
            visibleEvents={events}
          />
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 28,
  },
  button: {
    flex: 1,
    maxWidth: 340,
  },
});
