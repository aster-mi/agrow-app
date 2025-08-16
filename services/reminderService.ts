import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import * as Network from 'expo-network';

export type Reminder = {
  id?: number;
  title: string;
  scheduledAt: string; // ISO string
  synced?: number; // 0 unsynced, 1 synced
};

const db = SQLite.openDatabase('reminders.db');

function init() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, scheduledAt TEXT, synced INTEGER);'
    );
  });
}

async function scheduleNotification(reminder: Reminder) {
  await Notifications.scheduleNotificationAsync({
    content: { title: reminder.title, body: '水やりの時間です' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(reminder.scheduledAt),
    },
  });
}

export function schedulePendingNotifications() {
  init();
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM reminders;', [], async (_, { rows }) => {
      for (const rem of rows._array as Reminder[]) {
        await scheduleNotification(rem);
      }
    });
  });
}

export async function addReminder(title: string, date: Date) {
  init();
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO reminders (title, scheduledAt, synced) VALUES (?, ?, 0);',
        [title, date.toISOString()],
        async (_, result) => {
          await scheduleNotification({
            id: result.insertId as number,
            title,
            scheduledAt: date.toISOString(),
            synced: 0,
          });
          await syncReminders();
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export async function syncReminders() {
  init();
  const state = await Network.getNetworkStateAsync();
  if (!state.isConnected) return;
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM reminders WHERE synced = 0;', [], async (_, { rows }) => {
      const unsynced = rows._array as Reminder[];
      if (unsynced.length === 0) return;
      try {
        await fetch('https://example.com/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unsynced),
        });
        tx.executeSql('UPDATE reminders SET synced = 1 WHERE synced = 0;');
      } catch (e) {
        // keep unsynced for later retry
      }
    });
  });
}
