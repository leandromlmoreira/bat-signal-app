import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color: string;
}

function StrokeIcon({ size = 18, color, d }: IconProps & { d: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const CopyIcon = (props: IconProps) => <StrokeIcon {...props} d="M9 9h10v11H9zM5 15V4h10" />;

export const CheckIcon = (props: IconProps) => <StrokeIcon {...props} d="M5 12.5l4.5 4.5L19 7.5" />;

export const RefreshIcon = (props: IconProps) => <StrokeIcon {...props} d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />;

export const TrashIcon = (props: IconProps) => <StrokeIcon {...props} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />;

export const ShieldIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4" />
);

export const MinusIcon = (props: IconProps) => <StrokeIcon {...props} d="M6 12h12" />;

export const PlusIcon = (props: IconProps) => <StrokeIcon {...props} d="M12 6v12M6 12h12" />;

export const KeyIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M14.5 9.5a4.5 4.5 0 1 1-2.1-3.8M14.5 9.5L21 16v3h-3v-2h-2v-2h-2l-1.7-1.7" />
);

export const SignalIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M10 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" />
);

export const SpeakerIcon = (props: IconProps) => (
  <StrokeIcon {...props} d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
);

export const MutedIcon = (props: IconProps) => <StrokeIcon {...props} d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5" />;
