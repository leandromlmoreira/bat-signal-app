import Svg, { Path } from "react-native-svg";

interface IconProps {
  size?: number;
  color: string;
}

export const BAT_PATH =
  "M100 84 Q104 74 110 72 Q118 70 124 78 Q132 66 140 70 Q150 72 154 64 Q164 58 172 66 Q184 50 186 26 Q170 42 150 44 Q128 44 130 30 Q122 40 110 42 L107 30 L104 40 L96 40 L93 30 L90 42 Q78 40 70 30 Q72 44 50 44 Q30 42 14 26 Q16 50 28 66 Q36 58 46 64 Q50 72 60 70 Q68 66 76 78 Q82 70 90 72 Q96 74 100 84 Z";

export function BatGlyph({ size = 28, color }: IconProps) {
  return (
    <Svg width={size} height={size / 2} viewBox="10 20 180 70">
      <Path d={BAT_PATH} fill={color} />
    </Svg>
  );
}

function StrokeIcon({ size = 18, color, d }: IconProps & { d: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const CopyIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M9 9h10v11H9zM5 15V4h10" />
);

export const CheckIcon = (props: IconProps) => <StrokeIcon {...props} d="M5 12.5l4.5 4.5L19 7.5" />;

export const RefreshIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
);

export const TrashIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
);

export const ShieldIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4" />
);

export const MinusIcon = (props: IconProps) => <StrokeIcon {...props} d="M6 12h12" />;

export const PlusIcon = (props: IconProps) => <StrokeIcon {...props} d="M12 6v12M6 12h12" />;

export const ClockIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
);
