import { Easing, Platform } from 'react-native';

export const colors = {
  night: '#04060A',
  ink: '#080B11',
  graphite: '#0E131B',
  steel: '#161D28',
  slate: '#222B38',
  fog: '#7F93AE',
  fogDeep: '#3B4A60',
  amber: '#FFC53D',
  amberSoft: '#FFD677',
  amberHot: '#FFEBB8',
  amberDeep: '#D98E1F',
  amberWash: 'rgba(255,197,61,0.1)',
  amberLine: 'rgba(255,197,61,0.34)',
  onAmber: '#140E02',
  text: '#E4E9F0',
  muted: '#96A1B2',
  dim: '#657084',
  hairline: 'rgba(160,184,220,0.11)',
  hairlineStrong: 'rgba(160,184,220,0.2)',
  highlight: 'rgba(200,220,255,0.05)',
  core: '#070A0F',
  glass: 'rgba(6,9,14,0.66)',
  ice: '#9DBBDD',
  alert: '#FF5A47',
};

export const fonts = {
  display: 'Anton_400Regular',
  heading: 'Oswald_600SemiBold',
  label: 'Oswald_500Medium',
  body: 'Oswald_300Light',
  bodyStrong: 'Oswald_400Regular',
  mono: 'ShareTechMono_400Regular',
  code: 'JetBrainsMono_500Medium',
};

export const radii = {
  panel: 6,
  control: 4,
  tight: 2,
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
