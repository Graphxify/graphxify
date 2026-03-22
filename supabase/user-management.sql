-- Incremental migration for full CMS user management.
-- Safe for existing projects.
-- Run supabase/app-roles.sql first so role IDs and normalization helpers exist.

alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists last_login timestamptz;
alter table public.profiles add column if not exists last_activity timestamptz;
alter table public.profiles add column if not exists last_password_change timestamptz;
alter table public.profiles add column if not exists force_password_reset boolean not null default false;
alter table public.profiles add column if not exists force_logout_at timestamptz;
alter table public.profiles add column if not exists disabled_until timestamptz;
alter table public.profiles add column if not exists permissions jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists role_id smallint;

alter table public.profiles alter column role set default 'editor';

update public.profiles
set role = public.normalize_app_role(role);

update public.profiles p
set role_id = r.id
from public.app_roles r
where r.slug = public.normalize_app_role(p.role)
  and (p.role_id is null or p.role_id <> r.id);

update public.profiles
set status = 'active'
where status is null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'moderator'));

alter table public.profiles alter column role_id set default 2;
alter table public.profiles drop constraint if exists profiles_role_id_fkey;
alter table public.profiles
  add constraint profiles_role_id_fkey
  foreign key (role_id) references public.app_roles(id)
  on update cascade
  on delete restrict;

update public.profiles
set role_id = 2
where role_id is null;

alter table public.profiles alter column role_id set not null;

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'disabled', 'pending_invite'));

alter table public.testimonials add column if not exists rating int not null default 5;
alter table public.testimonials drop constraint if exists testimonials_rating_check;
alter table public.testimonials add constraint testimonials_rating_check check (rating between 1 and 5);

alter table public.testimonials drop constraint if exists testimonials_status_check;
alter table public.testimonials
  add constraint testimonials_status_check
  check (status in ('draft', 'pending', 'published', 'rejected'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role text := public.normalize_app_role(new.raw_user_meta_data ->> 'role');
begin
  insert into public.profiles (id, email, role, role_id, status, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    next_role,
    (select id from public.app_roles where slug = next_role),
    'active',
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', ''), '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    role = excluded.role,
    role_id = excluded.role_id;

  return new;
end;
$$;

notify pgrst, 'reload schema';
