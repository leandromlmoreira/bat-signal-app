import Svg, { Path } from 'react-native-svg';

interface PowerIconProps {
  size?: number;
  color: string;
}

export function PowerIcon({ size = 18, color }: PowerIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5v8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path
        d="M7.2 6.6a7.5 7.5 0 1 0 9.6 0"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
