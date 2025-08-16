import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

export default function Shelves({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Shelves Screen</Text>
      <Button title="Go to Stocks" onPress={() => navigation.navigate('Stocks')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <Button title="Notification Settings" onPress={() => navigation.navigate('NotificationSettings')} />
    </View>
  );
}
