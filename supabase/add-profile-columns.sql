-- Add extended profile and user-management columns
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists status text not null default 'active';
alter table public.profiles add column if not exists last_login timestamptz;
alter table public.profiles add column if not exists last_activity timestamptz;
alter table public.profiles add column if not exists last_password_change timestamptz;
alter table public.profiles add column if not exists force_password_reset boolean not null default false;
alter table public.profiles add column if not exists force_logout_at timestamptz;

alter table public.profiles alter column role set default 'author';

update public.profiles
set role = 'editor'
where role = 'mod';

update public.profiles
set status = 'active'
where status is null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'reviewer', 'author'));

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'disabled', 'pending_invite'));
