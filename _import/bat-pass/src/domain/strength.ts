export type StrengthLevel = "weak" | "fair" | "strong" | "fortress";

export interface Strength {
  bits: number;
  level: StrengthLevel;
  label: string;
  score: number;
  crackTime: string;
}

export const GUESSES_PER_SECOND = 1e11;

const LEVELS: { level: StrengthLevel; min: number; label: string }[] = [
  { level: "fortress", min: 100, label: "Fortaleza" },
  { level: "strong", min: 72, label: "Forte" },
  { level: "fair", min: 50, label: "Razoável" },
  { level: "weak", min: 0, label: "Vulnerável" },
];

const SCORE_BY_LEVEL: Record<StrengthLevel, number> = { weak: 1, fair: 2, strong: 3, fortress: 4 };

export function entropyBits(length: number, alphabetSize: number): number {
  if (length <= 0 || alphabetSize <= 1) return 0;
  return length * Math.log2(alphabetSize);
}

const UNITS: { seconds: number; singular: string; plural: string }[] = [
  { seconds: 31_557_600 * 1e9, singular: "bilhão de anos", plural: "bilhões de anos" },
  { seconds: 31_557_600 * 1e6, singular: "milhão de anos", plural: "milhões de anos" },
  { seconds: 31_557_600 * 1e3, singular: "mil anos", plural: "mil anos" },
  { seconds: 31_557_600, singular: "ano", plural: "anos" },
  { seconds: 86_400, singular: "dia", plural: "dias" },
  { seconds: 3_600, singular: "hora", plural: "horas" },
  { seconds: 60, singular: "minuto", plural: "minutos" },
  { seconds: 1, singular: "segundo", plural: "segundos" },
];

const UNIVERSE_AGE_SECONDS = 31_557_600 * 13.8e9;

export function formatDuration(seconds: number): string {
  if (seconds < 1) return "menos de 1 segundo";
  if (seconds > UNIVERSE_AGE_SECONDS * 1000) return "mais que mil vezes a idade do universo";
  const unit = UNITS.find((candidate) => seconds >= candidate.seconds) ?? UNITS[UNITS.length - 1];
  const amount = Math.floor(seconds / unit.seconds);
  return `${amount.toLocaleString("pt-BR")} ${amount === 1 ? unit.singular : unit.plural}`;
}

export function crackSeconds(bits: number, guessesPerSecond = GUESSES_PER_SECOND): number {
  return Math.pow(2, bits - 1) / guessesPerSecond;
}

export function evaluateStrength(length: number, alphabetSize: number): Strength {
  const bits = entropyBits(length, alphabetSize);
  const match = LEVELS.find((candidate) => bits >= candidate.min) ?? LEVELS[LEVELS.length - 1];
  return {
    bits,
    level: match.level,
    label: match.label,
    score: SCORE_BY_LEVEL[match.level],
    crackTime: formatDuration(crackSeconds(bits)),
  };
}
