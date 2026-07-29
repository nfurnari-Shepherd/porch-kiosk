-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- Services table
create table services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text not null default '⭐',
  description text,
  details text,
  phone text,
  hours text,
  what_to_bring text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

-- Registrations table
create table registrations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  zip_code text not null,
  phone text,
  service_id uuid references services(id) on delete set null,
  service_name text,
  created_at timestamp with time zone default now()
);

-- Seed the initial 7 services
insert into services (name, icon, description, sort_order) values
  ('AES Utility Assistance', '⚡', 'Help paying your electric bill', 1),
  ('Job Training', '💼', 'Goodwill job training programs', 2),
  ('Food', '🍎', 'Food pantry and meal programs', 3),
  ('Childcare', '👶', 'Childcare resources and assistance', 4),
  ('Rental Assistance', '🏠', 'Help with rent and housing', 5),
  ('SNAP / Medicaid', '🏥', 'Food stamps and health coverage', 6),
  ('Pastoral Care', '🙏', 'Spiritual support and counseling', 7);
