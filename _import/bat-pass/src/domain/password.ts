import { CHARSETS, stripAmbiguous, type CharClass } from "./charsets.ts";
import type { RandomIndex } from "./random.ts";

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export const LENGTH_MIN = 8;
export const LENGTH_MAX = 64;

export const DEFAULT_OPTIONS: PasswordOptions = {
  length: 20,
  uppercase: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: false,
};

export function clampLength(length: number): number {
  if (!Number.isFinite(length)) return DEFAULT_OPTIONS.length;
  return Math.min(LENGTH_MAX, Math.max(LENGTH_MIN, Math.round(length)));
}

export function enabledClasses(options: PasswordOptions): CharClass[] {
  const optional: CharClass[] = ["uppercase", "numbers", "symbols"];
  return ["lowercase", ...optional.filter((key) => options[key as keyof PasswordOptions])];
}

export function buildPools(options: PasswordOptions): string[] {
  return enabledClasses(options).map((key) =>
    options.avoidAmbiguous ? stripAmbiguous(CHARSETS[key]) : CHARSETS[key],
  );
}

export function alphabetSize(options: PasswordOptions): number {
  return buildPools(options).reduce((total, pool) => total + pool.length, 0);
}

function pick(pool: string, randomIndex: RandomIndex): string {
  return pool[randomIndex(pool.length)];
}

function shuffle<T>(items: T[], randomIndex: RandomIndex): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generatePassword(options: PasswordOptions, randomIndex: RandomIndex): string {
  const pools = buildPools(options);
  const alphabet = pools.join("");
  const length = clampLength(options.length);
  const required = pools.map((pool) => pick(pool, randomIndex));
  const filler = Array.from({ length: length - required.length }, () => pick(alphabet, randomIndex));
  return shuffle([...required, ...filler], randomIndex).join("");
}
