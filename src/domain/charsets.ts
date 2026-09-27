export type CharClass = "lowercase" | "uppercase" | "numbers" | "symbols";

export const CHARSETS: Record<CharClass, string> = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/|~",
};

export const AMBIGUOUS = "Il1O0o|;:,.";

export function stripAmbiguous(charset: string): string {
  return [...charset].filter((char) => !AMBIGUOUS.includes(char)).join("");
}

export function classify(char: string): CharClass {
  const found = (Object.keys(CHARSETS) as CharClass[]).find((key) => CHARSETS[key].includes(char));
  return found ?? "symbols";
}
