import { useFonts } from 'expo-font';
import { BarlowCondensed_500Medium } from '@expo-google-fonts/barlow-condensed/500Medium';
import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BigShoulders_800ExtraBold } from '@expo-google-fonts/big-shoulders/800ExtraBold';
import { BigShoulders_900Black } from '@expo-google-fonts/big-shoulders/900Black';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';

export function useAppFonts() {
  const [loaded, error] = useFonts({
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
    BigShoulders_800ExtraBold,
    BigShoulders_900Black,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  return loaded || Boolean(error);
}
