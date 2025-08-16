import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useStocks } from '../StockContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StockForm'>;

export default function StockForm({ route, navigation }: Props) {
  const parentId = route.params?.parentId ?? null;
  const { addStock } = useStocks();
  const [name, setName] = useState('');

  const handleAdd = () => {
    addStock(name, parentId);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="Save" onPress={handleAdd} disabled={!name} />
    </View>
  );
}
