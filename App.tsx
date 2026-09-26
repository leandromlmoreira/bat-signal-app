import { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";

/**
 * Bat Pass Generator
 * Gera senhas fortes com opções configuráveis e copia para a área de
 * transferência com um toque. Tema Batman: fundo escuro, acento amarelo.
 */

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}?";

function generatePassword(
  length: number,
  useUpper: boolean,
  useNumbers: boolean,
  useSymbols: boolean
): string {
  let pool = LOWERCASE;
  if (useUpper) pool += UPPERCASE;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;

  let password = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * pool.length);
    password += pool[index];
  }
  return password;
}

export default function App() {
  const [length, setLength] = useState("16");
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const parsedLength = Math.max(4, Math.min(64, parseInt(length, 10) || 16));
    setPassword(generatePassword(parsedLength, useUpper, useNumbers, useSymbols));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!password) return;
    await Clipboard.setStringAsync(password);
    setCopied(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>
        🦇 Bat<Text style={styles.titleAccent}>Pass</Text>
      </Text>
      <Text style={styles.subtitle}>Gerador de senhas fortes</Text>

      <View style={styles.passwordBox}>
        <Text style={styles.passwordText} selectable>
          {password || "Toque em gerar"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.copyButton, !password && styles.copyButtonDisabled]}
        onPress={handleCopy}
        disabled={!password}
      >
        <Text style={styles.copyButtonText}>
          {copied ? "Copiado!" : "Copiar para a área de transferência"}
        </Text>
      </TouchableOpacity>

      <View style={styles.optionsBox}>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Comprimento</Text>
          <TextInput
            style={styles.lengthInput}
            keyboardType="number-pad"
            value={length}
            onChangeText={setLength}
            maxLength={2}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Letras maiúsculas</Text>
          <Switch value={useUpper} onValueChange={setUseUpper} />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Números</Text>
          <Switch value={useNumbers} onValueChange={setUseNumbers} />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Símbolos</Text>
          <Switch value={useSymbols} onValueChange={setUseSymbols} />
        </View>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateButtonText}>Gerar senha</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d10",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#f5f5f5",
  },
  titleAccent: {
    color: "#f4c542",
  },
  subtitle: {
    color: "#9a9a9a",
    marginTop: 4,
    marginBottom: 32,
  },
  passwordBox: {
    width: "100%",
    minHeight: 64,
    justifyContent: "center",
    backgroundColor: "#1a1a1f",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2c2c33",
    paddingHorizontal: 16,
  },
  passwordText: {
    color: "#f4c542",
    fontSize: 18,
    fontFamily: "monospace",
    textAlign: "center",
  },
  copyButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4c542",
  },
  copyButtonDisabled: {
    opacity: 0.4,
  },
  copyButtonText: {
    color: "#f4c542",
    fontWeight: "600",
  },
  optionsBox: {
    width: "100%",
    marginTop: 32,
    gap: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLabel: {
    color: "#f5f5f5",
    fontSize: 16,
  },
  lengthInput: {
    color: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#f4c542",
    width: 48,
    textAlign: "center",
    fontSize: 16,
  },
  generateButton: {
    marginTop: 40,
    backgroundColor: "#f4c542",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
  },
  generateButtonText: {
    color: "#0d0d10",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
