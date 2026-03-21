-- Add related_service column to posts and post_versions tables.
-- Run this migration on existing databases that were created before this column existed.
-- Safe to re-run (uses IF NOT EXISTS / idempotent).

alter table public.posts
  add column if not exists related_service text
    check (related_service in ('brand-systems', 'web-design', 'web-development', 'cms-architecture'));

alter table public.post_versions
  add column if not exists related_service text
    check (related_service in ('brand-systems', 'web-design', 'web-development', 'cms-architecture'));
