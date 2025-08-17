import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Search, X, Hash, Filter } from 'lucide-react-native';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SearchModal({ visible, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('all');

  const popularTags = [
    '白鯨', 'チタノタ', '雷神', '笹の雪', 'フェロックス', 
    '室内栽培', '温室', '実生', '輸入株', 'LED栽培'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = () => {
    console.log('Search:', { query, selectedTags, filter });
    onClose();
  };

  const clearAll = () => {
    setQuery('');
    setSelectedTags([]);
    setFilter('all');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>検索</Text>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.clearButton}>クリア</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>キーワード</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="株名、棚名などで検索"
                value={query}
                onChangeText={setQuery}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>絞り込み</Text>
            <View style={styles.filterOptions}>
              {[
                { key: 'all', label: 'すべて' },
                { key: 'my', label: '自分の株' },
                { key: 'public', label: '公開株のみ' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterOption,
                    filter === option.key && styles.filterOptionActive
                  ]}
                  onPress={() => setFilter(option.key as any)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filter === option.key && styles.filterOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.tagsSection}>
            <View style={styles.sectionHeader}>
              <Hash size={18} color="#16a34a" />
              <Text style={styles.sectionTitle}>タグ</Text>
            </View>
            
            {selectedTags.length > 0 && (
              <View style={styles.selectedTags}>
                <Text style={styles.selectedTagsLabel}>選択中:</Text>
                <View style={styles.tagList}>
                  {selectedTags.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={styles.selectedTag}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text style={styles.selectedTagText}>#{tag}</Text>
                      <X size={14} color="#15803d" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.popularTagsLabel}>人気のタグ:</Text>
            <View style={styles.tagList}>
              {popularTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected
                  ]}>
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
          >
            <Search size={20} color="#ffffff" />
            <Text style={styles.searchButtonText}>検索する</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterSection: {
    marginBottom: 32,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterOptionActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#ffffff',
  },
  tagsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  selectedTags: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  selectedTagsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 8,
  },
  popularTagsLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  tagText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#15803d',
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
  },
  selectedTagText: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#16a34a',
    borderRadius: 12,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});