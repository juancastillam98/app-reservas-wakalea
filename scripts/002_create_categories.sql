-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon text, -- lucide icon name
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "categories_select_all" on public.categories
  for select using (true);

-- Seed categories
insert into public.categories (name, slug, icon) values
  ('Ecoturismo', 'ecoturismo', 'Leaf'),
  ('Agroturismo', 'agroturismo', 'Wheat'),
  ('Turismo Activo', 'turismo-activo', 'Mountain'),
  ('Gastronomia', 'gastronomia', 'UtensilsCrossed'),
  ('Bienestar', 'bienestar', 'Heart'),
  ('Cultural', 'cultural', 'Landmark')
on conflict (slug) do nothing;
