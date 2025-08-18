import { supabase, PLANT_IMAGES_BUCKET } from '../supabaseClient';
import * as ImagePicker from 'expo-image-picker';

export interface ImageUploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (
  imageUri: string, 
  bucket: string = PLANT_IMAGES_BUCKET,
  userId: string
): Promise<ImageUploadResult> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const extension = imageUri.split('.').pop() || 'jpg';
    const filename = `${userId}/${timestamp}.${extension}`;

    // Convert image to blob (for web) or use file system for mobile
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, blob, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return {
      url: publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (
  path: string, 
  bucket: string = PLANT_IMAGES_BUCKET
): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const checkStorageUsage = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.storage
      .from(PLANT_IMAGES_BUCKET)
      .list(userId);

    if (error) throw error;

    let totalSize = 0;
    if (data) {
      totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    }

    return totalSize;
  } catch (error) {
    console.error('Error checking storage usage:', error);
    throw error;
  }
};

export const pickAndUploadImage = async (
  userId: string,
  options: ImagePicker.ImagePickerOptions = {}
): Promise<ImageUploadResult | null> => {
  try {
    const defaultOptions: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...options
    };

    const result = await ImagePicker.launchImageLibraryAsync(defaultOptions);

    if (!result.canceled && result.assets[0]) {
      return await uploadImage(result.assets[0].uri, PLANT_IMAGES_BUCKET, userId);
    }

    return null;
  } catch (error) {
    console.error('Error picking and uploading image:', error);
    throw error;
  }
};

export const takeAndUploadPhoto = async (
  userId: string,
  options: ImagePicker.ImagePickerOptions = {}
): Promise<ImageUploadResult | null> => {
  try {
    const defaultOptions: ImagePicker.ImagePickerOptions = {
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      ...options
    };

    const result = await ImagePicker.launchCameraAsync(defaultOptions);

    if (!result.canceled && result.assets[0]) {
      return await uploadImage(result.assets[0].uri, PLANT_IMAGES_BUCKET, userId);
    }

    return null;
  } catch (error) {
    console.error('Error taking and uploading photo:', error);
    throw error;
  }
};