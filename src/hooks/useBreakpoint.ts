import { useWindowDimensions } from 'react-native';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return { width, wide: width >= 1024, compact: width < 420 };
}
