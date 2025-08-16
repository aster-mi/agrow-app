import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    like: true,
    repost: true,
    comment: true,
    follow: true,
    watering_reminder: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {Object.entries(settings).map(([key, value]) => (
        <View
          key={key}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}
        >
          <Text>{key}</Text>
          <Switch value={value} onValueChange={() => toggle(key as keyof typeof settings)} />
        </View>
      ))}
    </View>
  );
}
