import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
import { BigShouldersDisplay_800ExtraBold, BigShouldersDisplay_900Black } from "@expo-google-fonts/big-shoulders-display";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono/500Medium";
import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";
import { GeneratorScreen } from "./src/screens/GeneratorScreen.tsx";
import { colors } from "./src/theme/tokens.ts";

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BigShouldersDisplay_800ExtraBold,
    BigShouldersDisplay_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {fontsLoaded || fontError ? <GeneratorScreen /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.night,
  },
});
