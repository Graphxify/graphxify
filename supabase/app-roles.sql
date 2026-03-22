-- Normalize CMS roles into a dedicated table with stable numeric IDs and RLS.
-- Safe to run on an existing Graphxify database, including the earlier UUID-based version.

create or replace function public.normalize_app_role(input text)
returns text
language sql
immutable
as $$
  select case lower(trim(coalesce(input, '')))
    when 'admin' then 'admin'
    when 'editor' then 'editor'
    when 'author' then 'editor'
    when 'moderator' then 'moderator'
    when 'mod' then 'moderator'
    when 'reviewer' then 'moderator'
    else 'editor'
  end;
$$;

do $$
declare
  app_roles_id_type text;
begin
  execute 'drop trigger if exists profiles_sync_role_columns on public.profiles';

  select c.data_type
  into app_roles_id_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'app_roles'
    and c.column_name = 'id';

  if app_roles_id_type is null then
    execute '
      create table public.app_roles (
        id smallint primary key check (id > 0),
        slug text not null unique,
        name text not null unique,
        description text,
        default_permissions jsonb not null default ''{}''::jsonb,
        sort_order integer not null default 0 check (sort_order >= 0),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    ';
  elsif app_roles_id_type <> 'smallint' then
    execute 'alter table public.profiles drop constraint if exists profiles_role_id_fkey';
    execute 'alter table public.profiles alter column role_id drop default';
    execute '
      alter table public.profiles
      alter column role_id type smallint
      using case public.normalize_app_role(role)
        when ''admin'' then 1
        when ''editor'' then 2
        when ''moderator'' then 3
        else 2
      end
    ';
    execute 'drop table public.app_roles';
    execute '
      create table public.app_roles (
        id smallint primary key check (id > 0),
        slug text not null unique,
        name text not null unique,
        description text,
        default_permissions jsonb not null default ''{}''::jsonb,
        sort_order integer not null default 0 check (sort_order >= 0),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    ';
  end if;
end
$$;

insert into public.app_roles (id, slug, name, description, default_permissions, sort_order)
values
  (
    1,
    'admin',
    'Admin',
    'Full platform access across the CMS.',
    '{
      "content.works.create": true,
      "content.works.edit_any": true,
      "content.works.publish": true,
      "content.works.delete": true,
      "content.posts.create": true,
      "content.posts.edit_any": true,
      "content.posts.edit_own": true,
      "content.posts.publish": true,
      "content.posts.delete": true,
      "content.testimonials.view": true,
      "content.testimonials.create": true,
      "content.testimonials.edit": true,
      "content.testimonials.moderate": true,
      "content.testimonials.delete": true,
      "content.testimonial_metrics.edit": true,
      "content.services.edit": true,
      "content.homepage.edit": true,
      "media.upload": true,
      "analytics.view": true,
      "leads.view": true,
      "settings.manage": true,
      "users.manage": true,
      "users.create": true,
      "users.assign_role": true,
      "users.delete": true,
      "users.disable": true,
      "users.reset_password": true,
      "users.force_logout": true
    }'::jsonb,
    1
  ),
  (
    2,
    'editor',
    'Editor',
    'Create and update owned content plus core site content.',
    '{
      "content.works.create": true,
      "content.works.edit_any": true,
      "content.posts.create": true,
      "content.posts.edit_own": true,
      "content.services.edit": true,
      "content.homepage.edit": true,
      "media.upload": true
    }'::jsonb,
    2
  ),
  (
    3,
    'moderator',
    'Moderator',
    'Review, publish, and moderate operational content.',
    '{
      "content.works.create": true,
      "content.works.edit_any": true,
      "content.works.publish": true,
      "content.posts.create": true,
      "content.posts.edit_any": true,
      "content.posts.edit_own": true,
      "content.posts.publish": true,
      "content.testimonials.view": true,
      "content.testimonials.create": true,
      "content.testimonials.edit": true,
      "content.testimonials.moderate": true,
      "content.testimonial_metrics.edit": true,
      "media.upload": true,
      "analytics.view": true,
      "leads.view": true
    }'::jsonb,
    3
  )
on conflict (id) do update
set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  default_permissions = excluded.default_permissions,
  sort_order = excluded.sort_order,
  updated_at = now();

alter table public.profiles
  add column if not exists role_id smallint,
  add column if not exists permissions jsonb not null default '{}'::jsonb;

update public.profiles
set role = public.normalize_app_role(role);

update public.profiles p
set role_id = r.id
from public.app_roles r
where r.slug = public.normalize_app_role(p.role)
  and (p.role_id is null or p.role_id <> r.id);

alter table public.profiles
  alter column role set default 'editor';

alter table public.profiles
  alter column role_id set default 2;

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'moderator'));

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

create or replace function public.sync_profile_role_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_role record;
begin
  if new.role_id is not null then
    select id, slug
    into resolved_role
    from public.app_roles
    where id = new.role_id;
  else
    select id, slug
    into resolved_role
    from public.app_roles
    where slug = public.normalize_app_role(new.role);
  end if;

  if resolved_role.id is null then
    raise exception 'Invalid app role for profile %', new.id;
  end if;

  new.role_id := resolved_role.id;
  new.role := resolved_role.slug;

  return new;
end;
$$;

drop trigger if exists profiles_sync_role_columns on public.profiles;
create trigger profiles_sync_role_columns
before insert or update of role, role_id on public.profiles
for each row execute function public.sync_profile_role_columns();

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

alter table public.app_roles enable row level security;

drop policy if exists "app_roles_authenticated_read" on public.app_roles;

create policy "app_roles_authenticated_read"
on public.app_roles
for select
using (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
