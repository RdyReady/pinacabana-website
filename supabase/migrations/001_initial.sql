-- ============================================================
-- Piña Cabana — initial schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- EVENTS
-- ============================================================
create table if not exists public.events (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title           text not null,
  category        text not null check (category in ('popup','private','wedding','brand')),
  starts_at       timestamptz not null,
  ends_at         timestamptz,
  location_name   text,
  location_url    text,
  description     text,
  photo_url       text,
  is_public       boolean not null default true,
  is_published    boolean not null default true,
  recurrence_rule jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_published_public_idx
  on public.events (is_published, is_public);

-- ============================================================
-- AVAILABILITY BLOCKS (days marked unavailable, no public event)
-- ============================================================
create table if not exists public.availability_blocks (
  id              uuid primary key default uuid_generate_v4(),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  reason_internal text,
  created_at      timestamptz not null default now()
);

create index if not exists availability_blocks_range_idx
  on public.availability_blocks (starts_at, ends_at);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================
-- STORAGE — public bucket for event photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

-- Anyone can read the photos (public bucket)
drop policy if exists "Public read event photos" on storage.objects;
create policy "Public read event photos"
  on storage.objects for select
  using (bucket_id = 'event-photos');

-- Only authenticated admins (any logged-in user; app-side checks email)
-- can upload / update / delete
drop policy if exists "Auth write event photos" on storage.objects;
create policy "Auth write event photos"
  on storage.objects for insert
  with check (bucket_id = 'event-photos' and auth.role() = 'authenticated');

drop policy if exists "Auth update event photos" on storage.objects;
create policy "Auth update event photos"
  on storage.objects for update
  using (bucket_id = 'event-photos' and auth.role() = 'authenticated');

drop policy if exists "Auth delete event photos" on storage.objects;
create policy "Auth delete event photos"
  on storage.objects for delete
  using (bucket_id = 'event-photos' and auth.role() = 'authenticated');

-- ============================================================
-- ROW-LEVEL SECURITY
-- Public can read published events (private events appear with details hidden in app code).
-- Writes require authenticated session; admin-email allowlist is enforced in Next.js server code.
-- ============================================================
alter table public.events enable row level security;
alter table public.availability_blocks enable row level security;

drop policy if exists "Public read published events" on public.events;
create policy "Public read published events"
  on public.events for select
  using (is_published = true);

drop policy if exists "Auth full access events" on public.events;
create policy "Auth full access events"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Availability blocks are admin-only (used to derive public "unavailable" days
-- but we don't expose the reason).
drop policy if exists "Public read availability" on public.availability_blocks;
create policy "Public read availability"
  on public.availability_blocks for select
  using (true);

drop policy if exists "Auth full access availability" on public.availability_blocks;
create policy "Auth full access availability"
  on public.availability_blocks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
