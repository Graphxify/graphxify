create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'blog',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
drop policy if exists "newsletter_staff_select" on public.newsletter_subscribers;

create policy "newsletter_public_insert"
on public.newsletter_subscribers
for insert
with check (true);

create policy "newsletter_staff_select"
on public.newsletter_subscribers
for select
using (public.is_admin() or public.is_editor());

notify pgrst, 'reload schema';
