import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseHistory, type HistoryEntry } from "../domain/history.ts";

const STORAGE_KEY = "batpass:history:v1";

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    return parseHistory(await AsyncStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    return;
  }
}
