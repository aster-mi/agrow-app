import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { addStock } from '../../api';
import { useTheme } from '../../ThemeContext';

export default function AddStockScreen() {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('エラー', '株の名前を入力してください');
      return;
    }

    const result = await addStock({ name: name.trim(), isPublic });
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
          style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!name.trim()}
        >
          <Text
            style={[
              styles.addButtonText,
              !name.trim() && styles.addButtonTextDisabled,
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
  });
}

