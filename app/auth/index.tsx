import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Supabase Google認証の実装
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('成功', 'Googleアカウントでログインしました', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('エラー', 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleXAuth = async () => {
    setIsLoading(true);
    try {
      // Supabase X認証の実装
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('成功', 'Xアカウントでログインしました', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('エラー', 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=200&h=200' }}
            style={styles.logo} 
          />
          <Text style={styles.title}>Agrow</Text>
          <Text style={styles.subtitle}>アガベと共に成長する</Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            あなたのアガベライフを記録し、{'\n'}
            同じ趣味を持つ仲間と繋がりましょう
          </Text>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌱</Text>
              <Text style={styles.featureText}>成長記録の管理</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📱</Text>
              <Text style={styles.featureText}>NFC連携</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🌐</Text>
              <Text style={styles.featureText}>コミュニティ</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🏠</Text>
              <Text style={styles.featureText}>棚管理</Text>
            </View>
          </View>
        </View>

        <View style={styles.authButtons}>
          <TouchableOpacity 
            style={[styles.authButton, styles.googleButton]}
            onPress={handleGoogleAuth}
            disabled={isLoading}
          >
            <Image 
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={styles.authIcon}
            />
            <Text style={styles.authButtonText}>Googleで続ける</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.authButton, styles.xButton]}
            onPress={handleXAuth}
            disabled={isLoading}
          >
            <Text style={styles.xIcon}>𝕏</Text>
            <Text style={[styles.authButtonText, styles.xButtonText]}>Xで続ける</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.terms}>
          <Text style={styles.termsText}>
            続行することで、
            <Text style={styles.termsLink}>利用規約</Text>と
            <Text style={styles.termsLink}>プライバシーポリシー</Text>
            に同意したものとみなされます
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '500',
  },
  description: {
    alignItems: 'center',
    marginBottom: 48,
  },
  descriptionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  feature: {
    alignItems: 'center',
    width: 80,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  authButtons: {
    gap: 16,
    marginBottom: 32,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  xButton: {
    backgroundColor: '#000000',
  },
  authIcon: {
    width: 20,
    height: 20,
  },
  xIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  xButtonText: {
    color: '#ffffff',
  },
  terms: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#16a34a',
    fontWeight: '500',
  },
});