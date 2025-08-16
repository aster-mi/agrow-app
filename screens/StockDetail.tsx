import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStocks } from '../StockContext';

function StockTree({ id, navigation }: { id: number; navigation: any }) {
  const { stocks } = useStocks();
  const children = stocks.filter(s => s.parent_id === id);
  if (children.length === 0) return null;
  return (
    <View style={{ marginLeft: 16 }}>
      {children.map(child => (
        <View key={child.id} style={{ marginVertical: 4 }}>
          <TouchableOpacity onPress={() => navigation.navigate('StockDetail', { id: child.id })}>
            <Text>{child.name}</Text>
          </TouchableOpacity>
          <StockTree id={child.id} navigation={navigation} />
        </View>
      ))}
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'StockDetail'>;

export default function StockDetail({ route, navigation }: Props) {
  const { id } = route.params;
  const { stocks } = useStocks();
  const stock = stocks.find(s => s.id === id);
  if (!stock) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Stock not found</Text>
      </View>
    );
  }
  const parent = stocks.find(s => s.id === stock.parent_id);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>{stock.name}</Text>
      {parent ? (
        <TouchableOpacity onPress={() => navigation.navigate('ParentSelect', { stockId: stock.id })}>
          <Text>Parent: {parent.name} (Change)</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('ParentSelect', { stockId: stock.id })}>
          <Text>Select Parent</Text>
        </TouchableOpacity>
      )}
      <Button title="Add Child" onPress={() => navigation.navigate('StockForm', { parentId: stock.id })} />
      <StockTree id={stock.id} navigation={navigation} />
    </View>
  );
}
