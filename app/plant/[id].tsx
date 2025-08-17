import React, { useState, useMemo } from 'react';
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
import { ArrowLeft, CreditCard as Edit3, Share, Heart, MessageCircle, Calendar, Droplets, Tag, Eye, EyeOff, TreePine, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');

interface PlantImage {
  id: string;
  uri: string;
  capturedAt: string;
  memo?: string;
}

interface AgavePlant {
  id: string;
  name: string;
  description: string;
  tags: string[];
  visibility: 'public' | 'private';
  images: PlantImage[];
  parentId?: string;
  childrenIds: string[];
  metadata: {
    acquisitionDate: string;
    acquisitionSource: string;
    lastWatered: string;
    nextWateringDue: string;
  };
  stats: {
    likes: number;
    posts: number;
  };
  createdAt: string;
  updatedAt: string;
}

const mockPlant: AgavePlant = {
  id: '1',
  name: 'アガベ 白鯨',
  description: '2021年に実生から育てている白鯨です。葉の縁のギザギザが美しく、成長も順調です。温室で管理しており、冬場も元気に育っています。',
  tags: ['白鯨', 'チタノタ', '実生', '温室栽培'],
  visibility: 'public',
  images: [
    {
      id: '1',
      uri: 'https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2024-01-15',
      memo: '新葉が展開中',
    },
    {
      id: '2',
      uri: 'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2024-01-10',
    },
    {
      id: '3',
      uri: 'https://images.pexels.com/photos/6076976/pexels-photo-6076976.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2024-01-05',
      memo: '全体像',
    },
    {
      id: '4',
      uri: 'https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2023-12-20',
    },
    {
      id: '5',
      uri: 'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2023-12-15',
    },
    {
      id: '6',
      uri: 'https://images.pexels.com/photos/6076976/pexels-photo-6076976.jpeg?auto=compress&cs=tinysrgb&w=400',
      capturedAt: '2023-12-10',
    },
  ],
  parentId: undefined,
  childrenIds: ['2', '3'],
  metadata: {
    acquisitionDate: '2021-04-15',
    acquisitionSource: '実生',
    lastWatered: '2024-01-15',
    nextWateringDue: '2024-01-22',
  },
  stats: {
    likes: 48,
    posts: 12,
  },
  createdAt: '2021-04-15',
  updatedAt: '2024-01-15',
};

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, colorScheme } = useTheme();
  const [plant, setPlant] = useState(mockPlant);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const imageGridSize = (width - 52) / 3; // 3列グリッド

  const handleEdit = () => {
    Alert.alert('編集', '株情報編集画面に移動します');
  };

  const handleShare = () => {
    Alert.alert('共有', '株情報を共有します');
  };

  const handleLike = () => {
    setPlant(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        likes: prev.stats.likes + 1,
      }
    }));
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    // 実際の実装では画像ビューアーモーダルを開く
    Alert.alert('画像表示', `画像 ${index + 1} を表示`);
  };

  const renderImageGrid = () => (
    <View style={styles.imageGrid}>
      {plant.images.map((image, index) => (
        <TouchableOpacity
          key={image.id}
          style={[styles.imageGridItem, { width: imageGridSize, height: imageGridSize }]}
          onPress={() => openImageViewer(index)}
        >
          <Image source={{ uri: image.uri }} style={styles.gridImage} />
          {image.memo && (
            <View style={styles.imageMemoIndicator}>
              <MessageCircle size={12} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRelationships = () => {
    if (!plant.parentId && plant.childrenIds.length === 0) return null;

    return (
      <View style={styles.relationshipsSection}>
        <View style={styles.sectionHeader}>
          <TreePine size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>血統関係</Text>
        </View>
        
        {plant.parentId && (
          <TouchableOpacity style={styles.relationshipItem}>
            <Text style={styles.relationshipLabel}>親株:</Text>
            <Text style={styles.relationshipName}>アガベ 白鯨 (親)</Text>
          </TouchableOpacity>
        )}
        
        {plant.childrenIds.length > 0 && (
          <View>
            <Text style={styles.relationshipLabel}>子株 ({plant.childrenIds.length}株):</Text>
            {plant.childrenIds.map((childId, index) => (
              <TouchableOpacity key={childId} style={styles.relationshipItem}>
                <Text style={styles.relationshipName}>子株 #{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
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
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        backButton: {
          padding: 8,
        },
        headerActions: {
          flexDirection: 'row',
          gap: 8,
        },
        headerButton: {
          padding: 8,
        },
        content: {
          flex: 1,
        },
        mainImageContainer: {
          position: 'relative',
          height: 300,
        },
        mainImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        imageOverlay: {
          position: 'absolute',
          top: 16,
          right: 16,
        },
        visibilityBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          backgroundColor:
            colorScheme === 'dark'
              ? 'rgba(55, 65, 81, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
          borderRadius: 12,
        },
        visibilityText: {
          fontSize: 12,
          fontWeight: '600',
          color: colors.primary,
        },
        visibilityTextPrivate: {
          color: colors.secondary,
        },
        infoSection: {
          backgroundColor: colors.card,
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        titleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        },
        plantName: {
          fontSize: 24,
          fontWeight: '700',
          color: colors.text,
          flex: 1,
        },
        editButton: {
          padding: 8,
          borderRadius: 8,
          backgroundColor:
            colorScheme === 'dark' ? '#064e3b' : '#f0fdf4',
        },
        statsRow: {
          flexDirection: 'row',
          gap: 20,
          marginBottom: 16,
        },
        statItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        statText: {
          fontSize: 14,
          color: colors.secondary,
          fontWeight: '500',
        },
        description: {
          fontSize: 16,
          lineHeight: 24,
          color: colors.text,
          marginBottom: 16,
        },
        tagsContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        },
        tag: {
          backgroundColor:
            colorScheme === 'dark' ? '#064e3b' : '#dcfce7',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
        },
        tagText: {
          fontSize: 14,
          color: colors.primary,
          fontWeight: '500',
        },
        metadataSection: {
          backgroundColor: colors.card,
          padding: 20,
          marginTop: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
        },
        metadataGrid: {
          gap: 16,
        },
        metadataItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
        metadataLabel: {
          fontSize: 14,
          color: colors.secondary,
          marginBottom: 2,
        },
        metadataValue: {
          fontSize: 16,
          fontWeight: '500',
          color: colors.text,
        },
        relationshipsSection: {
          backgroundColor: colors.card,
          padding: 20,
          marginTop: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        relationshipItem: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          gap: 8,
        },
        relationshipLabel: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        },
        relationshipName: {
          fontSize: 14,
          color: colors.primary,
          fontWeight: '500',
        },
        photosSection: {
          backgroundColor: colors.card,
          padding: 20,
          marginTop: 8,
        },
        addPhotoText: {
          fontSize: 14,
          color: colors.primary,
          fontWeight: '600',
        },
        imageGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 2,
        },
        imageGridItem: {
          position: 'relative',
        },
        gridImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        imageMemoIndicator: {
          position: 'absolute',
          top: 4,
          right: 4,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }),
    [colors, colorScheme]
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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* メイン画像 */}
        <View style={styles.mainImageContainer}>
          <Image 
            source={{ uri: plant.images[selectedImageIndex]?.uri || plant.images[0]?.uri }} 
            style={styles.mainImage} 
          />
          <View style={styles.imageOverlay}>
            <View style={styles.visibilityBadge}>
              {plant.visibility === 'public' ? (
                <Eye size={14} color={colors.primary} />
              ) : (
                <EyeOff size={14} color={colors.secondary} />
              )}
              <Text style={[
                styles.visibilityText,
                plant.visibility === 'private' && styles.visibilityTextPrivate
              ]}>
                {plant.visibility === 'public' ? '公開' : '非公開'}
              </Text>
            </View>
          </View>
        </View>

        {/* 基本情報 */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit3 size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={handleLike}>
              <Heart size={16} color="#dc2626" />
              <Text style={styles.statText}>{plant.stats.likes}</Text>
            </TouchableOpacity>
            <View style={styles.statItem}>
              <MessageCircle size={16} color={colors.secondary} />
              <Text style={styles.statText}>{plant.stats.posts} 投稿</Text>
            </View>
          </View>

          <Text style={styles.description}>{plant.description}</Text>

          <View style={styles.tagsContainer}>
            {plant.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 管理情報 */}
        <View style={styles.metadataSection}>
          <Text style={styles.sectionTitle}>管理情報</Text>
          
          <View style={styles.metadataGrid}>
            <View style={styles.metadataItem}>
              <Calendar size={16} color={colors.secondary} />
              <View>
                <Text style={styles.metadataLabel}>取得日</Text>
                <Text style={styles.metadataValue}>{plant.metadata.acquisitionDate}</Text>
              </View>
            </View>
            
            <View style={styles.metadataItem}>
              <Tag size={16} color={colors.secondary} />
              <View>
                <Text style={styles.metadataLabel}>取得元</Text>
                <Text style={styles.metadataValue}>{plant.metadata.acquisitionSource}</Text>
              </View>
            </View>
            
            <View style={styles.metadataItem}>
              <Droplets size={16} color="#3b82f6" />
              <View>
                <Text style={styles.metadataLabel}>最終水やり</Text>
                <Text style={styles.metadataValue}>{plant.metadata.lastWatered}</Text>
              </View>
            </View>
            
            <View style={styles.metadataItem}>
              <Droplets size={16} color="#f59e0b" />
              <View>
                <Text style={styles.metadataLabel}>次回水やり</Text>
                <Text style={styles.metadataValue}>{plant.metadata.nextWateringDue}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 血統関係 */}
        {renderRelationships()}

        {/* 写真一覧 */}
        <View style={styles.photosSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>写真一覧 ({plant.images.length}枚)</Text>
            <TouchableOpacity>
              <Text style={styles.addPhotoText}>追加</Text>
            </TouchableOpacity>
          </View>
          {renderImageGrid()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
