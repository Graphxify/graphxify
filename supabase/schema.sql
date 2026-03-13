-- GRAPHXIFY schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'author' check (role in ('admin', 'editor', 'reviewer', 'author')),
  status text not null default 'active' check (status in ('active', 'disabled', 'pending_invite')),
  display_name text,
  bio text,
  avatar_url text,
  phone text,
  last_login timestamptz,
  last_activity timestamptz,
  last_password_change timestamptz,
  force_password_reset boolean not null default false,
  force_logout_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  category text not null default 'Web Design',
  author text,
  author_role text,
  author_bio text,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  year int not null,
  role text not null,
  services text[] not null default '{}',
  subtitle text,
  layout_variant text not null default 'A' check (layout_variant in ('A', 'B', 'C', 'D', 'E', 'F')),
  excerpt text not null,
  content text not null,
  cover_image_url text,
  gallery_images text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  image_url text,
  rating int not null default 5 check (rating between 1 and 5),
  status text not null default 'draft' check (status in ('draft', 'pending', 'published', 'rejected')),
  sort_order int not null default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonial_metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_email text,
  actor_role text,
  action text not null,
  entity_type text not null check (entity_type in ('post', 'work', 'testimonial', 'lead', 'profile', 'system')),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.post_versions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  version int not null,
  title text not null,
  slug text not null,
  excerpt text not null,
  content text not null,
  category text not null default 'Web Design',
  author text,
  author_role text,
  author_bio text,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  cover_image_url text,
  status text not null check (status in ('draft', 'review', 'published')),
  editor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (post_id, version)
);

create table if not exists public.work_versions (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  version int not null,
  title text not null,
  slug text not null,
  year int not null,
  role text not null,
  services text[] not null default '{}',
  subtitle text,
  layout_variant text not null default 'A' check (layout_variant in ('A', 'B', 'C', 'D', 'E', 'F')),
  excerpt text not null,
  content text not null,
  cover_image_url text,
  gallery_images text[] not null default '{}',
  status text not null check (status in ('draft', 'review', 'published')),
  editor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (work_id, version)
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
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

drop trigger if exists set_posts_updated_at on public.posts;
create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonial_metrics_updated_at on public.testimonial_metrics;
create trigger set_testimonial_metrics_updated_at
before update on public.testimonial_metrics
for each row execute function public.set_updated_at();

alter table public.works
  add column if not exists gallery_images text[] not null default '{}';

alter table public.work_versions
  add column if not exists gallery_images text[] not null default '{}';

alter table public.works
  add column if not exists subtitle text;

alter table public.work_versions
  add column if not exists subtitle text;

alter table public.works
  add column if not exists layout_variant text not null default 'A';

alter table public.work_versions
  add column if not exists layout_variant text not null default 'A';

alter table public.works
  drop constraint if exists works_layout_variant_check;

alter table public.works
  add constraint works_layout_variant_check
  check (layout_variant in ('A', 'B', 'C', 'D', 'E', 'F'));

alter table public.work_versions
  drop constraint if exists work_versions_layout_variant_check;

alter table public.work_versions
  add constraint work_versions_layout_variant_check
  check (layout_variant in ('A', 'B', 'C', 'D', 'E', 'F'));

alter table public.audit_logs drop constraint if exists audit_logs_entity_type_check;
alter table public.audit_logs
  add constraint audit_logs_entity_type_check
  check (entity_type in ('post', 'work', 'testimonial', 'lead', 'profile', 'system'));

alter table public.testimonials
  add column if not exists rating int not null default 5;

alter table public.testimonials
  drop constraint if exists testimonials_rating_check;

alter table public.testimonials
  add constraint testimonials_rating_check
  check (rating between 1 and 5);

alter table public.testimonials
  drop constraint if exists testimonials_status_check;

alter table public.testimonials
  add constraint testimonials_status_check
  check (status in ('draft', 'pending', 'published', 'rejected'));

alter table public.profiles
  add column if not exists status text not null default 'active';

alter table public.profiles
  add column if not exists display_name text;

alter table public.profiles
  add column if not exists bio text;

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  add column if not exists phone text;

alter table public.profiles
  add column if not exists last_login timestamptz;

alter table public.profiles
  add column if not exists last_activity timestamptz;

alter table public.profiles
  add column if not exists last_password_change timestamptz;

alter table public.profiles
  add column if not exists force_password_reset boolean not null default false;

alter table public.profiles
  add column if not exists force_logout_at timestamptz;

alter table public.profiles
  alter column role set default 'author';

update public.profiles
set role = 'editor'
where role = 'mod';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'editor', 'reviewer', 'author'));

update public.profiles
set status = 'active'
where status is null;

alter table public.profiles
  drop constraint if exists profiles_status_check;

alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active', 'disabled', 'pending_invite'));

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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
