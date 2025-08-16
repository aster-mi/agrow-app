import React from 'react';
import { View, Text } from 'react-native';

export default function NfcWriter() {
  return (
    <View
      style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}
    >
      <Text>NFC書き込みは Expo Go ではサポートされていません。</Text>
      <Text>カスタム開発ビルドでご利用ください。</Text>
    </View>
  );
}

