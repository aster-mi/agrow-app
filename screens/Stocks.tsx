import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStocks } from '../StockContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Stocks'>;

export default function Stocks({ navigation }: Props) {
  const { stocks } = useStocks();
  const roots = stocks.filter(s => s.parent_id === null);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={roots}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('StockDetail', { id: item.id })}>
            <Text style={{ fontSize: 18, marginVertical: 8 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No stocks yet</Text>}
      />
      <Button title="Add Stock" onPress={() => navigation.navigate('StockForm')} />
    </View>
  );
}
