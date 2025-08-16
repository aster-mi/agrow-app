import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabaseClient] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY が未設定です。' +
      ' app.config.* の extra か .env.* を確認してください。'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 画像アップロード機能（mainブランチ由来）の定数も保持
export const PLANT_IMAGES_BUCKET = 'plant-images';
export const MAX_STORAGE_BYTES = 500 * 1024 * 1024; // 500MB
