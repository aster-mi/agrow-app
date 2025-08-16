import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import * as ExpoNotifications from 'expo-notifications';
import Constants from 'expo-constants';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export default function Notifications({ navigation }: Props) {
  const [items, setItems] = useState<NotificationItem[]>([
    { id: '1', message: 'Someone liked your post', read: false },
    { id: '2', message: 'You have a new follower', read: true },
  ]);

  useEffect(() => {
    async function register() {
      const { status } = await ExpoNotifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      // Expo Go does not support remote push notifications
      if (Constants.appOwnership === 'expo') {
        console.log('Push notifications are not supported in Expo Go.');
        return;
      }
      const token = (await ExpoNotifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token', token);
    }
    register();
  }, []);

  const markRead = (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const unread = items.filter(n => !n.read).length;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        {unread > 0 && <Text>Unread: {unread}</Text>}
        <Button title="Settings" onPress={() => navigation.navigate('NotificationSettings')} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markRead(item.id)}>
            <View style={{ padding: 16, backgroundColor: item.read ? '#fff' : '#eef' }}>
              <Text style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ccc' }} />}
      />
    </View>
  );
}
