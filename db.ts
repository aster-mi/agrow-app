import * as SQLite from 'expo-sqlite';

export type Post = {
  id: number;
  text: string;
  images: string[];
};

const db = SQLite.openDatabase('agrow.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS timeline_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        images TEXT
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS timeline_reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        content TEXT
      );`
    );
  });
};

export const fetchPosts = (offset: number, limit: number, callback: (posts: Post[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM timeline_posts ORDER BY id DESC LIMIT ? OFFSET ?;',
      [limit, offset],
      (_, { rows }) => {
        const data = rows._array.map((row: any) => ({
          id: row.id,
          text: row.text,
          images: row.images ? JSON.parse(row.images) : []
        }));
        callback(data);
      }
    );
  });
};

export const addPost = (text: string, images: string[], callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO timeline_posts (text, images) VALUES (?, ?);', [text, JSON.stringify(images)], () => callback && callback());
  });
};

export const updatePost = (id: number, text: string, images: string[], callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql('UPDATE timeline_posts SET text = ?, images = ? WHERE id = ?;', [text, JSON.stringify(images), id], () => callback && callback());
  });
};

export const deletePost = (id: number, callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql('DELETE FROM timeline_posts WHERE id = ?;', [id]);
    tx.executeSql('DELETE FROM timeline_reactions WHERE post_id = ?;', [id], () => callback && callback());
  });
};

export const addReaction = (postId: number, type: string, content?: string, callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql('INSERT INTO timeline_reactions (post_id, type, content) VALUES (?, ?, ?);', [postId, type, content || null], () => callback && callback());
  });
};

export const getReactionCount = (postId: number, type: string, callback: (count: number) => void) => {
  db.transaction(tx => {
    tx.executeSql('SELECT COUNT(*) as count FROM timeline_reactions WHERE post_id = ? AND type = ?;', [postId, type], (_, { rows }) => callback(rows._array[0].count));
  });
};

export const getReactionCounts = (postId: number, callback: (counts: { like: number; comment: number; repost: number }) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT type, COUNT(*) as count FROM timeline_reactions WHERE post_id = ? GROUP BY type;',
      [postId],
      (_, { rows }) => {
        const counts: any = { like: 0, comment: 0, repost: 0 };
        rows._array.forEach((row: any) => {
          counts[row.type] = row.count;
        });
        callback(counts);
      }
    );
  });
};
