import { StyleSheet, View } from 'react-native';

import { CallCounter } from '../../components/ui/CallCounter';
import { Eyebrow, Masthead } from '../../components/ui/Masthead';
import { NightClock } from '../../components/ui/NightClock';
import { PoliceTerminal } from '../../components/ui/PoliceTerminal';
import { Reveal } from '../../components/ui/Reveal';
import { Scrim } from '../../components/ui/Scrim';
import { SignalButton } from '../../components/ui/SignalButton';
import type { DeckProps } from './deckProps';

function deckMetrics(width: number, height: number, short: boolean) {
  const gutter = Math.max(short ? 28 : 48, width * 0.05);
  const columnWidth = Math.min(560, width * (short ? 0.46 : 0.4));

  if (short) {
    return { gutter, columnWidth, titleSize: Math.min(columnWidth / 4.4, height * 0.2), counterSize: 46, events: 1, gap: 16 };
  }

  const tall = height >= 820;
  return {
    gutter,
    columnWidth,
    titleSize: Math.min(columnWidth / 3.05, height * 0.165),
    counterSize: 64,
    events: tall ? 3 : 2,
    gap: tall ? 36 : 26,
  };
}

export function WideDeck({ layout, signal, onToggle, animated }: DeckProps) {
  const { width, height, short } = layout;
  const { gutter, columnWidth, titleSize, counterSize, events, gap } = deckMetrics(width, height, short);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Scrim width={width} height={height} direction="left" start={0} end={gutter + columnWidth * 1.35} strength={0.9} />
      <View style={[styles.column, { left: gutter, width: columnWidth }]} pointerEvents="box-none">
        <Reveal delay={500}>
          <Eyebrow label="GCPD · Central de chamados" />
        </Reveal>
        <View style={{ marginTop: short ? 10 : 22 }}>
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
      <Reveal delay={900} style={[styles.clock, { right: gutter, top: short ? 20 : 36 }]}>
        <NightClock active={signal.active} />
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    position: 'absolute',
    top: 0,
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
  clock: {
    position: 'absolute',
  },
});
