-- Basic database schema additions for tag support

-- Tags are shared across all users
create table if not exists tags (
  id bigserial primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Join table between stocks and tags for many-to-many relationship
create table if not exists stock_tags (
  stock_id bigint not null references stocks(id) on delete cascade,
  tag_id bigint not null references tags(id) on delete cascade,
  primary key (stock_id, tag_id)
);

create index if not exists tags_name_idx on tags (name);
