import { memo, useMemo } from 'react';
import { Animated } from 'react-native';

import { useSwing } from '../../hooks/useLoop';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalPower } from '../../hooks/useSignalPower';
import { EMBLEM_VIEW, SignalEmblem, emblemWidthForDisc } from './SignalEmblem';

interface ProjectionProps {
  layout: SceneLayout;
  power: SignalPower;
  animated: boolean;
}

function ProjectionView({ layout, power, animated }: ProjectionProps) {
  const width = emblemWidthForDisc(layout.projectionWidth);
  const height = width * (EMBLEM_VIEW.height / EMBLEM_VIEW.width);
  const sway = useSwing(9000, animated);

  const opacity = useMemo(
    () =>
      Animated.multiply(
        power.power.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 0.28, 1] }),
        power.shimmer,
      ),
    [power.power, power.shimmer],
  );
  const scale = power.reach.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] });
  const drift = sway.interpolate({ inputRange: [-1, 1], outputRange: [-4, 4] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: layout.target.x - width / 2,
        top: layout.target.y - height / 2,
        width,
        height,
        opacity,
        transform: [{ translateX: drift }, { rotate: `${layout.angle * 0.3}deg` }, { scale }],
      }}
    >
      <SignalEmblem id="projection" width={width} />
    </Animated.View>
  );
}

export const Projection = memo(ProjectionView);
