import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3, Settings, Grid3x3 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AgavePlant {
  id: string;
  name: string;
  image: string;
  tags: string[];
  lastWatered: string;
}

interface Shelf {
  id: string;
  name: string;
  columns: number;
  rows: number;
  plants: (AgavePlant | null)[][];
}

const mockPlants: AgavePlant[] = [
  {
    id: '1',
    name: 'アガベ 白鯨',
    image: 'https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=300',
    tags: ['白鯨', 'チタノタ'],
    lastWatered: '2024-01-15',
  },
  {
    id: '2',
    name: 'アガベ 雷神',
    image: 'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=300',
    tags: ['雷神', 'フェロックス'],
    lastWatered: '2024-01-14',
  },
  {
    id: '3',
    name: 'アガベ 笹の雪',
    image: 'https://images.pexels.com/photos/6076976/pexels-photo-6076976.jpeg?auto=compress&cs=tinysrgb&w=300',
    tags: ['笹の雪', 'ビクトリア'],
    lastWatered: '2024-01-13',
  },
];

const mockShelf: Shelf = {
  id: '1',
  name: '温室棚A',
  columns: 3,
  rows: 4,
  plants: [
    [mockPlants[0], mockPlants[1], null],
    [null, mockPlants[2], null],
    [null, null, null],
    [null, null, null],
  ],
};

export default function ShelfDetailScreen() {
  const { id } = useLocalSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [shelf, setShelf] = useState(mockShelf);

  const cellSize = (width - 60) / shelf.columns;

  const addPlant = (row: number, col: number) => {
    Alert.alert(
      '株を追加',
      '新しい株を追加しますか？',
      [
        { text: 'キャンセル' },
        { 
          text: '追加', 
          onPress: () => {
            console.log('Add plant to position:', row, col);
          }
        },
      ]
    );
  };

  const renderPlantCell = (plant: AgavePlant | null, row: number, col: number) => (
    <TouchableOpacity
      key={`${row}-${col}`}
      style={[styles.plantCell, { width: cellSize, height: cellSize }]}
      onPress={() => plant ? router.push(`/plant/${plant.id}`) : addPlant(row, col)}
      onLongPress={() => editMode && plant && console.log('Move plant:', plant.id)}
    >
      {plant ? (
        <View style={styles.plantContainer}>
          <Image source={{ uri: plant.image }} style={styles.plantImage} />
          <Text style={styles.plantName} numberOfLines={2}>{plant.name}</Text>
          <View style={styles.waterIndicator}>
            <View style={[styles.waterDot, { backgroundColor: '#16a34a' }]} />
          </View>
        </View>
      ) : (
        <View style={styles.emptyCell}>
          <Plus size={20} color="#9ca3af" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{shelf.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.editButton, editMode && styles.editButtonActive]}
            onPress={() => setEditMode(!editMode)}
          >
            <Edit3 size={18} color={editMode ? '#ffffff' : '#16a34a'} />
            <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
              {editMode ? '完了' : '編集'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.shelfInfo}>
          <Text style={styles.shelfDescription}>
            {shelf.rows}行 × {shelf.columns}列の棚
          </Text>
          <Text style={styles.plantCount}>
            {shelf.plants.flat().filter(p => p !== null).length} / {shelf.plants.flat().length} 株配置済み
          </Text>
        </View>

        <View style={styles.shelfGrid}>
          {shelf.plants.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.shelfRow}>
              {row.map((plant, colIndex) => 
                renderPlantCell(plant, rowIndex, colIndex)
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {editMode && (
        <View style={styles.editModeHint}>
          <Grid3x3 size={16} color="#16a34a" />
          <Text style={styles.editModeHintText}>
            株を長押ししてドラッグで移動できます
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  editButtonActive: {
    backgroundColor: '#16a34a',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  editButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  shelfInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  shelfDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  plantCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  shelfGrid: {
    gap: 12,
  },
  shelfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  plantCell: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  plantContainer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  plantImage: {
    width: '100%',
    flex: 1,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  plantName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  waterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  waterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderTopWidth: 1,
    borderTopColor: '#dcfce7',
  },
  editModeHintText: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '500',
  },
});