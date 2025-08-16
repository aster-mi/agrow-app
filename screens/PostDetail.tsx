import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../supabaseClient';

interface ReportPayload {
  post_id: string;
  reason: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export default function PostDetail({ route }: Props) {
  const { postId } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!reason) {
      Alert.alert('理由を入力してください');
      return;
    }
    setLoading(true);
    const payload: ReportPayload = { post_id: postId, reason };
    const { error } = await supabase.from('reports').insert(payload);
    setLoading(false);
    if (error) {
      Alert.alert('通報に失敗しました', error.message);
    } else {
      Alert.alert('通報しました');
      setReason('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>投稿詳細</Text>
      <Text style={{ marginBottom: 16 }}>投稿ID: {postId}</Text>
      <TextInput
        placeholder="通報理由"
        value={reason}
        onChangeText={setReason}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 }}
      />
      <Button title={loading ? '送信中...' : '通報'} onPress={handleReport} disabled={loading} />
    </View>
  );
}
