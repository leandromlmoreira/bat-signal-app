import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { LENGTH_MAX, LENGTH_MIN } from '../../domain/password.ts';
import { colors, fonts, radii } from '../../theme/tokens';
import { MinusIcon, PlusIcon } from '../ui/Icons';
import { PressableScale } from '../ui/PressableScale';

const TICKS = [8, 16, 24, 32, 40, 48, 56, 64];
const RANGE = LENGTH_MAX - LENGTH_MIN;

interface LengthControlProps {
  value: number;
  onChange: (value: number) => void;
}

function StepButton({ label, onPress, icon }: { label: string; onPress: () => void; icon: 'minus' | 'plus' }) {
  const Icon = icon === 'minus' ? MinusIcon : PlusIcon;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      pressedScale={0.9}
      style={({ hovered }) => [styles.step, hovered && styles.stepHover]}
    >
      <Icon color={colors.text} size={16} />
    </PressableScale>
  );
}

export function LengthControl({ value, onChange }: LengthControlProps) {
  const track = useRef<View>(null);
  const origin = useRef(0);
  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const ratio = (value - LENGTH_MIN) / RANGE;

  const updateFrom = (pageX: number) => {
    if (!width) return;
    const clamped = Math.min(1, Math.max(0, (pageX - origin.current) / width));
    onChange(LENGTH_MIN + clamped * RANGE);
  };

  const handleGrant = (event: GestureResponderEvent) => {
    const { pageX } = event.nativeEvent;
    setDragging(true);
    track.current?.measure((_x, _y, _w, _h, left) => {
      origin.current = left;
      updateFrom(pageX);
    });
  };

  const stopDragging = () => setDragging(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Comprimento</Text>
          <Text style={styles.hint}>
            de {LENGTH_MIN} a {LENGTH_MAX} caracteres
          </Text>
        </View>
        <View style={styles.stepper}>
          <StepButton label="Diminuir comprimento" icon="minus" onPress={() => onChange(value - 1)} />
          <Text style={styles.value} accessibilityLiveRegion="polite">
            {value}
          </Text>
          <StepButton label="Aumentar comprimento" icon="plus" onPress={() => onChange(value + 1)} />
        </View>
      </View>
      <View
        ref={track}
        style={styles.hitArea}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={handleGrant}
        onResponderMove={(event) => updateFrom(event.nativeEvent.pageX)}
        onResponderRelease={stopDragging}
        onResponderTerminate={stopDragging}
        accessible
        role="slider"
        accessibilityLabel="Comprimento da senha"
        aria-valuemin={LENGTH_MIN}
        aria-valuemax={LENGTH_MAX}
        aria-valuenow={value}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => onChange(value + (event.nativeEvent.actionName === 'increment' ? 1 : -1))}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
        </View>
        <View style={[styles.thumb, dragging && styles.thumbActive, { left: `${ratio * 100}%` }]} />
      </View>
      <View style={styles.ticks}>
        {TICKS.map((tick) => (
          <Text key={tick} style={[styles.tick, tick <= value && styles.tickActive]}>
            {tick}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 17,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.muted,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: radii.control,
    backgroundColor: 'rgba(160,184,220,0.04)',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: radii.tight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHover: {
    backgroundColor: 'rgba(160,184,220,0.1)',
  },
  value: {
    minWidth: 46,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.amber,
    fontVariant: ['tabular-nums'],
  },
  hitArea: {
    height: 30,
    justifyContent: 'center',
    cursor: 'pointer',
  },
  track: {
    height: 4,
    borderRadius: 1,
    backgroundColor: 'rgba(160,184,220,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.amber,
    boxShadow: '0 0 12px rgba(255,197,61,0.6)',
  },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 28,
    marginLeft: -6,
    borderRadius: radii.tight,
    backgroundColor: colors.amber,
    borderWidth: 3,
    borderColor: colors.core,
    boxShadow: '0 0 18px rgba(255,197,61,0.5)',
  },
  thumbActive: {
    transform: [{ scaleY: 1.18 }],
  },
  ticks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tick: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.dim,
  },
  tickActive: {
    color: colors.muted,
  },
});
