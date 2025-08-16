-- Enable RLS on posts and stocks tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- Allow users to manage only their own posts
CREATE POLICY "Users manage own posts" ON posts
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to manage only their own stocks
CREATE POLICY "Users manage own stocks" ON stocks
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
