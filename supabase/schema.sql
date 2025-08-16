-- Schema definitions for Supabase tables

-- Users table ensures one entry per email, allowing account merging across providers
create table if not exists users (
  id uuid primary key,
  email text unique not null
);

-- Profiles table stores public profile information and follow relationships
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  bio text,
  followers uuid[] default array[]::uuid[],
  following uuid[] default array[]::uuid[],
  created_at timestamp with time zone default now()
);

-- Minimal posts table for user content
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text,
  created_at timestamp with time zone default now()
);

-- Stocks table with hierarchy and tagging support
create table if not exists stocks (
  id bigserial primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  parent_id bigint references stocks(id) on delete set null,
  name text not null,
  is_public boolean not null default true,
  tag_ids bigint[] not null default '{}'::bigint[],
  created_at timestamp with time zone default now()
);

-- Tags are shared across all users
create table if not exists tags (
  id bigserial primary key,
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Join table between stocks and tags for many-to-many relationship
create table if not exists stock_tags (
  stock_id bigint not null references stocks(id) on delete cascade,
  tag_id bigint not null references tags(id) on delete cascade,
  primary key (stock_id, tag_id)
);

create index if not exists tags_name_idx on tags (name);

-- Reports for inappropriate posts
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  reporter uuid not null default auth.uid(),
  reason text,
  created_at timestamp with time zone default now()
);

-- Trigger to call edge function when new report inserted
create or replace function notify_report()
returns trigger as $$
begin
  perform
    net.http_post(
      url:='https://<project-ref>.functions.supabase.co/report-notify',
      headers:='{"Content-Type":"application/json"}',
      body:=json_build_object('record', row_to_json(new))::text
    );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_report_created on reports;
create trigger on_report_created
  after insert on reports
  for each row execute function notify_report();

-- Notifications table to store various notification types
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

