import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList /*, Stock */ } from '../types';
import { useStocks } from '../StockContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StockForm'>;

export default function StockForm({ route, navigation }: Props) {
  // main側: 親ID（無ければnull）
  const parentId = route.params?.parentId ?? null;

  // codex側: 編集対象（型衝突を避けるため any 安全キャスト）
  const editingStock /* : Stock | undefined */ =
    (route.params as any)?.stock ?? undefined;

  const [name, setName] = useState(editingStock?.name ?? '');
  const [imageUri, setImageUri] = useState(editingStock?.image ?? '');
  const [tags, setTags] = useState(
    editingStock?.tags ? editingStock.tags.join(',') : ''
  );

  const { addStock /*, updateStock */ } = useStocks();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('名称を入力してください');
      return;
    }

    // ここでは main側の addStock を必ず呼べる前提にしておく
    // （update がある場合は分岐して利用）
    try {
      if (editingStock /* && typeof updateStock === 'function' */) {
        // updateStock が存在する場合の例：
        // updateStock({ id: editingStock.id, name, image: imageUri, tags: parsedTags });
        console.log('Edit (placeholder):', {
          id: editingStock.id,
          name,
          image: imageUri,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        });
      } else {
        addStock(name, parentId);
        // 画像やタグは useStocks の拡張が必要。今は入力値をログに残す。
        console.log('Create (with extra fields):', {
          name,
          parentId,
          imageUri,
          tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        });
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('保存に失敗しました', e?.message ?? String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>名称</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="株の名称"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Text>画像</Text>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200, marginBottom: 12 }}
        />
      ) : null}
      <Button title="画像を選択" onPress={pickImage} />

      <Text style={{ marginTop: 16 }}>タグ (カンマ区切り)</Text>
      <TextInput
        value={tags}
        onChangeText={setTags}
        placeholder="例: agave, succulent"
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <Button title="保存" onPress={handleSave} />
    </View>
  );
}
