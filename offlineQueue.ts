import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineOperation {
  id: string;
  url: string;
  options?: RequestInit;
  retries?: number;
}

const QUEUE_KEY = 'offline_queue';

async function readQueue(): Promise<OfflineOperation[]> {
  const data = await AsyncStorage.getItem(QUEUE_KEY);
  return data ? JSON.parse(data) : [];
}

async function writeQueue(queue: OfflineOperation[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function enqueue(op: OfflineOperation): Promise<void> {
  const queue = await readQueue();
  queue.push(op);
  await writeQueue(queue);
}

export async function dequeue(): Promise<OfflineOperation | undefined> {
  const queue = await readQueue();
  const op = queue.shift();
  await writeQueue(queue);
  return op;
}

export async function peekQueue(): Promise<OfflineOperation[]> {
  return readQueue();
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
