import { enqueue } from './offlineQueue';

export interface Stock {
  id: number;
  name: string;
  shelf?: string;
  updated_at?: string;
}

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

if (!API_BASE_URL) {
  console.warn(
    '[api] EXPO_PUBLIC_API_BASE_URL is not set. Network requests may fail.'
  );
}

export async function fetchTagSuggestions(q: string): Promise<string[]> {
  const resp = await fetch(
    `${API_BASE_URL}/api/tags?suggest=${encodeURIComponent(q)}`
  );
  if (!resp.ok) {
    throw new Error('Failed to fetch tag suggestions');
  }
  return resp.json();
}

export interface SearchParams {
  query?: string;
  tags?: string[];
  order?: 'updated' | 'name';
  mineOnly?: boolean;
}

export async function searchStocks(params: SearchParams): Promise<Stock[]> {
  const query = new URLSearchParams();
  if (params.query) {
    query.append('q', params.query);
  }
  params.tags?.forEach((t) => query.append('tag', t));
  if (params.order) {
    query.append('order', params.order);
  }
  if (params.mineOnly) {
    query.append('mine', 'true');
  }
  const resp = await fetch(`${API_BASE_URL}/api/search?${query.toString()}`);
  if (!resp.ok) {
    throw new Error('Failed to search stocks');
  }
  return resp.json();
}

export interface NewStockParams {
  name: string;
  parentId?: number;
  isPublic?: boolean;
  tags?: string[];
  images?: string[];
}

export async function addStock(
  params: NewStockParams
): Promise<Stock | undefined> {
  const op = {
    id: `${Date.now()}`,
    url: `${API_BASE_URL}/api/stocks`,
    options: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: params.name,
        parent_id: params.parentId ?? null,
        is_public: params.isPublic ?? true,
        tags: params.tags ?? [],
        images: params.images ?? [],
      }),
    },
  } as const;

  try {
    const resp = await fetch(op.url, op.options);
    if (!resp.ok) {
      throw new Error('Failed to add stock');
    }
    return resp.json();
  } catch {
    await enqueue(op);
    return undefined;
  }
}
