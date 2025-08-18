import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Repeat2, Share, Search, Plus } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { fetchPosts, Post as DbPost } from '../../db';
import { useTheme, ThemeColors } from '../../ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getPosts } from '../../services/supabaseService';

interface TimelinePost {
  id: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
  isLiked: boolean;
  agave?: {
    name: string;
    tags: string[];
  };
}

const mockPosts: TimelinePost[] = [
  {
    id: '1',
    user: {
      name: '田中 緑',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      username: '@tanaka_agave',
    },
    content: '白鯨が今年も美しく成長中！葉の縁のギザギザが特に際立ってきました🌵 #アガベ白鯨 #多肉植物',
    images: ['https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=600'],
    timestamp: '2時間前',
    likes: 24,
    comments: 8,
    reposts: 3,
    isLiked: false,
    agave: {
      name: 'アガベ 白鯨',
      tags: ['白鯨', 'チタノタ', '室内栽培'],
    },
  },
  {
    id: '2',
    user: {
      name: '佐藤 花',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100',
      username: '@hana_succulent',
    },
    content: '今日は久しぶりの晴れ☀️ アガベたちを外に出して日光浴させました。やっぱり自然光は違いますね！',
    images: [
      'https://images.pexels.com/photos/4503821/pexels-photo-4503821.jpeg?auto=compress&cs=tinysrgb&w=300',
      'https://images.pexels.com/photos/6076976/pexels-photo-6076976.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    timestamp: '5時間前',
    likes: 42,
    comments: 15,
    reposts: 7,
    isLiked: true,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const loadPosts = () => {
    fetchPosts(0, 50, (dbPosts: DbPost[]) => {
      const mapped: TimelinePost[] = dbPosts.map((p) => ({
        id: `db-${p.id}`,
        user: {
          name: 'あなた',
          avatar: 'https://i.pravatar.cc/100?img=1',
          username: '@you',
        },
        content: p.text,
        images: p.images,
        timestamp: 'たった今',
        likes: 0,
        comments: 0,
        reposts: 0,
        isLiked: false,
      }));
      setPosts([...mapped, ...mockPosts]);
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreatePost = () => {
    router.push('/post');
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const renderPost = (post: TimelinePost) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.userHandle}>{post.user.username} • {post.timestamp}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.agave && (
        <View style={styles.agaveTag}>
          <Text style={styles.agaveTagText}>🌵 {post.agave.name}</Text>
          <View style={styles.tags}>
            {post.agave.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {post.images.length > 0 && (
        <View style={styles.imageContainer}>
          {post.images.length === 1 ? (
            <Image source={{ uri: post.images[0] }} style={styles.singleImage} />
          ) : (
            <View style={styles.multiImageGrid}>
              {post.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.gridImage} />
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleLike(post.id)}
        >
          <Heart
            size={20}
            color={post.isLiked ? '#dc2626' : colors.secondary}
            fill={post.isLiked ? '#dc2626' : 'transparent'}
          />
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color={colors.secondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Repeat2 size={20} color={colors.secondary} />
          <Text style={styles.actionText}>{post.reposts}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share size={20} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>タイムライン</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addPostButton} onPress={handleCreatePost}>
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.timeline}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map(renderPost)}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    searchButton: {
      padding: 8,
    },
    addPostButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    timeline: {
      flex: 1,
    },
    postCard: {
      backgroundColor: colors.card,
      marginVertical: 4,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    userAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    userHandle: {
      fontSize: 14,
      color: colors.secondary,
    },
    postContent: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 12,
    },
    agaveTag: {
      backgroundColor: '#f0fdf4',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    agaveTagText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#15803d',
      marginBottom: 8,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    tag: {
      backgroundColor: '#dcfce7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: '#15803d',
      fontWeight: '500',
    },
    imageContainer: {
      marginBottom: 12,
    },
    singleImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    multiImageGrid: {
      flexDirection: 'row',
      gap: 4,
    },
    gridImage: {
      flex: 1,
      height: 120,
      borderRadius: 8,
      resizeMode: 'cover',
    },
    postActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    actionText: {
      fontSize: 14,
      color: colors.secondary,
      fontWeight: '500',
    },
    likedText: {
      color: '#dc2626',
    },
  });