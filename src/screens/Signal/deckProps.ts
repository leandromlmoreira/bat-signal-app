import type { Chrome } from '../../components/shell/chrome';
import type { SceneLayout } from '../../hooks/useSceneLayout';
import type { SignalState } from '../../hooks/useSignal';

export interface DeckProps {
  layout: SceneLayout;
  chrome: Chrome;
  signal: SignalState;
  onToggle: () => void;
  animated: boolean;
}
