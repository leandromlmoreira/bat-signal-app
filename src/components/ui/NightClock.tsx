import { StyleSheet, Text, View } from 'react-native';

import { useNow } from '../../hooks/useNow';
import { formatHourMinute } from '../../lib/format';
import { colors, fonts, radii } from '../../theme/tokens';

interface NightClockProps {
  active: boolean;
  compact?: boolean;
}

export function NightClock({ active, compact = false }: NightClockProps) {
  const now = useNow(15000);
  const state = active ? 'Sinal no ar' : 'Chuva · 14°C';

  return (
    <View style={styles.clock}>
      <View style={[styles.dot, active && styles.dotLive]} />
      <Text style={styles.time}>{formatHourMinute(now)}</Text>
      {!compact && (
        <>
          <View style={styles.divider} />
          <Text style={[styles.state, active && styles.stateLive]}>{state}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  clock: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radii.control,
    backgroundColor: 'rgba(6,9,14,0.6)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.fog,
  },
  dotLive: {
    backgroundColor: colors.amber,
    boxShadow: '0 0 10px rgba(255,197,61,0.9)',
  },
  time: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 1.4,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: colors.hairlineStrong,
  },
  state: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  stateLive: {
    color: colors.amber,
  },
});
