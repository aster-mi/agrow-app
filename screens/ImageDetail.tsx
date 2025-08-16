import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { supabase } from '../supabaseClient';

type Props = {
  route: { params: { imageId: string } };
};

export default function ImageDetail({ route }: Props) {
  const { imageId } = route.params;
  const [shotAt, setShotAt] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('images')
        .select('shot_at')
        .eq('id', imageId)
        .single();
      if (data?.shot_at) setShotAt(data.shot_at);
    };
    load();
  }, [imageId]);

  const save = async () => {
    await supabase.from('images').update({ shot_at: shotAt }).eq('id', imageId);
    alert('Saved');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        value={shotAt}
        onChangeText={setShotAt}
        style={{ borderWidth: 1, padding: 4, marginBottom: 8 }}
      />
      <Button title="Save" onPress={save} />
    </View>
  );
}
