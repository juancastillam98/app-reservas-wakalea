-- Experiences table (core product)
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  description text not null,
  region_id uuid not null references public.regions(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  price_cents integer not null, -- price in cents (EUR)
  original_price_cents integer, -- for showing discounts
  duration_hours integer not null default 4,
  max_guests integer not null default 12,
  min_age integer default 0,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  featured boolean default false,
  best_seller boolean default false,
  image_url text not null,
  gallery text[] default '{}', -- array of image URLs
  includes text[] default '{}',
  excludes text[] default '{}',
  highlights text[] default '{}',
  meeting_point text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.experiences enable row level security;

-- Everyone can read active experiences
create policy "experiences_select_active" on public.experiences
  for select using (status = 'active');

-- Create indexes for common queries
create index if not exists idx_experiences_region on public.experiences(region_id);
create index if not exists idx_experiences_category on public.experiences(category_id);
create index if not exists idx_experiences_status on public.experiences(status);
create index if not exists idx_experiences_featured on public.experiences(featured) where featured = true;
create index if not exists idx_experiences_slug on public.experiences(slug);
