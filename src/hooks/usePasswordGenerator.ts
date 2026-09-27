import { useCallback, useMemo, useState } from 'react';

import { alphabetSize, clampLength, DEFAULT_OPTIONS, generatePassword, type PasswordOptions } from '../domain/password.ts';
import { evaluateStrength } from '../domain/strength.ts';
import { secureRandomIndex } from '../services/secureRandom';

export type ToggleOption = 'uppercase' | 'numbers' | 'symbols' | 'avoidAmbiguous';

interface GeneratorState {
  options: PasswordOptions;
  password: string;
}

const generate = (options: PasswordOptions): GeneratorState => ({ options, password: generatePassword(options, secureRandomIndex) });

export function usePasswordGenerator() {
  const [state, setState] = useState(() => generate(DEFAULT_OPTIONS));
  const { options, password } = state;

  const regenerate = useCallback(() => setState((current) => generate(current.options)), []);

  const update = useCallback((change: (current: PasswordOptions) => PasswordOptions) => {
    setState((current) => {
      const next = change(current.options);
      return next === current.options ? current : generate(next);
    });
  }, []);

  const setLength = useCallback(
    (length: number) =>
      update((current) => {
        const next = clampLength(length);
        return next === current.length ? current : { ...current, length: next };
      }),
    [update],
  );

  const toggle = useCallback((key: ToggleOption) => update((current) => ({ ...current, [key]: !current[key] })), [update]);

  const strength = useMemo(() => evaluateStrength(options.length, alphabetSize(options)), [options]);

  return { options, password, strength, regenerate, setLength, toggle };
}
