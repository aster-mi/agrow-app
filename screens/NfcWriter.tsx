import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as NFC from 'expo-nfc';

export default function NfcWriter() {
  const [stockId, setStockId] = useState('');
  const [status, setStatus] = useState('');

  const writeTag = async () => {
    try {
      await NFC.requestTechnologyAsync(NFC.Ndef);
      await NFC.writeNdefMessageAsync(
        NFC.buildNdefMessage([NFC.ndefRecords.uriRecord(`agrow://stock/${stockId}`)])
      );
      setStatus('タグへの書き込みに成功しました');
    } catch (e) {
      setStatus('書き込みに失敗しました');
    } finally {
      NFC.cancelTechnologyRequestAsync();
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="株ID"
        value={stockId}
        onChangeText={setStockId}
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title="タグへ書き込む" onPress={writeTag} />
      <Text style={{ marginTop: 16 }}>{status}</Text>
    </View>
  );
}
