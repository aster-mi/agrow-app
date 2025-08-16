-- Schema for custom users and profiles tables

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
