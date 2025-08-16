-- Create notifications table to store various notification types
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('like', 'repost', 'comment', 'follow', 'watering_reminder')),
  data jsonb,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Index for fetching notifications by user and date
create index if not exists notifications_user_created_at_idx
  on notifications(user_id, created_at desc);
