import { Easing, Platform } from 'react-native';

export const colors = {
  night: '#03050A',
  ink: '#070B14',
  steel: '#121A2A',
  amber: '#FFC247',
  amberSoft: '#FFD37A',
  amberHot: '#FFE9B3',
  amberDeep: '#E8952B',
  amberWash: 'rgba(255,194,71,0.12)',
  amberLine: 'rgba(255,194,71,0.28)',
  onAmber: '#161005',
  text: '#EEF1F7',
  muted: '#9AA3B7',
  dim: '#5D667B',
  hairline: 'rgba(255,255,255,0.09)',
  hairlineStrong: 'rgba(255,255,255,0.15)',
  highlight: 'rgba(255,255,255,0.06)',
  shell: 'rgba(255,255,255,0.035)',
  core: '#080D17',
  glass: 'rgba(5,8,15,0.62)',
  ice: '#9CC3FF',
  calm: '#5FD39A',
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

export const radii = {
  shell: 28,
  core: 22,
  control: 16,
  pill: 999,
};

export const easing = {
  out: Easing.bezier(0.23, 1, 0.32, 1),
  drawer: Easing.bezier(0.32, 0.72, 0, 1),
  plunge: Easing.bezier(0.7, 0, 0.84, 0),
  drift: Easing.inOut(Easing.sin),
  linear: Easing.linear,
  step: Easing.step0,
};

export const nativeDriver = Platform.OS !== 'web';

export const isWeb = Platform.OS === 'web';
