import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { addReminder } from '../services/reminderService';

type Props = NativeStackScreenProps<RootStackParamList, 'ReminderForm'>;

export default function ReminderForm({ navigation }: Props) {
  const [title, setTitle] = useState('水やり');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_: any, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selected) setDate(selected);
  };

  const onSave = async () => {
    await addReminder(title, date);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>タイトル</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }}
      />
      <Button title={`日時: ${date.toLocaleString()}`} onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker value={date} mode="datetime" onChange={onChange} />
      )}
      <View style={{ marginTop: 24 }}>
        <Button title="保存" onPress={onSave} />
      </View>
    </View>
  );
}
