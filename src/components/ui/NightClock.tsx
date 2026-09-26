import { StyleSheet, Text, View } from 'react-native';

import { useNow } from '../../hooks/useNow';
import { formatHourMinute } from '../../lib/format';
import { colors, fonts } from '../../theme/tokens';

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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(3,5,10,0.45)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dim,
  },
  dotLive: {
    backgroundColor: colors.amber,
    boxShadow: '0 0 10px rgba(255,194,71,0.9)',
  },
  time: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: colors.hairline,
  },
  state: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  stateLive: {
    color: colors.amber,
  },
});
