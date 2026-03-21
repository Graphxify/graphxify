-- Align profile roles/permissions with the current CMS app model.
-- Run this in Supabase SQL Editor.
-- Run supabase/app-roles.sql first so role IDs and normalization helpers exist.

alter table public.profiles
  add column if not exists permissions jsonb not null default '{}'::jsonb;

alter table public.profiles
  add column if not exists role_id smallint;

update public.profiles
set role = public.normalize_app_role(role);

update public.profiles p
set role_id = r.id
from public.app_roles r
where r.slug = public.normalize_app_role(p.role)
  and (p.role_id is null or p.role_id <> r.id);

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'moderator'));

alter table public.profiles
  alter column role set default 'editor';

alter table public.profiles
  alter column role_id set default 2;

alter table public.profiles
  drop constraint if exists profiles_role_id_fkey;

alter table public.profiles
  add constraint profiles_role_id_fkey
  foreign key (role_id) references public.app_roles(id)
  on update cascade
  on delete restrict;

update public.profiles
set role_id = 2
where role_id is null;

alter table public.profiles
  alter column role_id set not null;

alter table public.profiles
  drop constraint if exists profiles_status_check;

alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'disabled', 'pending_invite'));
