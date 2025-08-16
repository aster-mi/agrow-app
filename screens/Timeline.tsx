import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Button, Alert, Share } from 'react-native';
import { initDB, fetchPosts, getReactionCounts, addReaction, deletePost, updatePost, Post } from '../db';
import { generateOGPMeta } from '../utils/ogp';

type PostWithCounts = Post & { like: number; comment: number; repost: number };

export default function Timeline() {
  const [posts, setPosts] = useState<PostWithCounts[]>([]);

  useEffect(() => {
    initDB();
    loadMore();
  }, []);

  const enrich = (items: Post[]): Promise<PostWithCounts[]> => {
    return Promise.all(
      items.map(
        p =>
          new Promise<PostWithCounts>(resolve =>
            getReactionCounts(p.id, counts => resolve({ ...p, ...counts }))
          )
      )
    );
  };

  const loadMore = () => {
    fetchPosts(posts.length, 10, fetched => {
      enrich(fetched).then(enriched => {
        setPosts(prev => [...prev, ...enriched]);
      });
    });
  };

  const refresh = () => {
    fetchPosts(0, posts.length, fetched => {
      enrich(fetched).then(enriched => {
        setPosts(enriched);
      });
    });
  };

  const handleLike = (id: number) => {
    addReaction(id, 'like', undefined, refresh);
  };

  const handleComment = (id: number) => {
    Alert.prompt('Comment', '', text => addReaction(id, 'comment', text, refresh));
  };

  const handleRepost = (id: number) => {
    addReaction(id, 'repost', undefined, refresh);
  };

  const handleEdit = (post: PostWithCounts) => {
    Alert.prompt(
      'Edit Post',
      '',
      text => updatePost(post.id, text ?? post.text, post.images, refresh),
      'plain-text',
      post.text
    );
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Post', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePost(id, refresh) },
    ]);
  };

  const handleShare = (post: PostWithCounts) => {
    const ogp = generateOGPMeta(post);
    Share.share({ message: `${post.text}\n\n${ogp}` });
  };

  const renderPost = ({ item }: { item: PostWithCounts }) => (
    <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text>{item.text}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {item.images.slice(0, 4).map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={{ width: 80, height: 80, marginRight: 4, marginTop: 4 }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
        <Button title={`Like (${item.like})`} onPress={() => handleLike(item.id)} />
        <Button title={`Comment (${item.comment})`} onPress={() => handleComment(item.id)} />
        <Button title={`Repost (${item.repost})`} onPress={() => handleRepost(item.id)} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button title="Delete" onPress={() => handleDelete(item.id)} />
        <Button title="Share" onPress={() => handleShare(item)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id.toString()}
      renderItem={renderPost}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
