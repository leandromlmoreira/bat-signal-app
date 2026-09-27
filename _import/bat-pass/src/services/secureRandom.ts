import { getRandomValues } from "expo-crypto";
import { createRandomIndex } from "../domain/random.ts";

export const secureRandomIndex = createRandomIndex((buffer) => {
  getRandomValues(buffer);
});

export function secureId(): string {
  const bytes = getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
