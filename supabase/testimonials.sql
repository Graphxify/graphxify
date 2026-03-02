-- Incremental migration for testimonials CMS support.
-- Safe to run on an existing Graphxify database.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
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

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.audit_logs drop constraint if exists audit_logs_entity_type_check;
alter table public.audit_logs
  add constraint audit_logs_entity_type_check
  check (entity_type in ('post', 'work', 'testimonial', 'lead', 'profile', 'system'));

alter table public.testimonials enable row level security;

create or replace function public.can_edit_testimonial(testimonial_author_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or (public.is_mod() and auth.uid() = testimonial_author_id);
$$;

grant execute on function public.can_edit_testimonial(uuid) to anon, authenticated, service_role;

drop policy if exists "testimonials_public_read_published" on public.testimonials;
drop policy if exists "testimonials_staff_read_all" on public.testimonials;
drop policy if exists "testimonials_insert_staff" on public.testimonials;
drop policy if exists "testimonials_update_staff_owned" on public.testimonials;
drop policy if exists "testimonials_delete_staff_owned" on public.testimonials;

create policy "testimonials_public_read_published"
on public.testimonials
for select
using (status = 'published');

create policy "testimonials_staff_read_all"
on public.testimonials
for select
using (public.is_admin_or_mod());

create policy "testimonials_insert_staff"
on public.testimonials
for insert
with check (public.is_admin_or_mod());

create policy "testimonials_update_staff_owned"
on public.testimonials
for update
using (public.can_edit_testimonial(author_id))
with check (public.can_edit_testimonial(author_id));

create policy "testimonials_delete_staff_owned"
on public.testimonials
for delete
using (public.can_edit_testimonial(author_id));

-- Force PostgREST (Supabase API) to refresh schema cache immediately.
notify pgrst, 'reload schema';
