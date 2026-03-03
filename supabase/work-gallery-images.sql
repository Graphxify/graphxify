-- Incremental migration for Project Details CMS management.
-- Safe to run multiple times.

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
