import React from 'react';
import { View, Text, Button, Share } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Stock } from '../types';

const sampleStock: Stock = {
  id: '1',
  name: 'サンプル株',
  image: 'https://placehold.co/600x400',
  tags: ['agave'],
  isPublic: false,
};

export default function Stocks({ navigation }: NativeStackScreenProps<RootStackParamList, 'Stocks'>) {
  const shareStock = async (stock: Stock) => {
    if (stock.isPublic) {
      await Share.share({ message: `Check my stock ${stock.name}: https://example.com/stocks/${stock.id}`, url: stock.image });
    } else {
      await Share.share({ url: stock.image });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Text>Stocks Screen</Text>
      <Button title="株を追加" onPress={() => navigation.navigate('StockForm')} />
      <Button title="共有" onPress={() => shareStock(sampleStock)} />
    </View>
  );
}
