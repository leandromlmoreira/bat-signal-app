import { memo } from 'react';
import { Animated, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useBlink } from '../../hooks/useLoop';
import { useNow } from '../../hooks/useNow';
import type { SignalEvent } from '../../hooks/useSignal';
import { formatClock, formatElapsed } from '../../lib/format';
import { colors, fonts, isWeb, radii } from '../../theme/tokens';
import { Reveal } from './Reveal';

interface PoliceTerminalProps {
  active: boolean;
  activatedAt: number | null;
  events: SignalEvent[];
  visibleEvents: number;
  dense?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLOR = {
  system: colors.muted,
  alert: colors.amber,
  calm: colors.muted,
};

function EventLine({ event, dense }: { event: SignalEvent; dense: boolean }) {
  return (
    <Reveal distance={6} duration={320}>
      <Text style={[styles.line, dense && styles.lineDense]} numberOfLines={1}>
        <Text style={styles.time}>{formatClock(event.at)}  </Text>
        <Text style={{ color: TONE_COLOR[event.tone] }}>{event.text}</Text>
      </Text>
    </Reveal>
  );
}

function StatusLine({ active, activatedAt, dense }: { active: boolean; activatedAt: number | null; dense: boolean }) {
  const now = useNow(250, active);
  const cursor = useBlink(520, 520, true);
  const elapsed = activatedAt ? formatElapsed(now - activatedAt) : '00:00';

  return (
    <View style={styles.statusRow}>
      <Text style={[styles.status, dense && styles.statusDense]} numberOfLines={1}>
        <Text style={styles.prompt}>› </Text>
        <Text style={styles.speaker}>Comissário Gordon: </Text>
        {active ? (
          <Text style={styles.live}>sinal ativo — {elapsed}</Text>
        ) : (
          <Text style={styles.idle}>em espera</Text>
        )}
      </Text>
      <Animated.View style={[styles.cursor, { opacity: cursor }]} />
    </View>
  );
}

function PoliceTerminalView({ active, activatedAt, events, visibleEvents, dense = false, style }: PoliceTerminalProps) {
  return (
    <View style={[styles.shell, style]}>
      <View style={[styles.core, isWeb && styles.glass]}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <View style={styles.badge} />
            <Text style={styles.headerText}>GCPD // Terminal 07</Text>
          </View>
          <View style={styles.headerSide}>
            <View style={[styles.dot, active ? styles.dotLive : styles.dotIdle]} />
            <Text style={[styles.headerText, active && styles.headerLive]}>{active ? 'No ar' : 'Canal seguro'}</Text>
          </View>
        </View>
        <View style={styles.body}>
          {events.slice(-visibleEvents).map((event) => (
            <EventLine key={event.id} event={event} dense={dense} />
          ))}
          <StatusLine active={active} activatedAt={activatedAt} dense={dense} />
        </View>
      </View>
    </View>
  );
}

export const PoliceTerminal = memo(PoliceTerminalView);

const styles = StyleSheet.create({
  shell: {
    borderRadius: radii.panel,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: 'rgba(6,9,14,0.84)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  core: {
    backgroundColor: 'rgba(6,9,14,0.84)',
  },
  glass: {
    backgroundColor: 'rgba(6,9,14,0.58)',
    backdropFilter: 'blur(12px)',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: 'rgba(160,184,220,0.04)',
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    width: 10,
    height: 2,
    backgroundColor: colors.amber,
  },
  headerText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  headerLive: {
    color: colors.amber,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotIdle: {
    backgroundColor: colors.fog,
  },
  dotLive: {
    backgroundColor: colors.amber,
    boxShadow: '0 0 10px rgba(255,197,61,0.9)',
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 11,
    paddingBottom: 13,
    gap: 4,
  },
  line: {
    fontFamily: fonts.mono,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
  },
  lineDense: {
    fontSize: 12,
  },
  time: {
    color: colors.dim,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    flexShrink: 1,
    fontFamily: fonts.mono,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.text,
  },
  statusDense: {
    fontSize: 12,
  },
  prompt: {
    color: colors.amber,
  },
  speaker: {
    color: colors.text,
  },
  live: {
    color: colors.amber,
    fontVariant: ['tabular-nums'],
  },
  idle: {
    color: colors.muted,
  },
  cursor: {
    width: 8,
    height: 15,
    marginLeft: 4,
    backgroundColor: colors.amber,
  },
});
