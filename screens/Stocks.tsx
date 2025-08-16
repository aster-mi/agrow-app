import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase, PLANT_IMAGES_BUCKET } from '../supabaseClient';
import { canUpload, ensurePlantImagesBucket } from '../lib/storage';

export default function Stocks() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [shotAt, setShotAt] = useState('');
  const [memo, setMemo] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset);
      const exifDate = (asset.exif as any)?.DateTimeOriginal;
      if (exifDate) {
        const parsed = new Date(exifDate.replace(/:/g, '-').replace(' ', 'T'));
        setShotAt(parsed.toISOString());
      } else {
        setShotAt(new Date().toISOString());
      }
    }
  };

  const upload = async () => {
    if (!image) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;
    await ensurePlantImagesBucket();
    const size = image.fileSize ?? 0;
    const allowed = await canUpload(user.id, size);
    if (!allowed) {
      alert('Storage limit exceeded');
      return;
    }
    const ext = image.fileName?.split('.').pop() || 'jpg';
    const filePath = `${user.id}/${Date.now()}.${ext}`;
    const file = await fetch(image.uri);
    const blob = await file.blob();
    const { error: uploadError } = await supabase.storage
      .from(PLANT_IMAGES_BUCKET)
      .upload(filePath, blob);
    if (uploadError) {
      alert('Upload failed');
      return;
    }
    await supabase.from('images').insert({
      user_id: user.id,
      path: filePath,
      shot_at: shotAt,
      memo,
    });
    alert('Uploaded');
    setImage(null);
    setShotAt('');
    setMemo('');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {image && (
        <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Pick Image" onPress={pickImage} />
      <TextInput
        placeholder="Shot At"
        value={shotAt}
        onChangeText={setShotAt}
        style={{ borderWidth: 1, width: '100%', marginTop: 8, padding: 4 }}
      />
      <TextInput
        placeholder="Memo"
        value={memo}
        onChangeText={setMemo}
        style={{ borderWidth: 1, width: '100%', marginTop: 8, padding: 4 }}
      />
      <Button title="Upload" onPress={upload} disabled={!image} />
    </View>
  );
}
