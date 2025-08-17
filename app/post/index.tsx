import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Camera, Image as ImageIcon, X, Hash, MapPin, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { addPost } from '../../db';

const { width } = Dimensions.get('window');

interface PostImage {
  id: string;
  uri: string;
}

export default function PostScreen() {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<PostImage[]>([]);
  const [tags, setTags] = useState('');
  const [selectedAgave, setSelectedAgave] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('制限', '最大4枚まで選択できます');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: PostImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 4) {
      Alert.alert('制限', '最大4枚まで選択できます');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: PostImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handlePost = () => {
    if (!content.trim() && images.length === 0) {
      Alert.alert('エラー', '投稿内容または画像を追加してください');
      return;
    }

    Alert.alert(
      '投稿確認',
      `この内容で投稿しますか？\n\n公開設定: ${isPublic ? '公開' : '非公開'}`,
      [
        { text: 'キャンセル' },
        {
          text: '投稿',
          onPress: async () => {
            await addPost(content, images.map((img) => img.uri));
            setContent('');
            setImages([]);
            setTags('');
            setSelectedAgave(null);
            Alert.alert('成功', '投稿が完了しました！', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        },
      ]
    );
  };

  const selectAgave = () => {
    Alert.alert(
      'アガベを選択',
      '投稿に紐付けるアガベを選択してください',
      [
        { text: 'キャンセル' },
        { text: 'アガベ 白鯨', onPress: () => setSelectedAgave('アガベ 白鯨') },
        { text: 'アガベ 雷神', onPress: () => setSelectedAgave('アガベ 雷神') },
        { text: '選択しない', onPress: () => setSelectedAgave(null) },
      ]
    );
  };

  const renderImageGrid = () => {
    if (images.length === 0) return null;

    const imageSize = images.length === 1 
      ? width - 40 
      : (width - 52) / 2;

    return (
      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View key={image.id} style={[
            styles.imageContainer,
            { 
              width: imageSize, 
              height: imageSize * 0.75,
              marginBottom: images.length > 2 && index < 2 ? 6 : 0,
              marginRight: images.length > 1 && index % 2 === 0 ? 6 : 0,
            }
          ]}>
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
            <TouchableOpacity 
              style={styles.removeImageButton}
              onPress={() => removeImage(image.id)}
            >
              <X size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>新規投稿</Text>
        <TouchableOpacity 
          style={[styles.postButton, (!content.trim() && images.length === 0) && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={!content.trim() && images.length === 0}
        >
          <Text style={[styles.postButtonText, (!content.trim() && images.length === 0) && styles.postButtonTextDisabled]}>
            投稿
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.contentInput}
          placeholder="今日のアガベはどうですか？"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={280}
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.characterCount}>
          {content.length} / 280
        </Text>

        {renderImageGrid()}

        {selectedAgave && (
          <View style={styles.selectedAgave}>
            <Text style={styles.selectedAgaveLabel}>紐付けアガベ:</Text>
            <View style={styles.agaveTag}>
              <Text style={styles.agaveTagText}>🌵 {selectedAgave}</Text>
              <TouchableOpacity onPress={() => setSelectedAgave(null)}>
                <X size={16} color="#15803d" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.tagsSection}>
          <Text style={styles.sectionLabel}>タグ</Text>
          <TextInput
            style={styles.tagsInput}
            placeholder="タグをスペース区切りで入力 (例: 白鯨 チタノタ 室内栽培)"
            value={tags}
            onChangeText={setTags}
            placeholderTextColor="#9ca3af"
          />
          {tags.length > 0 && (
            <View style={styles.tagPreview}>
              {tags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                <View key={index} style={styles.previewTag}>
                  <Text style={styles.previewTagText}>#{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.postOptions}>
          <TouchableOpacity style={styles.optionButton} onPress={selectAgave}>
            <MapPin size={20} color="#16a34a" />
            <Text style={styles.optionButtonText}>
              {selectedAgave ? 'アガベを変更' : 'アガベを選択'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.visibilityToggle}
            onPress={() => setIsPublic(!isPublic)}
          >
            <View style={[styles.toggleDot, isPublic && styles.toggleDotActive]} />
            <Text style={styles.visibilityText}>
              {isPublic ? '公開投稿' : '非公開投稿'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton} onPress={takePhoto}>
          <Camera size={24} color="#16a34a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={pickImage}>
          <ImageIcon size={24} color="#16a34a" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton} onPress={() => setTags(tags + '#')}>
          <Hash size={24} color="#16a34a" />
        </TouchableOpacity>
        <Text style={styles.imageCount}>{images.length}/4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  postButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  postButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  postButtonTextDisabled: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentInput: {
    fontSize: 18,
    lineHeight: 28,
    color: '#374151',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAgave: {
    marginBottom: 20,
  },
  selectedAgaveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  agaveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  agaveTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
  },
  tagsSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tagsInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#374151',
  },
  tagPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  previewTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  previewTagText: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '500',
  },
  postOptions: {
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
  },
  optionButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d1d5db',
  },
  toggleDotActive: {
    backgroundColor: '#16a34a',
  },
  visibilityText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 20,
  },
  toolButton: {
    padding: 8,
  },
  imageCount: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});