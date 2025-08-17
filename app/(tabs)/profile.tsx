import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard as Edit3, Users, Heart, MessageCircle, Share, Calendar, Tag, Bell } from 'lucide-react-native';

interface UserStats {
  plants: number;
  posts: number;
  followers: number;
  following: number;
}

interface UserPost {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

const mockUser = {
  name: '田中 緑',
  username: '@tanaka_agave',
  bio: 'アガベ歴3年🌵 特に白鯨とチタノタが好きです。温室で50株ほど育てています。',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
  joinDate: '2021年4月',
  stats: {
    plants: 48,
    posts: 127,
    followers: 284,
    following: 156,
  } as UserStats,
};

const mockPosts: UserPost[] = [
  {
    id: '1',
    content: '白鯨の新葉が展開中！今年は特に調子が良いです 🌱',
    image: 'https://images.pexels.com/photos/6076533/pexels-photo-6076533.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 24,
    comments: 8,
    timestamp: '2時間前',
    tags: ['白鯨', 'チタノタ', '新葉'],
  },
  {
    id: '2',
    content: '今日は温室の模様替え。株の配置を変えて通風を良くしました。',
    likes: 15,
    comments: 3,
    timestamp: '1日前',
    tags: ['温室管理', '配置換え'],
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'plants' | 'likes'>('posts');
  const [user] = useState(mockUser);
  const [posts] = useState(mockPosts);

  const handleEditProfile = () => {
    Alert.alert('編集', 'プロフィール編集画面に移動します');
  };

  const handleFollow = () => {
    Alert.alert('フォロー', 'フォロー機能は開発中です');
  };

  const handleNotificationSettings = () => {
    Alert.alert('通知設定', '通知設定画面に移動します');
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statNumber}>{user.stats.plants}</Text>
        <Text style={styles.statLabel}>株</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statNumber}>{user.stats.posts}</Text>
        <Text style={styles.statLabel}>投稿</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statNumber}>{user.stats.followers}</Text>
        <Text style={styles.statLabel}>フォロワー</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.statItem}>
        <Text style={styles.statNumber}>{user.stats.following}</Text>
        <Text style={styles.statLabel}>フォロー中</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <View style={styles.tabContent}>
            {posts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <Text style={styles.postContent}>{post.content}</Text>
                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                )}
                <View style={styles.postTags}>
                  {post.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.postActions}>
                  <View style={styles.actionItem}>
                    <Heart size={16} color="#6b7280" />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </View>
                  <View style={styles.actionItem}>
                    <MessageCircle size={16} color="#6b7280" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </View>
                  <Text style={styles.postTime}>{post.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'plants':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>株一覧は開発中です</Text>
          </View>
        );
      case 'likes':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>いいねした投稿は開発中です</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>プロフィール</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleNotificationSettings}
          >
            <Bell size={20} color="#16a34a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
            
            <View style={styles.joinInfo}>
              <Calendar size={14} color="#6b7280" />
              <Text style={styles.joinDate}>参加日: {user.joinDate}</Text>
            </View>
            
            <Text style={styles.bio}>{user.bio}</Text>
          </View>

          <View style={styles.profileActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Edit3 size={16} color="#16a34a" />
              <Text style={styles.editButtonText}>編集</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={() => Alert.alert('共有', 'プロフィールを共有')}
            >
              <Share size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {renderStats()}

        <View style={styles.tabContainer}>
          <View style={styles.tabBar}>
            {[
              { key: 'posts', label: '投稿', icon: MessageCircle },
              { key: 'plants', label: '株', icon: Tag },
              { key: 'likes', label: 'いいね', icon: Heart },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab.key as any)}
                >
                  <IconComponent 
                    size={18} 
                    color={activeTab === tab.key ? '#16a34a' : '#6b7280'} 
                  />
                  <Text 
                    style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {renderTabContent()}
        </View>
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
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#dcfce7',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  joinDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'center',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
  shareButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 8,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabContainer: {
    flex: 1,
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 16,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#16a34a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#16a34a',
  },
  tabContent: {
    backgroundColor: '#ffffff',
    minHeight: 200,
  },
  postCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
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
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  postTime: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 'auto',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 40,
  },
});