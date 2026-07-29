-- Full SEO / OG / Twitter metadata seed for all known CMS records.
-- Supersedes seed-og-metadata.sql (which only set 4 fields).
-- Safe to re-run: all statements are UPDATE … WHERE slug = '…'.
-- Run AFTER og-seo-fields.sql migration has been applied.
--
-- og_image / twitter_image are set to cover_image_url so each project always
-- uses its own uploaded cover photo. If cover_image_url is NULL the existing
-- value (if any) is preserved via COALESCE.
-- ────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════
--  WORKS
-- ═══════════════════════════════════════════════════════════════════════════


-- ── FlyUp Line ──────────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'FlyUp Line — Travel Platform & Web Design Case Study | Graphxify',
  meta_description    = 'Graphxify redesigned the FlyUp Line travel platform to simplify the booking experience, build traveller trust, and drive conversion. See the UX strategy and design approach.',
  og_title            = 'FlyUp Line — Travel Platform Redesign | Graphxify',
  og_description      = 'A responsive travel platform redesigned to simplify the booking experience and drive conversion — delivered by Graphxify for FlyUp Line.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'FlyUp Line travel platform — web design and UX strategy by Graphxify',
  twitter_title       = 'FlyUp Line — Travel Platform Redesign | Graphxify',
  twitter_description = 'A responsive travel platform redesigned to simplify the booking experience and drive conversion — delivered by Graphxify for FlyUp Line.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'northline-enterprise-replatform';


-- ── Maven ────────────────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'Maven — Women''s Fashion Brand Identity Case Study | Graphxify',
  meta_description    = 'Graphxify built a complete brand identity for Maven — a contemporary women''s fashion label defined by typographic precision, restrained colour, and confident visual language.',
  og_title            = 'Maven — Women''s Fashion Brand Identity | Graphxify',
  og_description      = 'A complete brand identity system for a contemporary women''s fashion label — built on typographic precision, restrained colour, and a confident visual language.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'Maven brand identity — logo, typography, and design system by Graphxify',
  twitter_title       = 'Maven — Women''s Fashion Brand Identity | Graphxify',
  twitter_description = 'A complete brand identity system for a contemporary women''s fashion label — built on typographic precision, restrained colour, and a confident visual language.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'vertex-brand-operations';


-- ── BOSS Medical Clinic ──────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'BOSS Medical Clinic — Healthcare Website Design Case Study | Graphxify',
  meta_description    = 'Graphxify designed BOSS Medical Clinic''s website to communicate clinical authority while guiding patients through services with clarity and ease.',
  og_title            = 'BOSS Medical Clinic — Healthcare Web Design | Graphxify',
  og_description      = 'A professional, accessible website for a medical clinic — designed to communicate trust, simplify service navigation, and convert patients online.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'BOSS Medical Clinic website — healthcare web design by Graphxify',
  twitter_title       = 'BOSS Medical Clinic — Healthcare Web Design | Graphxify',
  twitter_description = 'A professional, accessible website for a medical clinic — designed to communicate trust, simplify service navigation, and convert patients online.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'axis-growth-platform';


-- ── Pharmacy On King ─────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'Pharmacy On King — Community Pharmacy Web Design Case Study | Graphxify',
  meta_description    = 'Graphxify built a clear, structured website for Pharmacy On King — making services, hours, and contact information easy to find for every patient, on every device.',
  og_title            = 'Pharmacy On King — Healthcare Web Design | Graphxify',
  og_description      = 'A clean, structured website for a community pharmacy — built to surface services, hours, and contact information clearly across every device.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'Pharmacy On King website — healthcare web design by Graphxify',
  twitter_title       = 'Pharmacy On King — Healthcare Web Design | Graphxify',
  twitter_description = 'A clean, structured website for a community pharmacy — built to surface services, hours, and contact information clearly across every device.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'lumen-commerce-redesign';


-- ── Luka Hair Salon ──────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'Luka Hair Salon — Beauty Brand & Website Design Case Study | Graphxify',
  meta_description    = 'Graphxify designed Luka Hair Salon''s brand identity and website to communicate elegance, attract new clients, and make booking effortless from any device.',
  og_title            = 'Luka Hair Salon — Beauty Brand & Web Design | Graphxify',
  og_description      = 'Brand identity and website for an upscale hair salon — designed to project confidence, elegance, and make booking effortless for clients.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'Luka Hair Salon brand and website — beauty design by Graphxify',
  twitter_title       = 'Luka Hair Salon — Beauty Brand & Web Design | Graphxify',
  twitter_description = 'Brand identity and website for an upscale hair salon — designed to project confidence, elegance, and make booking effortless for clients.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'atlas-fintech-experience-hub';


-- ── King Medical Arts Pharmacy ───────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'King Medical Arts Pharmacy — Healthcare Website Case Study | Graphxify',
  meta_description    = 'Graphxify built King Medical Arts Pharmacy''s website to improve service accessibility, establish professional credibility, and help patients find what they need with ease.',
  og_title            = 'King Medical Arts Pharmacy — Healthcare Web Design | Graphxify',
  og_description      = 'A professional pharmacy website designed to make services, location, and contact easy to find — built for clarity, trust, and mobile performance.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'King Medical Arts Pharmacy website — healthcare web design by Graphxify',
  twitter_title       = 'King Medical Arts Pharmacy — Healthcare Web Design | Graphxify',
  twitter_description = 'A professional pharmacy website designed to make services, location, and contact easy to find — built for clarity, trust, and mobile performance.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug = 'meridian-health-network-portal';


-- ═══════════════════════════════════════════════════════════════════════════
--  BLOG POSTS  (batch — derives values from existing post columns)
-- ═══════════════════════════════════════════════════════════════════════════
-- Fills any NULL SEO / OG / Twitter fields using the post's own title,
-- excerpt, category, and cover_image_url so no published post is left bare.
-- Already-populated fields are never overwritten (WHERE col IS NULL guards).
-- Run this AFTER the explicit per-post UPDATEs below (if any).

-- seo_title: "<title> | Graphxify"
UPDATE posts
SET seo_title = title || ' | Graphxify'
WHERE status = 'published'
  AND (seo_title IS NULL OR seo_title = '');

-- seo_description: the post excerpt
UPDATE posts
SET seo_description = excerpt
WHERE status = 'published'
  AND (seo_description IS NULL OR seo_description = '')
  AND excerpt IS NOT NULL AND excerpt <> '';

-- og_title: "<title> | Graphxify Blog"
UPDATE posts
SET og_title = title || ' | Graphxify Blog'
WHERE status = 'published'
  AND (og_title IS NULL OR og_title = '');

-- og_description: the post excerpt
UPDATE posts
SET og_description = excerpt
WHERE status = 'published'
  AND (og_description IS NULL OR og_description = '')
  AND excerpt IS NOT NULL AND excerpt <> '';

-- og_image: the post cover image
UPDATE posts
SET og_image = cover_image_url
WHERE status = 'published'
  AND (og_image IS NULL OR og_image = '')
  AND cover_image_url IS NOT NULL AND cover_image_url <> '';

-- og_image_alt: "<title> — <category> article by Graphxify"
UPDATE posts
SET og_image_alt = title || ' — ' || category || ' article by Graphxify'
WHERE status = 'published'
  AND (og_image_alt IS NULL OR og_image_alt = '');

-- twitter_title: mirror og_title
UPDATE posts
SET twitter_title = og_title
WHERE status = 'published'
  AND (twitter_title IS NULL OR twitter_title = '')
  AND og_title IS NOT NULL AND og_title <> '';

-- twitter_description: mirror og_description
UPDATE posts
SET twitter_description = og_description
WHERE status = 'published'
  AND (twitter_description IS NULL OR twitter_description = '')
  AND og_description IS NOT NULL AND og_description <> '';

-- twitter_image: mirror og_image (which was set to cover_image_url above)
UPDATE posts
SET twitter_image = og_image
WHERE status = 'published'
  AND (twitter_image IS NULL OR twitter_image = '')
  AND og_image IS NOT NULL AND og_image <> '';

-- twitter_card: always summary_large_image for blog posts
UPDATE posts
SET twitter_card = 'summary_large_image'
WHERE status = 'published'
  AND (twitter_card IS NULL OR twitter_card = '');

-- canonical_url: deliberately NOT seeded.
--
-- This block used to set 'https://graphxify.com/blog/' || slug — the NON-www
-- host, which 308-redirects to www. That made every post declare a canonical
-- pointing at a redirect, a self-conflicting signal.
--
-- Leaving canonical_url NULL is correct: buildMetadata() computes the canonical
-- from siteConfig.url, which resolves to the www host. Only set canonical_url
-- per-row when a page genuinely needs to point somewhere else (e.g. syndicated
-- content), and always use the www host if you do.
