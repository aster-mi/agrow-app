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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleSignedIn(session.user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) handleSignedIn(session.user);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignedIn = async (user: User) => {
    // Merge accounts by email in users table
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();
    if (existing && existing.id !== user.id) {
      await supabase.from('users').update({ id: user.id }).eq('email', user.email!);
    } else {
      await supabase.from('users').upsert({ id: user.id, email: user.email });
    }
    // Ensure profile exists
    await supabase.from('profiles').upsert({ id: user.id, username: user.user_metadata?.full_name || '', avatar_url: user.user_metadata?.avatar_url || '' });
    navigation.replace('Shelves');
  };

  const signIn = async (provider: 'google' | 'twitter') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) Alert.alert('Login error', error.message);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      {loading && <ActivityIndicator />}
      <Button title="Sign in with Google" onPress={() => signIn('google')} />
      <Button title="Sign in with X" onPress={() => signIn('twitter')} />
    </View>
  );
}
