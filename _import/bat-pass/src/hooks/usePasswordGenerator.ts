import { useCallback, useEffect, useMemo, useState } from "react";
import {
  alphabetSize,
  clampLength,
  DEFAULT_OPTIONS,
  generatePassword,
  type PasswordOptions,
} from "../domain/password.ts";
import { evaluateStrength } from "../domain/strength.ts";
import { secureRandomIndex } from "../services/secureRandom.ts";

export type ToggleOption = "uppercase" | "numbers" | "symbols" | "avoidAmbiguous";

export function usePasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState(() => generatePassword(DEFAULT_OPTIONS, secureRandomIndex));
  const [generation, setGeneration] = useState(0);

  const regenerate = useCallback(() => {
    setPassword(generatePassword(options, secureRandomIndex));
    setGeneration((value) => value + 1);
  }, [options]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const setLength = useCallback((length: number) => {
    setOptions((current) => {
      const next = clampLength(length);
      return next === current.length ? current : { ...current, length: next };
    });
  }, []);

  const toggle = useCallback((key: ToggleOption) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  }, []);

  const strength = useMemo(() => evaluateStrength(options.length, alphabetSize(options)), [options]);

  return { options, password, generation, strength, regenerate, setLength, toggle };
}
