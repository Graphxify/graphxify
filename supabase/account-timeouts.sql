-- Adds profile support for temporary account timeouts.
-- Run this in Supabase SQL Editor before using timed disables from the CMS.

alter table public.profiles
  add column if not exists disabled_until timestamptz;
