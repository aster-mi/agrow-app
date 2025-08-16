-- Adds name, public flag, and tag references to stocks table
alter table stocks
  add column name text not null,
  add column is_public boolean not null default true,
  add column tag_ids bigint[] not null default '{}'::bigint[];
