-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  booking_date date not null,
  guests integer not null default 1,
  total_cents integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  payment_reference text, -- Redsys reference
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.bookings enable row level security;

-- Users can read their own bookings
create policy "bookings_select_own" on public.bookings
  for select using (auth.uid() = user_id);

-- Users can insert their own bookings
create policy "bookings_insert_own" on public.bookings
  for insert with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_experience on public.bookings(experience_id);
create index if not exists idx_bookings_status on public.bookings(status);
