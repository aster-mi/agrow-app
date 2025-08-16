import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { enqueue, peekQueue, clearQueue, OfflineOperation } from './offlineQueue';

const MAX_RETRIES = 3;
const EDGE_FUNCTION_URL = '/functions/v1/sync-failure-email';

async function sendOperation(op: OfflineOperation) {
  const res = await fetch(op.url, op.options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
}

async function notifyFailure(op: OfflineOperation, error: unknown) {
  try {
    await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: op, error: String(error) })
    });
  } catch {
    // ignore notification errors
  }
}

export async function processQueue() {
  const queue = await peekQueue();
  await clearQueue();
  for (const op of queue) {
    let success = false;
    let lastError: unknown;
    for (let attempt = 0; attempt < MAX_RETRIES && !success; attempt++) {
      try {
        await sendOperation(op);
        success = true;
      } catch (err) {
        lastError = err;
      }
    }
    if (!success) {
      await notifyFailure(op, lastError);
      Alert.alert('同期に失敗しました', '再試行しますか？', [
        { text: '再試行', onPress: () => enqueue(op) },
        { text: '閉じる', style: 'cancel' }
      ]);
    }
  }
}

export function initSyncService() {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processQueue();
    }
  });
}
