import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { AREAS, type Area } from '../../hooks/useAreaRoute';
import { useAnimatedValue } from '../../hooks/useLoop';
import { colors, fonts, isWeb, nativeDriver, radii } from '../../theme/tokens';
import { BatGlyph } from '../ui/BatGlyph';
import { KeyIcon, SignalIcon } from '../ui/Icons';
import { NightClock } from '../ui/NightClock';
import { AreaTab } from './AreaTab';
import type { Chrome } from './chrome';

interface CommandBarProps {
  area: Area;
  chrome: Chrome;
  signalActive: boolean;
  onNavigate: (area: Area) => void;
}

const TABS: Record<Area, { label: string; icon: typeof KeyIcon }> = {
  signal: { label: 'Sinal', icon: SignalIcon },
  batpass: { label: 'BatPass', icon: KeyIcon },
};

function useIndicator(index: number) {
  const slide = useAnimatedValue(index);

  useEffect(() => {
    const move = Animated.spring(slide, { toValue: index, stiffness: 340, damping: 32, mass: 0.9, useNativeDriver: nativeDriver });
    move.start();
    return () => move.stop();
  }, [index, slide]);

  return slide;
}

export function CommandBar({ area, chrome, signalActive, onNavigate }: CommandBarProps) {
  const { tabWidth } = chrome;
  const slide = useIndicator(AREAS.indexOf(area));
  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [0, tabWidth] });

  return (
    <View style={[styles.bar, { top: chrome.top, left: chrome.gutter, right: chrome.gutter }]} pointerEvents="box-none">
      <View style={[styles.island, chrome.compact && styles.islandCompact, isWeb && styles.glass]}>
        <View style={styles.brand}>
          <View style={styles.mark}>
            <BatGlyph size={24} color={colors.onAmber} />
          </View>
          {!chrome.compact && (
            <View>
              <Text style={styles.kicker}>Central do</Text>
              <Text style={styles.wordmark}>GCPD</Text>
            </View>
          )}
        </View>
        <View style={styles.track} role="tablist" aria-label="Áreas da central">
          <Animated.View style={[styles.indicator, { width: tabWidth, transform: [{ translateX }] }]} />
          {AREAS.map((key) => {
            const Icon = TABS[key].icon;
            return (
              <AreaTab
                key={key}
                label={TABS[key].label}
                width={tabWidth}
                selected={key === area}
                live={key === 'signal' && signalActive}
                icon={(color) => <Icon color={color} size={16} />}
                onPress={() => onNavigate(key)}
              />
            );
          })}
        </View>
      </View>
      {chrome.showClock && <NightClock active={signalActive} compact={chrome.compact} />}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  island: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(5,8,15,0.82)',
    borderWidth: 1,
    borderColor: colors.hairline,
    boxShadow: '0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
  islandCompact: {
    gap: 10,
  },
  glass: {
    backgroundColor: colors.glass,
    backdropFilter: 'blur(16px)',
  } as ViewStyle,
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    boxShadow: '0 0 24px rgba(255,194,71,0.35), inset 0 1px 0 rgba(255,255,255,0.55)',
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  wordmark: {
    marginTop: -1,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 21,
    letterSpacing: 1.2,
    color: colors.text,
  },
  track: {
    flexDirection: 'row',
    borderRadius: radii.pill,
    padding: 0,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.pill,
    backgroundColor: colors.amber,
    boxShadow: '0 6px 22px rgba(255,194,71,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
  },
});
