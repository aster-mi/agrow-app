import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

export type Reminder = {
  id?: number;
  title: string;
  scheduledAt: string; // ISO string
  synced?: number; // 0 unsynced, 1 synced
};

/** ===== DB (singleton, async) ===== */
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('reminders.db');
  return dbPromise;
}

/** ===== Init ===== */
async function init() {
  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      scheduledAt TEXT,
      synced INTEGER
    );
  `);
}

/** ===== Notifications ===== */
async function ensureNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

async function scheduleNotification(reminder: Reminder) {
  await ensureNotificationPermissions();
  await Notifications.scheduleNotificationAsync({
    content: { title: reminder.title, body: '水やりの時間です' },
    // DATE 指定はこれが最もシンプルで型も安全
    trigger: new Date(reminder.scheduledAt),
  });
}

/** ===== Public APIs ===== */
export async function schedulePendingNotifications() {
  await init();
  const db = await getDb();
  const rows = await db.getAllAsync<Reminder>('SELECT * FROM reminders;');
  for (const rem of rows) {
    await scheduleNotification(rem);
  }
}

export async function addReminder(title: string, date: Date) {
  await init();
  const db = await getDb();
  const res = await db.runAsync(
    'INSERT INTO reminders (title, scheduledAt, synced) VALUES (?, ?, 0);',
    [title, date.toISOString()]
  );

  await scheduleNotification({
    id: res.lastInsertRowId,
    title,
    scheduledAt: date.toISOString(),
    synced: 0,
  });

  await syncReminders();
}

export async function syncReminders() {
  await init();
  const state = await Network.getNetworkStateAsync();
  if (!state.isConnected) return;

  const db = await getDb();
  const unsynced = await db.getAllAsync<Reminder>(
    'SELECT * FROM reminders WHERE synced = 0;'
  );
  if (unsynced.length === 0) return;

  try {
    await fetch('https://example.com/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unsynced),
    });
    await db.runAsync('UPDATE reminders SET synced = 1 WHERE synced = 0;');
  } catch {
    // keep unsynced for later retry
  }
}
