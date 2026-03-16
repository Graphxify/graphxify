-- Migration: Add CMS-editable fields to works table
-- Run this in Supabase SQL Editor

alter table public.works
  add column if not exists card_outcome     text,
  add column if not exists card_services    text[] not null default '{}',
  add column if not exists sort_order       integer not null default 0,
  add column if not exists featured         boolean not null default false,
  add column if not exists industry         text,
  add column if not exists platform         text,
  add column if not exists timeline         text,
  add column if not exists location         text default 'Canada',
  add column if not exists live_url         text,
  add column if not exists overview         text,
  add column if not exists challenge        text,
  add column if not exists approach         text,
  add column if not exists solution         text,
  add column if not exists result           text,
  add column if not exists meta_title       text,
  add column if not exists meta_description text;
