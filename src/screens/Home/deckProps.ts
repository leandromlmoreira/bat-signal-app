import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalState } from '../../hooks/useSignal';

export interface DeckProps {
  layout: SceneLayout;
  signal: SignalState;
  onToggle: () => void;
  animated: boolean;
}
