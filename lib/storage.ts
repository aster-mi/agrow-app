import { supabase, PLANT_IMAGES_BUCKET, MAX_STORAGE_BYTES } from '../supabaseClient';

export async function ensurePlantImagesBucket() {
  const { data } = await supabase.storage.getBucket(PLANT_IMAGES_BUCKET);
  if (!data) {
    await supabase.storage.createBucket(PLANT_IMAGES_BUCKET, { public: false });
  }
}

export async function getUserUsedBytes(userId: string): Promise<number> {
  const { data, error } = await supabase.storage.from(PLANT_IMAGES_BUCKET).list(userId, {
    limit: 1000,
    offset: 0,
  });
  if (error || !data) return 0;
  return data.reduce((sum, item) => sum + (item.metadata?.size ?? 0), 0);
}

export async function canUpload(userId: string, newSize: number): Promise<boolean> {
  const used = await getUserUsedBytes(userId);
  return used + newSize <= MAX_STORAGE_BYTES;
}
