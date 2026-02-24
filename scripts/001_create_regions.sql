-- Regions table
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz default now()
);

alter table public.regions enable row level security;

-- Everyone can read regions
create policy "regions_select_all" on public.regions
  for select using (true);

-- Seed the 3 main regions
insert into public.regions (name, slug, description, image_url) values
  ('Pais Vasco', 'pais-vasco', 'Montanas verdes, costa salvaje y gastronomia de primer nivel. Descubre el ecoturismo en Euskadi.', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'),
  ('Andalucia', 'andalucia', 'Sierra, dehesas y pueblos blancos. Vive la naturaleza del sur de Espana.', 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&q=80'),
  ('Comunidad Valenciana', 'comunidad-valenciana', 'Humedales, sierras del interior y huertos milenarios junto al Mediterraneo.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80')
on conflict (slug) do nothing;
