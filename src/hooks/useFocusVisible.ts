import { useCallback, useState } from 'react';
import type { NativeSyntheticEvent, TargetedEvent } from 'react-native';

import { isWeb } from '../theme/tokens';

type FocusEvent = NativeSyntheticEvent<TargetedEvent>;

function matchesFocusVisible(target: unknown) {
  if (!isWeb) return true;
  const element = target as { matches?: (selector: string) => boolean } | null;
  return element?.matches?.(':focus-visible') ?? true;
}

export function useFocusVisible() {
  const [focusVisible, setFocusVisible] = useState(false);
  const onFocus = useCallback((event: FocusEvent) => setFocusVisible(matchesFocusVisible(event.target)), []);
  const onBlur = useCallback(() => setFocusVisible(false), []);

  return { focusVisible, onFocus, onBlur };
}
