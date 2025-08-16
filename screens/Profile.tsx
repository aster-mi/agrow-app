import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers: string[] | null;
  following: string[] | null;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ route }: Props) {
  const { userId } = route.params || {};
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const isOwnProfile = !userId || userId === sessionUserId;

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = userId ?? session?.user.id;
      setSessionUserId(session?.user.id ?? null);
      if (!uid) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (data) {
        setProfile(data);
        setUsername(data.username ?? '');
        setBio(data.bio ?? '');
      }
    };
    load();
  }, [userId]);

  const save = async () => {
    if (!sessionUserId) return;
    const updates = { id: sessionUserId, username, bio };
    const { data } = await supabase.from('profiles').upsert(updates).select().single();
    if (data) {
      setProfile(data);
      setEditing(false);
    }
  };

  const toggleFollow = async () => {
    if (!profile || !sessionUserId || isOwnProfile) return;
    const following = profile.followers?.includes(sessionUserId);
    if (following) {
      const newFollowers = (profile.followers || []).filter((id) => id !== sessionUserId);
      await supabase.from('profiles').update({ followers: newFollowers }).eq('id', profile.id);
      const { data } = await supabase.from('profiles').select('following').eq('id', sessionUserId).single();
      const myFollowing = (data?.following || []).filter((id: string) => id !== profile.id);
      await supabase.from('profiles').update({ following: myFollowing }).eq('id', sessionUserId);
      setProfile({ ...profile, followers: newFollowers });
    } else {
      const newFollowers = [...(profile.followers || []), sessionUserId];
      await supabase.from('profiles').update({ followers: newFollowers }).eq('id', profile.id);
      const { data } = await supabase.from('profiles').select('following').eq('id', sessionUserId).single();
      const myFollowing = [...(data?.following || []), profile.id];
      await supabase.from('profiles').update({ following: myFollowing }).eq('id', sessionUserId);
      setProfile({ ...profile, followers: newFollowers });
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {profile ? (
        <>
          {profile.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
          ) : null}
          {editing ? (
            <>
              <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
              <TextInput placeholder="Bio" value={bio} onChangeText={setBio} multiline />
              <Button title="Save" onPress={save} />
            </>
          ) : (
            <>
              <Text>{profile.username}</Text>
              <Text>{profile.bio}</Text>
              {isOwnProfile ? (
                <Button title="Edit" onPress={() => setEditing(true)} />
              ) : (
                <Button
                  title={profile.followers?.includes(sessionUserId ?? '') ? 'Unfollow' : 'Follow'}
                  onPress={toggleFollow}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Text>No profile loaded</Text>
      )}
    </View>
  );
}
