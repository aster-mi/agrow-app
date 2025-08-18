import { supabase } from '../supabaseClient';

// User Profile Service
export const createProfile = async (userId: string, data: {
  username?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...data }])
    .select()
    .single();
    
  if (error) throw error;
  return profile;
};

export const getProfile = async (userId: string) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return profile;
};

export const updateProfile = async (userId: string, updates: {
  username?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return profile;
};

// Posts Service
export const getPosts = async (offset: number = 0, limit: number = 10) => {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (error) throw error;
  return posts;
};

export const createPost = async (userId: string, content: string) => {
  const { data: post, error } = await supabase
    .from('posts')
    .insert([{ user_id: userId, content }])
    .select()
    .single();
    
  if (error) throw error;
  return post;
};

export const deletePost = async (postId: string, userId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', userId);
    
  if (error) throw error;
};

// Stocks Service
export const getStocks = async (userId?: string, isPublic?: boolean) => {
  let query = supabase
    .from('stocks')
    .select(`
      *,
      profiles:owner_id (
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });
    
  if (userId) {
    query = query.eq('owner_id', userId);
  }
  
  if (isPublic !== undefined) {
    query = query.eq('is_public', isPublic);
  }
  
  const { data: stocks, error } = await query;
  if (error) throw error;
  return stocks;
};

export const createStock = async (userId: string, data: {
  name: string;
  parent_id?: number;
  is_public?: boolean;
  tag_ids?: number[];
}) => {
  const { data: stock, error } = await supabase
    .from('stocks')
    .insert([{ owner_id: userId, ...data }])
    .select()
    .single();
    
  if (error) throw error;
  return stock;
};

export const updateStock = async (stockId: number, updates: {
  name?: string;
  parent_id?: number;
  is_public?: boolean;
  tag_ids?: number[];
}) => {
  const { data: stock, error } = await supabase
    .from('stocks')
    .update(updates)
    .eq('id', stockId)
    .select()
    .single();
    
  if (error) throw error;
  return stock;
};

export const deleteStock = async (stockId: number) => {
  const { error } = await supabase
    .from('stocks')
    .delete()
    .eq('id', stockId);
    
  if (error) throw error;
};

// Tags Service
export const getTags = async (search?: string) => {
  let query = supabase
    .from('tags')
    .select('*')
    .order('name');
    
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  const { data: tags, error } = await query;
  if (error) throw error;
  return tags;
};

export const createTag = async (name: string) => {
  const { data: tag, error } = await supabase
    .from('tags')
    .insert([{ name }])
    .select()
    .single();
    
  if (error) throw error;
  return tag;
};

// Search Service
export const searchPublicStocks = async (tags: string[], limit: number = 20) => {
  // This would need a more complex query with tag filtering
  const { data: stocks, error } = await supabase
    .from('stocks')
    .select(`
      *,
      profiles:owner_id (
        username,
        avatar_url
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  if (error) throw error;
  return stocks;
};

// Notifications Service
export const getNotifications = async (userId: string) => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return notifications;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
    
  if (error) throw error;
};