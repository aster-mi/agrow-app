import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types';
import { useStocks } from '../StockContext';

import * as ImagePicker from 'expo-image-picker';
import { supabase, PLANT_IMAGES_BUCKET } from '../supabaseClient';
import { canUpload, ensurePlantImagesBucket } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Stocks'>;

export default function Stocks({ navigation }: Props) {
  // --- codex: 在庫一覧（parent_id=null のルートのみ）
  const { stocks } = useStocks();
  const roots = stocks.filter((s) => s.parent_id === null);

  // --- main: 画像アップロードUI
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [shotAt, setShotAt] = useState('');
  const [memo, setMemo] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset);

      // EXIF から撮影日時を推測（なければ現在時刻）
      const exifDate = (asset.exif as any)?.DateTimeOriginal;
      if (exifDate) {
        // "YYYY:MM:DD HH:mm:ss" → ISO へ荒めに変換
        const parsed = new Date(exifDate.replace(/:/g, '-').replace(' ', 'T'));
        setShotAt(parsed.toISOString());
      } else {
        setShotAt(new Date().toISOString());
      }
    }
  };

  const upload = async () => {
    try {
      if (!image) return;

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userData.user;
      if (!user) {
        Alert.alert('Error', 'ログインが必要です');
        return;
      }

      await ensurePlantImagesBucket();

      const size = image.fileSize ?? 0;
      const allowed = await canUpload(user.id, size);
      if (!allowed) {
        Alert.alert('Limit', 'ストレージ上限を超えています');
        return;
      }

      const ext =
        image.fileName?.split('.').pop()?.toLowerCase() ||
        (image.type === 'image' ? 'jpg' : 'bin');
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const res = await fetch(image.uri);
      const blob = await res.blob();

      const { error: uploadError } = await supabase.storage
        .from(PLANT_IMAGES_BUCKET)
        .upload(filePath, blob);

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertErr } = await supabase.from('images').insert({
        user_id: user.id,
        path: filePath,
        shot_at: shotAt || new Date().toISOString(),
        memo,
      });
      if (insertErr) throw insertErr;

      Alert.alert('Success', 'アップロードしました');
      setImage(null);
      setShotAt('');
      setMemo('');
    } catch (e: any) {
      Alert.alert('Upload failed', e?.message ?? String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 16 }}>
      {/* 在庫のルート一覧（codex） */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={roots}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('StockDetail', { id: item.id })}
            >
              <Text style={{ fontSize: 18, marginVertical: 8 }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>No stocks yet</Text>}
        />
        <Button title="Add Stock" onPress={() => navigation.navigate('StockForm')} />
      </View>

      {/* 画像アップロード（main） */}
      <View style={{ borderTopWidth: 1, paddingTop: 16 }}>
        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 8 }}
          />
        )}
        <Button title="Pick Image" onPress={pickImage} />
        <TextInput
          placeholder="Shot At (ISO)"
          value={shotAt}
          onChangeText={setShotAt}
          style={{ borderWidth: 1, width: '100%', marginTop: 8, padding: 8, borderRadius: 6 }}
        />
        <TextInput
          placeholder="Memo"
          value={memo}
          onChangeText={setMemo}
          style={{ borderWidth: 1, width: '100%', marginTop: 8, padding: 8, borderRadius: 6 }}
        />
        <Button title="Upload" onPress={upload} disabled={!image} />
      </View>
    </View>
  );
}
