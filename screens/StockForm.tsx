import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Stock } from '../types';

export default function StockForm({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'StockForm'>) {
  const editingStock: Stock | undefined = route.params?.stock;
  const [name, setName] = useState(editingStock?.name ?? '');
  const [imageUri, setImageUri] = useState(editingStock?.image ?? '');
  const [tags, setTags] = useState(editingStock ? editingStock.tags.join(',') : '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!name.trim() || !imageUri || !tags.trim()) {
      Alert.alert('すべての項目を入力してください');
      return;
    }
    // Placeholder submit logic
    const stock: Stock = {
      id: editingStock?.id ?? 'temp-id',
      name,
      image: imageUri,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublic: editingStock?.isPublic ?? true,
    };
    console.log('Submitted stock', stock);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>名称</Text>
      <TextInput value={name} onChangeText={setName} placeholder="株の名称" style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />

      <Text>画像</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 12 }} /> : null}
      <Button title="画像を選択" onPress={pickImage} />

      <Text style={{ marginTop: 16 }}>タグ (カンマ区切り)</Text>
      <TextInput value={tags} onChangeText={setTags} placeholder="例: agave, succulent" style={{ borderWidth: 1, marginBottom: 12, padding: 8 }} />

      <Button title="保存" onPress={handleSubmit} />
    </View>
  );
}
