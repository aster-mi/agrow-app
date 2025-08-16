import AsyncStorage from '@react-native-async-storage/async-storage';

export type NfcHistoryItem = {
  id: string;
  timestamp: number;
};

export const HISTORY_KEY = 'nfc_history';

export async function addHistory(id: string) {
  const existing = await AsyncStorage.getItem(HISTORY_KEY);
  let items: NfcHistoryItem[] = existing ? JSON.parse(existing) : [];
  items = items.filter((item) => item.id !== id);
  items.unshift({ id, timestamp: Date.now() });
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export async function getHistory(): Promise<NfcHistoryItem[]> {
  const existing = await AsyncStorage.getItem(HISTORY_KEY);
  return existing ? JSON.parse(existing) : [];
}
