import { Easing, Platform } from 'react-native';

export const colors = {
  night: '#03050A',
  ink: '#070B14',
  steel: '#121A2A',
  amber: '#FFC247',
  amberSoft: '#FFD37A',
  amberHot: '#FFE9B3',
  amberDeep: '#E8952B',
  onAmber: '#161005',
  text: '#EEF1F7',
  muted: '#9AA3B7',
  dim: '#5D667B',
  hairline: 'rgba(255,255,255,0.09)',
  alert: '#FF5B4A',
};

export const fonts = {
  display: 'BigShoulders_900Black',
  displayBold: 'BigShoulders_800ExtraBold',
  label: 'BarlowCondensed_600SemiBold',
  body: 'BarlowCondensed_500Medium',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
};

export const easing = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  drift: Easing.inOut(Easing.sin),
  linear: Easing.linear,
  step: Easing.step0,
};

export const nativeDriver = Platform.OS !== 'web';

export const isWeb = Platform.OS === 'web';
