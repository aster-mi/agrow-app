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
import { Plus, CreditCard as Edit3, Grid3x3, Settings, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface AgavePlant {
  id: string;
  name: string;
  image: string;
  tags: string[];
  lastWatered: string;
  position?: { shelf: string; row: number; col: number };
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

export default function ShelvesScreen() {
  const [editMode, setEditMode] = useState(false);
  const [shelves, setShelves] = useState<Shelf[]>([
    {
      id: '1',
      name: '温室棚A',
      columns: 3,
      rows: 2,
      plants: [
        [mockPlants[0], mockPlants[1], null],
        [null, mockPlants[2], null],
      ],
    },
    {
      id: '2',
      name: '温室棚B',
      columns: 4,
      rows: 2,
      plants: [
        [null, null, null, null],
        [null, null, null, null],
      ],
    },
  ]);

  // 棚一覧表示用のセルサイズ（2行3列固定）
  const previewCellSize = (width - 80) / 3;

  const openShelfDetail = (shelfId: string) => {
    router.push(`/shelf/${shelfId}`);
  };

  const renderPreviewPlantCell = (plant: AgavePlant | null, row: number, col: number) => (
    <TouchableOpacity
      key={`${row}-${col}`}
      style={[styles.previewPlantCell, { width: previewCellSize, height: previewCellSize * 0.8 }]}
      onPress={() => plant && router.push(`/plant/${plant.id}`)}
    >
      {plant ? (
        <View style={styles.previewPlantContainer}>
          <Image source={{ uri: plant.image }} style={styles.previewPlantImage} />
          <View style={styles.previewWaterIndicator}>
            <View style={[styles.waterDot, { backgroundColor: '#16a34a' }]} />
          </View>
        </View>
      ) : (
        <View style={styles.previewEmptyCell}>
          <View style={styles.emptyDot} />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderShelf = (shelf: Shelf) => (
    <View key={shelf.id} style={styles.shelfContainer}>
      <TouchableOpacity 
        style={styles.shelfCard}
        onPress={() => openShelfDetail(shelf.id)}
      >
        <View style={styles.shelfHeader}>
          <Text style={styles.shelfName}>{shelf.name}</Text>
          <View style={styles.shelfActions}>
            <ChevronRight size={20} color="#6b7280" />
          </View>
        </View>

        {/* 2行3列のプレビューグリッド */}
        <View style={styles.previewGrid}>
          {[0, 1].map(rowIndex => (
            <View key={rowIndex} style={styles.previewRow}>
              {[0, 1, 2].map(colIndex => {
                const plant = shelf.plants[rowIndex]?.[colIndex] || null;
                return renderPreviewPlantCell(plant, rowIndex, colIndex);
              })}
            </View>
          ))}
        </View>

        <View style={styles.shelfStats}>
          <Text style={styles.statsText}>
            {shelf.plants.flat().filter(p => p !== null).length} / {shelf.plants.flat().length} 株配置済み
          </Text>
          <Text style={styles.shelfSize}>
            {shelf.rows}行 × {shelf.columns}列
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>棚管理</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.shelfList}>
          {shelves.map(renderShelf)}
        </View>

        <TouchableOpacity style={styles.addShelfButton}>
          <Plus size={24} color="#16a34a" />
          <Text style={styles.addShelfText}>新しい棚を追加</Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#16a34a',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  shelfList: {
    padding: 20,
    gap: 24,
  },
  shelfContainer: {
    marginBottom: 16,
  },
  shelfCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shelfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  shelfName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  shelfActions: {
    padding: 4,
  },
  previewGrid: {
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  previewPlantCell: {
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewPlantContainer: {
    flex: 1,
    position: 'relative',
  },
  previewPlantImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  previewWaterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  previewEmptyCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  shelfStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  waterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  shelfSize: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  addShelfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dcfce7',
    borderStyle: 'dashed',
  },
  addShelfText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
});