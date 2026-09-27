import { useCallback, useEffect, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';

const FEEDBACK_MS = 1800;

export function useCopyFeedback() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async (text: string, key: string) => {
    if (timer.current) clearTimeout(timer.current);
    try {
      await Clipboard.setStringAsync(text);
      setFailed(false);
      setCopiedKey(key);
    } catch {
      setFailed(true);
      setCopiedKey(null);
    }
    timer.current = setTimeout(() => {
      setCopiedKey(null);
      setFailed(false);
    }, FEEDBACK_MS);
  }, []);

  return { copiedKey, failed, copy };
}
