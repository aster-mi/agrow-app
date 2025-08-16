import * as SQLite from 'expo-sqlite';

/** ===== Timeline Types ===== */
export type Post = {
  id: number;
  text: string;
  images: string[];
};

/** ===== DB (Singleton) ===== */
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('agrow.db');
  }
  return dbPromise;
}

/** ===== Init (creates ALL tables) ===== */
export async function initDb() {
  const db = await getDb();

  // まとめて実行可能（複数ステートメントOK）
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS shelves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      grid INTEGER,
      position INTEGER
    );

    CREATE TABLE IF NOT EXISTS shelf_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shelf_id INTEGER,
      position INTEGER,
      plant TEXT,
      FOREIGN KEY (shelf_id) REFERENCES shelves(id)
    );

    CREATE TABLE IF NOT EXISTS timeline_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      images TEXT
    );

    CREATE TABLE IF NOT EXISTS timeline_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT
    );
  `);
}

/** Alias to keep backward compatibility with codex branch name */
export const initDB = initDb;

/** ===== Shelves APIs (main) ===== */
export async function getShelves(callback: (rows: any[]) => void) {
  const db = await getDb();
  const rows = await db.getAllAsync<any>('SELECT * FROM shelves ORDER BY position ASC;');
  callback(rows);
}

export async function saveShelfOrder(shelves: any[]) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < shelves.length; i++) {
      await db.runAsync('UPDATE shelves SET position = ? WHERE id = ?', [i, shelves[i].id]);
    }
  });
}

export async function getSlots(shelfId: number, callback: (rows: any[]) => void) {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM shelf_slots WHERE shelf_id = ? ORDER BY position ASC;',
    [shelfId]
  );
  callback(rows);
}

export async function saveSlotOrder(_shelfId: number, slots: any[]) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < slots.length; i++) {
      await db.runAsync('UPDATE shelf_slots SET position = ? WHERE id = ?', [i, slots[i].id]);
    }
  });
}

/** ===== Timeline APIs (codex) ===== */
export async function fetchPosts(
  offset: number,
  limit: number,
  callback: (posts: Post[]) => void
) {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM timeline_posts ORDER BY id DESC LIMIT ? OFFSET ?;',
    [limit, offset]
  );
  const data: Post[] = rows.map((row) => ({
    id: row.id,
    text: row.text,
    images: row.images ? JSON.parse(row.images) : [],
  }));
  callback(data);
}

export async function addPost(text: string, images: string[], callback?: () => void) {
  const db = await getDb();
  await db.runAsync('INSERT INTO timeline_posts (text, images) VALUES (?, ?);', [
    text,
    JSON.stringify(images),
  ]);
  callback && callback();
}

export async function updatePost(
  id: number,
  text: string,
  images: string[],
  callback?: () => void
) {
  const db = await getDb();
  await db.runAsync('UPDATE timeline_posts SET text = ?, images = ? WHERE id = ?;', [
    text,
    JSON.stringify(images),
    id,
  ]);
  callback && callback();
}

export async function deletePost(id: number, callback?: () => void) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM timeline_posts WHERE id = ?;', [id]);
    await db.runAsync('DELETE FROM timeline_reactions WHERE post_id = ?;', [id]);
  });
  callback && callback();
}

export async function addReaction(
  postId: number,
  type: string,
  content?: string,
  callback?: () => void
) {
  const db = await getDb();
  await db.runAsync('INSERT INTO timeline_reactions (post_id, type, content) VALUES (?, ?, ?);', [
    postId,
    type,
    content ?? null,
  ]);
  callback && callback();
}

export async function getReactionCount(
  postId: number,
  type: string,
  callback: (count: number) => void
) {
  const db = await getDb();
  // 1行取得に便利な getFirstAsync
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM timeline_reactions WHERE post_id = ? AND type = ?;',
    [postId, type]
  );
  callback(row?.count ?? 0);
}

export async function getReactionCounts(
  postId: number,
  callback: (counts: { like: number; comment: number; repost: number }) => void
) {
  const db = await getDb();
  const rows = await db.getAllAsync<{ type: string; count: number }>(
    'SELECT type, COUNT(*) as count FROM timeline_reactions WHERE post_id = ? GROUP BY type;',
    [postId]
  );
  const acc: Record<string, number> = { like: 0, comment: 0, repost: 0 };
  for (const r of rows) acc[r.type] = r.count;
  callback({ like: acc.like || 0, comment: acc.comment || 0, repost: acc.repost || 0 });
}

/** default export: DB getter（直接操作したい場合に await getDb() を使う） */
export default getDb;
