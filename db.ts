import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('agrow.db');

export function initDb() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS shelves (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, grid INTEGER, position INTEGER);'
    );
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS shelf_slots (id INTEGER PRIMARY KEY AUTOINCREMENT, shelf_id INTEGER, position INTEGER, plant TEXT, FOREIGN KEY (shelf_id) REFERENCES shelves(id));'
    );
  });
}

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

export default db;
