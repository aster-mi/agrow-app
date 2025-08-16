import React, { useEffect, useState } from 'react';
import { View, Text, Button, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { RootStackParamList } from '../types';
import { initDb, getShelves, saveShelfOrder, getSlots, saveSlotOrder } from '../db';

interface Shelf {
  id: number;
  name: string;
  grid: number;
  position: number;
}

interface Slot {
  id: number;
  shelf_id: number;
  plant: string | null;
  position: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'Shelves'>;

export default function Shelves({ navigation }: Props) {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<Shelf | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    initDb();
    loadShelves();
  }, []);

  function loadShelves() {
    getShelves(setShelves);
  }

  function loadSlots(shelf: Shelf) {
    setSelectedShelf(shelf);
    getSlots(shelf.id, setSlots);
  }

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={shelves}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => {
          setShelves(data);
          saveShelfOrder(data);
        }}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <Pressable
              onLongPress={drag}
              onPress={() => loadSlots(item)}
              style={{ padding: 16, backgroundColor: isActive ? '#eee' : '#fff' }}
            >
              <Text>{item.name}</Text>
            </Pressable>
          </ScaleDecorator>
        )}
      />

      {selectedShelf && (
        <View style={{ flex: 1 }}>
          <Button title={editing ? 'Done' : 'Edit'} onPress={() => setEditing(!editing)} />
          {editing ? (
            <DraggableFlatList
              data={slots}
              numColumns={selectedShelf.grid}
              keyExtractor={(item) => item.id.toString()}
              onDragEnd={({ data }) => {
                setSlots(data);
                saveSlotOrder(selectedShelf.id, data);
              }}
              renderItem={({ item, drag, isActive }) => (
                <ScaleDecorator>
                  <Pressable
                    onLongPress={drag}
                    style={{
                      flex: 1,
                      height: 80,
                      margin: 4,
                      backgroundColor: isActive ? '#ddd' : '#fafafa',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text>{item.plant || 'Empty'}</Text>
                  </Pressable>
                </ScaleDecorator>
              )}
            />
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {slots.map((slot) => (
                <View
                  key={slot.id}
                  style={{
                    width: `${100 / selectedShelf.grid}%`,
                    height: 80,
                    margin: 4,
                    backgroundColor: '#fafafa',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text>{slot.plant || 'Empty'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <Button title="Go to Stocks" onPress={() => navigation.navigate('Stocks')} />
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Go to PostDetail" onPress={() => navigation.navigate('PostDetail', { postId: 'example-post' })} />
      <Button title="Search" onPress={() => navigation.navigate('Search')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
      <Button title="Notification Settings" onPress={() => navigation.navigate('NotificationSettings')} />
    </View>
  );
}
