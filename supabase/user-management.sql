-- Incremental migration for full CMS user management.
-- Safe for existing projects.

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
begin
  insert into public.profiles (id, email, role, status, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    case
      when coalesce(new.raw_user_meta_data ->> 'role', '') in ('admin', 'editor', 'reviewer', 'author')
        then new.raw_user_meta_data ->> 'role'
      else 'author'
    end,
    'active',
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', ''), '')
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

notify pgrst, 'reload schema';
