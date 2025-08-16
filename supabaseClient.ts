import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const PLANT_IMAGES_BUCKET = 'plant-images';
export const MAX_STORAGE_BYTES = 500 * 1024 * 1024; // 500MB
