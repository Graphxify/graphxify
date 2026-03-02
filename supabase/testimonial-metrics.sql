-- Incremental migration for testimonial metrics CMS support.
-- Safe to run on an existing Graphxify database.

create table if not exists public.testimonial_metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_testimonial_metrics_updated_at on public.testimonial_metrics;
create trigger set_testimonial_metrics_updated_at
before update on public.testimonial_metrics
for each row execute function public.set_updated_at();

alter table public.testimonial_metrics enable row level security;

drop policy if exists "testimonial_metrics_public_read" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_select" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_insert" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_update" on public.testimonial_metrics;
drop policy if exists "testimonial_metrics_staff_delete" on public.testimonial_metrics;

create policy "testimonial_metrics_public_read"
on public.testimonial_metrics
for select
using (true);

create policy "testimonial_metrics_staff_select"
on public.testimonial_metrics
for select
using (public.is_admin_or_mod());

create policy "testimonial_metrics_staff_insert"
on public.testimonial_metrics
for insert
with check (public.is_admin_or_mod());

create policy "testimonial_metrics_staff_update"
on public.testimonial_metrics
for update
using (public.is_admin_or_mod())
with check (public.is_admin_or_mod());

create policy "testimonial_metrics_staff_delete"
on public.testimonial_metrics
for delete
using (public.is_admin_or_mod());

notify pgrst, 'reload schema';

