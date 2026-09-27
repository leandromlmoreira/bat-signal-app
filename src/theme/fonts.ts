import { useFonts } from 'expo-font';
import { Anton_400Regular } from '@expo-google-fonts/anton/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { Oswald_300Light } from '@expo-google-fonts/oswald/300Light';
import { Oswald_400Regular } from '@expo-google-fonts/oswald/400Regular';
import { Oswald_500Medium } from '@expo-google-fonts/oswald/500Medium';
import { Oswald_600SemiBold } from '@expo-google-fonts/oswald/600SemiBold';
import { ShareTechMono_400Regular } from '@expo-google-fonts/share-tech-mono/400Regular';

export function useAppFonts() {
  const [loaded, error] = useFonts({
    Anton_400Regular,
    JetBrainsMono_500Medium,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    ShareTechMono_400Regular,
  });

  return loaded || Boolean(error);
}
