import { useCallback, useState } from 'react';

import { formatCallCount, formatElapsed } from '../lib/format';

export type SignalTone = 'system' | 'alert' | 'calm';

export interface SignalEvent {
  id: number;
  at: number;
  text: string;
  tone: SignalTone;
}

const MAX_EVENTS = 4;

function createEvent(id: number, text: string, tone: SignalTone): SignalEvent {
  return { id, at: Date.now(), text, tone };
}

export function useSignal() {
  const [active, setActive] = useState(false);
  const [calls, setCalls] = useState(0);
  const [activatedAt, setActivatedAt] = useState<number | null>(null);
  const [events, setEvents] = useState<SignalEvent[]>(() => [
    createEvent(0, 'canal seguro estabelecido', 'system'),
    createEvent(1, 'holofote do telhado pronto', 'system'),
  ]);

  const log = useCallback((text: string, tone: SignalTone) => {
    setEvents((current) => {
      const nextId = (current.at(-1)?.id ?? 0) + 1;
      return [...current, createEvent(nextId, text, tone)].slice(-MAX_EVENTS);
    });
  }, []);

  const toggle = useCallback(() => {
    if (active) {
      const duration = activatedAt ? Date.now() - activatedAt : 0;
      log(`sinal desligado após ${formatElapsed(duration)}`, 'calm');
      setActive(false);
      setActivatedAt(null);
      return;
    }

    const nextCalls = calls + 1;
    log(`chamado #${formatCallCount(nextCalls)} projetado nas nuvens`, 'alert');
    setCalls(nextCalls);
    setActive(true);
    setActivatedAt(Date.now());
  }, [active, activatedAt, calls, log]);

  return { active, calls, activatedAt, events, toggle };
}

export type SignalState = ReturnType<typeof useSignal>;
