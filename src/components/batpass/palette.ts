import type { CharClass } from '../../domain/charsets.ts';
import type { StrengthLevel } from '../../domain/strength.ts';
import { colors } from '../../theme/tokens';

export const strengthColors: Record<StrengthLevel, string> = {
  weak: colors.alert,
  fair: colors.amberDeep,
  strong: colors.amber,
  fortress: colors.amberHot,
};

export const glyphColors: Record<CharClass, string> = {
  lowercase: colors.text,
  uppercase: colors.text,
  numbers: colors.amber,
  symbols: colors.ice,
};
