import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, X, Hash } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { addStock } from '../../api';
import { useTheme } from '../../ThemeContext';

const { width } = Dimensions.get('window');

interface StockImage {
  id: string;
  uri: string;
}

export default function AddStockScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState<StockImage[]>([]);
  const [tags, setTags] = useState('');
  const styles = useMemo(() => createStyles(colors), [colors]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: StockImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage: StockImage = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
      };
      setImages([...images, newImage]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const renderImageGrid = () => {
    if (images.length === 0) return null;

    const imageSize = images.length === 1 ? width - 40 : (width - 52) / 2;

    return (
      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <View
            key={image.id}
            style={[
              styles.imageContainer,
              {
                width: imageSize,
                height: imageSize * 0.75,
                marginBottom: images.length > 2 && index < 2 ? 6 : 0,
                marginRight: images.length > 1 && index % 2 === 0 ? 6 : 0,
              },
            ]}
          >
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

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('エラー', '株の名前を入力してください');
      return;
    }
    if (images.length === 0) {
      Alert.alert('エラー', '株の画像を追加してください');
      return;
    }
    const tagList = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const result = await addStock({
      name: name.trim(),
      isPublic,
      tags: tagList,
      images: images.map(img => img.uri),
    });
    Alert.alert(
      result ? '成功' : 'オフライン',
      result
        ? '株を追加しました'
        : 'ネットワークがオフラインのため、株の追加をキューに入れました',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>株を追加</Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            (!name.trim() || images.length === 0) && styles.addButtonDisabled,
          ]}
          onPress={handleAdd}
          disabled={!name.trim() || images.length === 0}
        >
          <Text
            style={[
              styles.addButtonText,
              (!name.trim() || images.length === 0) &&
                styles.addButtonTextDisabled,
            ]}
          >
            追加
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="株の名前"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.secondary}
        />

        <View style={styles.imageButtons}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <ImageIcon size={20} color={colors.text} />
            <Text style={styles.imageButtonText}>ギャラリー</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
            <Camera size={20} color={colors.text} />
            <Text style={styles.imageButtonText}>カメラ</Text>
          </TouchableOpacity>
        </View>

        {renderImageGrid()}

        <View style={styles.tagInputContainer}>
          <Hash size={16} color={colors.secondary} />
          <TextInput
            style={styles.tagInput}
            placeholder="タグ (カンマ区切り)"
            value={tags}
            onChangeText={setTags}
            placeholderTextColor={colors.secondary}
          />
        </View>

        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setIsPublic(!isPublic)}
        >
          <View style={[styles.toggleDot, isPublic && styles.toggleDotActive]} />
          <Text style={styles.visibilityText}>
            {isPublic ? '公開' : '非公開'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
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
    addButton: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.primary,
    },
    addButtonDisabled: {
      backgroundColor: colors.border,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    addButtonTextDisabled: {
      color: colors.secondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.card,
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
      backgroundColor: colors.border,
    },
    toggleDotActive: {
      backgroundColor: colors.primary,
    },
    visibilityText: {
      fontSize: 16,
      color: colors.text,
    },
    imageButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    imageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    imageButtonText: {
      color: colors.text,
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    imageContainer: {
      position: 'relative',
    },
    selectedImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    removeImageButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 10,
      padding: 2,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginTop: 20,
      backgroundColor: colors.card,
    },
    tagInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 6,
    },
  });
}
