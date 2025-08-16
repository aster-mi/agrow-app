import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Stocks'>;

export default function Stocks({ route }: Props) {
  const id = route.params?.id;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Stocks Screen</Text>
      {id && <Text>株ID: {id}</Text>}
    </View>
  );
}
