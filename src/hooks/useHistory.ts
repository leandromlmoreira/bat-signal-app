import { useCallback, useEffect, useRef, useState } from 'react';

import { pushEntry, type HistoryEntry } from '../domain/history.ts';
import { loadHistory, saveHistory } from '../services/historyStorage';
import { secureId } from '../services/secureRandom';

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    loadHistory().then((stored) => {
      hydrated.current = true;
      setEntries((current) => (current.length ? current : stored));
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated.current) saveHistory(entries);
  }, [entries]);

  const record = useCallback((password: string, bits: number) => {
    setEntries((current) => pushEntry(current, { id: secureId(), password, bits, createdAt: Date.now() }));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, ready, record, clear };
}
