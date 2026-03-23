-- Adds Open Graph / Twitter / canonical SEO fields to works and posts.
-- Safe to run multiple times (ADD COLUMN IF NOT EXISTS).

-- ── Works ──────────────────────────────────────────────────────────────────
ALTER TABLE works ADD COLUMN IF NOT EXISTS og_title             text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS og_description       text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS og_image             text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS og_image_alt         text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS twitter_title        text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS twitter_description  text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS twitter_image        text;
ALTER TABLE works ADD COLUMN IF NOT EXISTS twitter_card         text DEFAULT 'summary_large_image';
ALTER TABLE works ADD COLUMN IF NOT EXISTS canonical_url        text;

-- ── Posts ──────────────────────────────────────────────────────────────────
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_title             text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_description       text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image             text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image_alt         text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS twitter_title        text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS twitter_description  text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS twitter_image        text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS twitter_card         text DEFAULT 'summary_large_image';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url        text;
