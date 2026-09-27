import { useCallback, useEffect, useState } from 'react';

import { isWeb } from '../theme/tokens';

export type Area = 'signal' | 'batpass';

export const AREAS: readonly Area[] = ['signal', 'batpass'];

const HASH: Record<Area, string> = {
  signal: '',
  batpass: '#batpass',
};

const hasLocation = () => isWeb && typeof window !== 'undefined';

function readArea(): Area {
  if (!hasLocation()) return 'signal';
  return window.location.hash === HASH.batpass ? 'batpass' : 'signal';
}

export function useAreaRoute() {
  const [area, setArea] = useState<Area>(readArea);

  useEffect(() => {
    if (!hasLocation()) return;
    const sync = () => setArea(readArea());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const navigate = useCallback((next: Area) => {
    setArea(next);
    if (!hasLocation() || readArea() === next) return;
    const { pathname, search } = window.location;
    window.history.pushState(null, '', `${pathname}${search}${HASH[next]}`);
  }, []);

  return { area, navigate };
}
