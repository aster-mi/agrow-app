import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 既存セッション確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleSignedIn(session.user);
    });

    // 認証状態の購読
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) handleSignedIn(session.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignedIn = async (user: User) => {
    try {
      // users テーブルで email ベースのマージ（email がある場合のみ）
      if (user.email) {
        const { data: existing, error: selectErr } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();
        if (selectErr) throw selectErr;

        if (existing && existing.id !== user.id) {
          const { error: updateErr } = await supabase
            .from('users')
            .update({ id: user.id })
            .eq('email', user.email);
          if (updateErr) throw updateErr;
        } else {
          const { error: upsertErr } = await supabase
            .from('users')
            .upsert({ id: user.id, email: user.email });
          if (upsertErr) throw upsertErr;
        }
      } else {
        // email 無い場合は id のみで upsert
        const { error: upsertErr } = await supabase
          .from('users')
          .upsert({ id: user.id, email: null });
        if (upsertErr) throw upsertErr;
      }

      // profiles の存在保証
      const username = (user.user_metadata as any)?.full_name || '';
      const avatar_url = (user.user_metadata as any)?.avatar_url || '';
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({ id: user.id, username, avatar_url });
      if (profileErr) throw profileErr;

      navigation.replace('Shelves');
    } catch (e: any) {
      Alert.alert('Sign-in post process failed', e?.message ?? String(e));
    }
  };

  const signIn = async (provider: 'google' | 'twitter') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) Alert.alert('Login error', error.message);
      // モバイルではブラウザへ遷移 → 戻ってきたとき onAuthStateChange で捕捉
    } catch (e: any) {
      Alert.alert('Login error', e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>Login Screen</Text>

      {loading && <ActivityIndicator />}

      {/* OAuth ログイン */}
      <Button title="Sign in with Google" onPress={() => signIn('google')} />
      <Button title="Sign in with X" onPress={() => signIn('twitter')} />

      {/* 開発用ショートカット（必要なければ削除OK） */}
      {__DEV__ && (
        <>
          <Button title="Go to Shelves" onPress={() => navigation.navigate('Shelves')} />
          <Button title="Go to Timeline" onPress={() => navigation.navigate('Timeline')} />
        </>
      )}
    </View>
  );
}
