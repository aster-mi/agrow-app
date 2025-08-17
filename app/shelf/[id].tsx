import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit3, Grid3x3 } from 'lucide-react-native';
import { useTheme } from '../../ThemeContext';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

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

interface Cell {
  id: string;
  plant: AgavePlant | null;
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
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [shelf, setShelf] = useState(mockShelf);
  const [data, setData] = useState<Cell[]>(() =>
    shelf.plants.flatMap((row, r) =>
      row.map((plant, c) => ({ id: `cell-${r}-${c}`, plant })),
    ),
  );

  const padding = 20;
  const margin = 6;
  const cellSize =
    (width - padding * 2 - margin * 2 * shelf.columns) / shelf.columns;

  const addPlant = (row: number, col: number) => {
    router.push(`/stock/new?shelf=${shelf.id}&row=${row}&col=${col}`);
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Cell>) => {
    const [, rowStr, colStr] = item.id.split('-');
    const row = Number(rowStr);
    const col = Number(colStr);
    const plant = item.plant;

    return (
      <TouchableOpacity
        style={[
          styles.plantCell,
          { width: cellSize, height: cellSize, opacity: isActive ? 0.9 : 1 },
        ]}
        onPress={() =>
          plant ? router.push(`/plant/${plant.id}`) : addPlant(row, col)
        }
        onLongPress={() => editMode && plant && drag()}
        disabled={isActive}
      >
        {plant ? (
          <View style={styles.plantContainer}>
            <Image source={{ uri: plant.image }} style={styles.plantImage} />
            <Text style={styles.plantName} numberOfLines={2}>
              {plant.name}
            </Text>
            <View style={styles.waterIndicator}>
              <View
                style={[styles.waterDot, { backgroundColor: colors.primary }]}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyCell}>
            <Plus size={20} color={colors.secondary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        backButton: {
          padding: 8,
          marginRight: 12,
        },
        headerTitle: {
          flex: 1,
          fontSize: 20,
          fontWeight: '600',
          color: colors.text,
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
          borderColor: colors.primary,
        },
        editButtonActive: {
          backgroundColor: colors.primary,
        },
        editButtonText: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.primary,
        },
        editButtonTextActive: {
          color: '#ffffff',
        },
        shelfInfo: {
          backgroundColor: colors.card,
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        },
        shelfDescription: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 4,
        },
        plantCount: {
          fontSize: 14,
          color: colors.secondary,
        },
        shelfGrid: {
          paddingHorizontal: 20,
          paddingBottom: 20,
        },
        plantCell: {
          borderRadius: 12,
          backgroundColor: colors.card,
          borderWidth: 2,
          borderColor: colors.border,
          borderStyle: 'dashed',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
          margin: 6,
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
          color: colors.text,
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
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        editModeHintText: {
          fontSize: 14,
          color: colors.primary,
          fontWeight: '500',
        },
      }),
    [colors]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{shelf.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.editButton, editMode && styles.editButtonActive]}
            onPress={() => setEditMode(!editMode)}
          >
            <Edit3 size={18} color={editMode ? '#ffffff' : colors.primary} />
            <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
              {editMode ? '完了' : '編集'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => {
          setData(data);
          const newPlants = Array.from({ length: shelf.rows }, (_, r) =>
            data
              .slice(r * shelf.columns, (r + 1) * shelf.columns)
              .map(cell => cell.plant),
          );
          setShelf({ ...shelf, plants: newPlants });
        }}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={shelf.columns}
        activationDistance={20}
        contentContainerStyle={styles.shelfGrid}
        scrollEnabled={false}
        ListHeaderComponent={
          <View style={styles.shelfInfo}>
            <Text style={styles.shelfDescription}>
              {shelf.rows}行 × {shelf.columns}列の棚
            </Text>
            <Text style={styles.plantCount}>
              {shelf.plants.flat().filter(p => p !== null).length} / {shelf.plants.flat().length} 株配置済み
            </Text>
          </View>
        }
      />

      {editMode && (
        <View style={styles.editModeHint}>
          <Grid3x3 size={16} color={colors.primary} />
          <Text style={styles.editModeHintText}>
            株を長押ししてドラッグで移動できます
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
