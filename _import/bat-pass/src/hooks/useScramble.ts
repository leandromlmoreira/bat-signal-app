import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789#$%&@*+=?";
const FRAME_MS = 28;
const FRAMES = 14;

function scrambleFrame(target: string, frame: number): string {
  const settled = Math.floor((target.length * frame) / FRAMES);
  return [...target]
    .map((char, index) => (index < settled ? char : GLYPHS[(index * 7 + frame * 13) % GLYPHS.length]))
    .join("");
}

export function useScramble(target: string, enabled: boolean): string {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!enabled) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    setDisplay(scrambleFrame(target, frame));
    const interval = setInterval(() => {
      frame += 1;
      if (frame >= FRAMES) {
        setDisplay(target);
        clearInterval(interval);
        return;
      }
      setDisplay(scrambleFrame(target, frame));
    }, FRAME_MS);
    return () => clearInterval(interval);
  }, [target, enabled]);

  return display;
}
