-- Seed data for initial local development
insert into tags (name) values ('Agave'), ('Cactus') on conflict do nothing;
