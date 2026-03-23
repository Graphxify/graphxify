-- Creates the marquee_items table and seeds the 6 existing logos.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT DO NOTHING.

CREATE TABLE IF NOT EXISTS public.marquee_items (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url_dark  text        NOT NULL DEFAULT '',
  image_url_light text        NOT NULL DEFAULT '',
  label           text        NOT NULL DEFAULT '',
  sort_order      int         NOT NULL DEFAULT 0,
  enabled         boolean     NOT NULL DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

-- Migrate: rename image_url → image_url_dark if the old column still exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'marquee_items' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE public.marquee_items RENAME COLUMN image_url TO image_url_dark;
  END IF;
END $$;

-- Add image_url_light if it doesn't exist yet
ALTER TABLE public.marquee_items ADD COLUMN IF NOT EXISTS image_url_light text NOT NULL DEFAULT '';

ALTER TABLE public.marquee_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read (needed for public homepage)
DO $$ BEGIN
  CREATE POLICY "marquee_items_public_read" ON public.marquee_items
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Only authenticated users can write
DO $$ BEGIN
  CREATE POLICY "marquee_items_auth_write" ON public.marquee_items
    FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Fill image_url_light for any rows migrated from the old single-column schema
UPDATE public.marquee_items
SET image_url_light = REPLACE(image_url_dark, '-dark.svg', '-light.svg')
WHERE image_url_light = '' AND image_url_dark LIKE '%-dark.svg';

-- Remove duplicate rows BEFORE adding unique constraint
DELETE FROM public.marquee_items
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY image_url_dark ORDER BY sort_order ASC, created_at ASC) AS rn
    FROM public.marquee_items
  ) ranked
  WHERE rn > 1
);

-- Add unique constraint on image_url_dark to prevent future duplicates
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'marquee_items_image_url_dark_key'
  ) THEN
    ALTER TABLE public.marquee_items ADD CONSTRAINT marquee_items_image_url_dark_key UNIQUE (image_url_dark);
  END IF;
END $$;

-- Seed the 6 logos (skip if already present via unique constraint)
INSERT INTO public.marquee_items (image_url_dark, image_url_light, label, sort_order, enabled) VALUES
  ('/images/marquee/marquee-logo-01-dark.svg', '/images/marquee/marquee-logo-01-light.svg', 'Client logo 1', 1, true),
  ('/images/marquee/marquee-logo-02-dark.svg', '/images/marquee/marquee-logo-02-light.svg', 'Client logo 2', 2, true),
  ('/images/marquee/marquee-logo-03-dark.svg', '/images/marquee/marquee-logo-03-light.svg', 'Client logo 3', 3, true),
  ('/images/marquee/marquee-logo-04-dark.svg', '/images/marquee/marquee-logo-04-light.svg', 'Client logo 4', 4, true),
  ('/images/marquee/marquee-logo-05-dark.svg', '/images/marquee/marquee-logo-05-light.svg', 'Client logo 5', 5, true),
  ('/images/marquee/marquee-logo-06-dark.svg', '/images/marquee/marquee-logo-06-light.svg', 'Client logo 6', 6, true)
ON CONFLICT (image_url_dark) DO UPDATE
  SET image_url_light = EXCLUDED.image_url_light,
      label = EXCLUDED.label;
