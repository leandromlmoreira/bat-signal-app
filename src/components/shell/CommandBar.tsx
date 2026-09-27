import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { AREAS, type Area } from '../../hooks/useAreaRoute';
import { useAnimatedValue } from '../../hooks/useLoop';
import type { Soundscape } from '../../hooks/useSoundscape';
import { colors, fonts, isWeb, nativeDriver, radii } from '../../theme/tokens';
import { BatGlyph } from '../ui/BatGlyph';
import { KeyIcon, SignalIcon } from '../ui/Icons';
import { NightClock } from '../ui/NightClock';
import { AreaTab } from './AreaTab';
import type { Chrome } from './chrome';
import { SoundToggle } from './SoundToggle';

interface CommandBarProps {
  area: Area;
  chrome: Chrome;
  signalActive: boolean;
  sound: Soundscape;
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

function Brand({ compact }: { compact: boolean }) {
  return (
    <View style={[styles.brand, compact && styles.brandCompact]} accessibilityLabel="Central do GCPD">
      <BatGlyph size={compact ? 30 : 34} color={colors.amber} />
      {!compact && (
        <View>
          <Text style={styles.wordmark}>GCPD</Text>
          <Text style={styles.kicker}>Central</Text>
        </View>
      )}
    </View>
  );
}

export function CommandBar({ area, chrome, signalActive, sound, onNavigate }: CommandBarProps) {
  const { tabWidth } = chrome;
  const slide = useIndicator(AREAS.indexOf(area));
  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [0, tabWidth] });

  return (
    <View style={[styles.bar, { top: chrome.top, left: chrome.gutter, right: chrome.gutter }]} pointerEvents="box-none">
      <View style={[styles.island, isWeb && styles.glass]}>
        <Brand compact={chrome.compact} />
        <View style={styles.divider} />
        <View style={styles.track} role="tablist" aria-label="Áreas da central">
          <Animated.View style={[styles.indicator, { width: tabWidth, transform: [{ translateX }] }]}>
            <View style={styles.indicatorLine} />
          </Animated.View>
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
      <View style={styles.side}>
        {chrome.showClock && <NightClock active={signalActive} compact={chrome.compact} />}
        {sound.supported && <SoundToggle sound={sound} compact={chrome.compact} />}
      </View>
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
    gap: 10,
  },
  island: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
    borderRadius: radii.panel,
    backgroundColor: 'rgba(6,9,14,0.86)',
    borderWidth: 1,
    borderColor: colors.hairline,
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
  },
  glass: {
    backgroundColor: colors.glass,
    backdropFilter: 'blur(14px)',
  } as ViewStyle,
  brand: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 10,
    paddingRight: 8,
  },
  brandCompact: {
    width: 44,
    paddingLeft: 0,
    paddingRight: 0,
    justifyContent: 'center',
  },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 21,
    letterSpacing: 1.6,
    color: colors.text,
  },
  kicker: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.dim,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.hairline,
  },
  track: {
    flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: radii.control,
    backgroundColor: colors.amberWash,
    overflow: 'hidden',
  },
  indicatorLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 0,
    height: 2,
    backgroundColor: colors.amber,
    boxShadow: '0 0 12px rgba(255,197,61,0.8)',
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
