import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Button,
  Switch,
} from 'react-native';
import { fetchTagSuggestions, searchStocks, Stock } from '../api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [order, setOrder] = useState<'updated' | 'name'>('updated');
  const [mineOnly, setMineOnly] = useState(false);
  const [results, setResults] = useState<Stock[]>([]);

  useEffect(() => {
    let active = true;
    if (tagInput.length === 0) {
      setTagSuggestions([]);
      return;
    }
    fetchTagSuggestions(tagInput)
      .then((s) => {
        if (active) setTagSuggestions(s);
      })
      .catch(() => {
        if (active) setTagSuggestions([]);
      });
    return () => {
      active = false;
    };
  }, [tagInput]);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
    setTagSuggestions([]);
  };

  const performSearch = async () => {
    try {
      const res = await searchStocks({
        query,
        tags,
        order,
        mineOnly,
      });
      setResults(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Tags</Text>
      <TextInput
        placeholder="Add tag"
        value={tagInput}
        onChangeText={setTagInput}
        style={{ borderWidth: 1, marginBottom: 4, padding: 4 }}
      />
      {tagSuggestions.length > 0 && (
        <FlatList
          data={tagSuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addTag(item)}>
              <Text style={{ padding: 4 }}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {tags.map((t) => (
          <Text key={t} style={{ marginRight: 8 }}>
            #{t}
          </Text>
        ))}
      </View>
      <Text>Stock or Shelf</Text>
      <TextInput
        placeholder="Search by name"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, marginBottom: 8, padding: 4 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text>My stocks only</Text>
        <Switch value={mineOnly} onValueChange={setMineOnly} />
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Button
          title={order === 'updated' ? 'Sort: Updated' : 'Sort: Name'}
          onPress={() => setOrder(order === 'updated' ? 'name' : 'updated')}
        />
      </View>
      <Button title="Search" onPress={performSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8 }}>
            <Text>{item.name}</Text>
            {item.shelf && <Text style={{ color: '#666' }}>{item.shelf}</Text>}
          </View>
        )}
      />
    </View>
  );
}
