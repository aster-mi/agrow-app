import * as SQLite from 'expo-sqlite';

/** ===== Timeline Types ===== */
export type Post = {
  id: number;
  text: string;
  images: string[];
};

/** ===== Single DB Instance ===== */
const db = SQLite.openDatabase('agrow.db');

/** ===== Init (creates ALL tables) ===== */
export function initDb() {
  db.transaction(tx => {
    // (optional) enable FK constraints (safe even if not supported)
    tx.executeSql('PRAGMA foreign_keys = ON;');

    // --- shelves / slots (main) ---
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS shelves (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, grid INTEGER, position INTEGER);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS shelf_slots (id INTEGER PRIMARY KEY AUTOINCREMENT, shelf_id INTEGER, position INTEGER, plant TEXT, FOREIGN KEY (shelf_id) REFERENCES shelves(id));'
    );

    // --- timeline (codex) ---
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
}

/** Alias to keep backward compatibility with codex branch name */
export const initDB = initDb;

/** ===== Shelves APIs (main) ===== */
export function getShelves(callback: (rows: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM shelves ORDER BY position ASC;', [], (_t, { rows }) => {
      callback(rows._array);
    });
  });
}

export function saveShelfOrder(shelves: any[]) {
  db.transaction(tx => {
    shelves.forEach((shelf, index) => {
      tx.executeSql('UPDATE shelves SET position = ? WHERE id = ?', [index, shelf.id]);
    });
  });
}

export function getSlots(shelfId: number, callback: (rows: any[]) => void) {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM shelf_slots WHERE shelf_id = ? ORDER BY position ASC;',
      [shelfId],
      (_t, { rows }) => callback(rows._array)
    );
  });
}

export function saveSlotOrder(shelfId: number, slots: any[]) {
  db.transaction(tx => {
    slots.forEach((slot, index) => {
      tx.executeSql('UPDATE shelf_slots SET position = ? WHERE id = ?', [index, slot.id]);
    });
  });
}

/** ===== Timeline APIs (codex) ===== */
export const fetchPosts = (offset: number, limit: number, callback: (posts: Post[]) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM timeline_posts ORDER BY id DESC LIMIT ? OFFSET ?;',
      [limit, offset],
      (_t, { rows }) => {
        const data: Post[] = rows._array.map((row: any) => ({
          id: row.id,
          text: row.text,
          images: row.images ? JSON.parse(row.images) : [],
        }));
        callback(data);
      }
    );
  });
};

export const addPost = (text: string, images: string[], callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO timeline_posts (text, images) VALUES (?, ?);',
      [text, JSON.stringify(images)],
      () => callback && callback()
    );
  });
};

export const updatePost = (id: number, text: string, images: string[], callback?: () => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE timeline_posts SET text = ?, images = ? WHERE id = ?;',
      [text, JSON.stringify(images), id],
      () => callback && callback()
    );
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
    tx.executeSql(
      'INSERT INTO timeline_reactions (post_id, type, content) VALUES (?, ?, ?);',
      [postId, type, content || null],
      () => callback && callback()
    );
  });
};

export const getReactionCount = (postId: number, type: string, callback: (count: number) => void) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) as count FROM timeline_reactions WHERE post_id = ? AND type = ?;',
      [postId, type],
      (_t, { rows }) => callback(rows._array[0].count)
    );
  });
};

export const getReactionCounts = (
  postId: number,
  callback: (counts: { like: number; comment: number; repost: number }) => void
) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT type, COUNT(*) as count FROM timeline_reactions WHERE post_id = ? GROUP BY type;',
      [postId],
      (_t, { rows }) => {
        const counts: Record<string, number> = { like: 0, comment: 0, repost: 0 };
        rows._array.forEach((row: any) => {
          counts[row.type] = row.count;
        });
        callback({ like: counts.like || 0, comment: counts.comment || 0, repost: counts.repost || 0 });
      }
    );
  });
};

/** default export for direct DB access if ever needed */
export default db;
