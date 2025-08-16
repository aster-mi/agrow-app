import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, NfcHistoryItem } from '../utils/nfcHistory';

export default function NfcHistory() {
  const [history, setHistory] = useState<NfcHistoryItem[]>([]);

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const renderItem = ({ item }: { item: NfcHistoryItem }) => (
    <View style={{ padding: 16, borderBottomWidth: 1 }}>
      <Text>{item.id}</Text>
      <Text>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}
