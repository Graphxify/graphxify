-- Graphxify inquiries table
create extension if not exists "pgcrypto";

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text not null,
  website text,
  services text[] not null,
  timeline text not null,
  budget text not null,
  details text not null,
  source text not null check (source in ('homepage', 'contact'))
);

alter table public.inquiries enable row level security;

-- Public can submit inquiries.
drop policy if exists "inquiries_public_insert" on public.inquiries;
create policy "inquiries_public_insert"
on public.inquiries
for insert
to anon, authenticated
with check (true);

-- Admin/mod can review inquiries in dashboard contexts.
drop policy if exists "inquiries_staff_select" on public.inquiries;
create policy "inquiries_staff_select"
on public.inquiries
for select
to authenticated
using (auth.role() = 'authenticated');
