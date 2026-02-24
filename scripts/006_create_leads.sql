-- Leads table (for lead magnet / newsletter)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  interests text[] default '{}',
  source text default 'website',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Allow anonymous inserts (for lead magnet form)
create policy "leads_insert_anon" on public.leads
  for insert with check (true);
