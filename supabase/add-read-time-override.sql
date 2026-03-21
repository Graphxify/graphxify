-- Add optional read-time override to posts and post_versions.
-- Editors can set an explicit minute count; if null, read time is derived from content word count.
-- Run this in the Supabase SQL editor.

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS read_time_override INTEGER
    CHECK (read_time_override IS NULL OR read_time_override >= 1);

ALTER TABLE public.post_versions
  ADD COLUMN IF NOT EXISTS read_time_override INTEGER
    CHECK (read_time_override IS NULL OR read_time_override >= 1);
