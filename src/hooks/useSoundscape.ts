import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { audioSupported, playIgnition, playShutdown, playThunder, startHum, stopHum, unlockAudio } from '../audio/synth';
import { IGNITION } from '../lib/ignition';
import { parseSoundPreference, serializeSoundPreference, SOUND_KEY } from '../lib/soundPreference';

export function useSoundscape(signalActive: boolean) {
  const [supported] = useState(audioSupported);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!supported) return;
    let mounted = true;
    AsyncStorage.getItem(SOUND_KEY)
      .then((raw) => {
        if (mounted) setEnabled(parseSoundPreference(raw));
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, [supported]);

  useEffect(() => {
    if (!enabled || !signalActive) {
      stopHum();
      return;
    }
    const timer = setTimeout(startHum, 900);
    return () => clearTimeout(timer);
  }, [enabled, signalActive]);

  const toggle = useCallback(() => {
    const next = !enabled;
    if (next) unlockAudio();
    setEnabled(next);
    AsyncStorage.setItem(SOUND_KEY, serializeSoundPreference(next)).catch(() => undefined);
  }, [enabled]);

  const ignite = useCallback(() => {
    if (enabled) playIgnition(IGNITION);
  }, [enabled]);

  const shutdown = useCallback(() => {
    if (enabled) playShutdown();
  }, [enabled]);

  const thunder = useCallback(
    (distance: number) => {
      if (enabled) playThunder(distance);
    },
    [enabled],
  );

  return { supported, enabled, toggle, ignite, shutdown, thunder };
}

export type Soundscape = ReturnType<typeof useSoundscape>;
