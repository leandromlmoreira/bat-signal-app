import { useEffect, useState } from 'react';

const GLYPHS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789#$%&@*+=?';
const FRAME_MS = 28;
const FRAMES = 14;

function scrambleFrame(target: string, frame: number) {
  const settled = Math.floor((target.length * frame) / FRAMES);
  return [...target]
    .map((char, index) => (index < settled ? char : GLYPHS[(index * 7 + frame * 13) % GLYPHS.length]))
    .join('');
}

export function useScramble(target: string, enabled: boolean) {
  const [run, setRun] = useState({ target, frame: 0 });

  if (run.target !== target) {
    setRun({ target, frame: 0 });
  }

  useEffect(() => {
    if (!enabled || run.frame >= FRAMES) return;
    const timer = setTimeout(() => setRun((current) => ({ ...current, frame: current.frame + 1 })), FRAME_MS);
    return () => clearTimeout(timer);
  }, [enabled, run]);

  if (!enabled || run.target !== target || run.frame >= FRAMES) return target;
  return scrambleFrame(target, run.frame);
}
