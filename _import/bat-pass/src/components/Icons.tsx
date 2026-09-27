import Svg, { Path } from "react-native-svg";

interface IconProps {
  size?: number;
  color: string;
}

export const BAT_PATH =
  "M30.555 23.53c0 0.062 1.951-2.357 0.39-3.981-1.874-2.124-5.116 1.056-5.116 1.056-2.562-5.059-6.424 3.145-6.424 3.145s-3.348-7.731-6.221-3.047c0.062 0-2.383-2.793-4.819-1.481-1.749 1.749 0 4.091 0 4.091-9.119-3.186-9.712-12.492 2.952-16.286-3.576 4.481 6.59 10.649 5.84-0.344l2.155 1.89c0 0 2.171-1.796 2.171-1.921-0.25 10.993 9.369 4.544 6.121 0.484 11.429 3.308 13.381 11.21 2.951 16.394z";

export const BAT_BOX = { x: 1.648, y: 6.652, width: 35.731, height: 17.098 };

const BAT_VIEWBOX = `${BAT_BOX.x} ${BAT_BOX.y} ${BAT_BOX.width} ${BAT_BOX.height}`;

export function BatGlyph({ size = 28, color }: IconProps) {
  return (
    <Svg width={size} height={(size * BAT_BOX.height) / BAT_BOX.width} viewBox={BAT_VIEWBOX}>
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
