import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStocks } from '../StockContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ParentSelect'>;

export default function ParentSelect({ route, navigation }: Props) {
  const { stockId } = route.params;
  const { stocks, setParent } = useStocks();
  const options = stocks.filter(s => s.id !== stockId);

  const handleSelect = (parent_id: number | null) => {
    setParent(stockId, parent_id);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={options}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelect(item.id)}>
            <Text style={{ fontSize: 18, marginVertical: 8 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <TouchableOpacity onPress={() => handleSelect(null)}>
            <Text style={{ fontSize: 18, marginVertical: 8 }}>No Parent</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
}
