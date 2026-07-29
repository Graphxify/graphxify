-- Populates all SEO / OG / Twitter fields for the 6 known Work records.
-- Works-only — no posts statements so there is nothing that can error and
-- roll back the transaction.
-- Safe to re-run: all statements are idempotent UPDATEs.
--
-- IMPORTANT: Each WHERE clause matches BOTH the internal canonical slug AND
-- the public path slug (e.g. 'northline-enterprise-replatform' OR 'flyup-line').
-- This ensures the UPDATE succeeds regardless of which slug value was entered
-- when the CMS record was originally created.
--
-- og_image / twitter_image: set to cover_image_url from the same row so each
-- project uses its own uploaded cover photo. If cover_image_url is NULL on a
-- row, those two fields will also be NULL — upload the cover image through the
-- CMS first, then re-run.
-- ────────────────────────────────────────────────────────────────────────────


-- ── FlyUp Line ──────────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'FlyUp Line — Travel Platform & Web Design Case Study | Graphxify',
  meta_description    = 'Graphxify redesigned the FlyUp Line travel platform to simplify the booking experience, build traveller trust, and drive conversion. See the full UX strategy and design approach.',
  og_title            = 'FlyUp Line — Travel Platform Redesign | Graphxify',
  og_description      = 'A responsive travel platform redesigned to simplify the booking experience and drive conversion — delivered by Graphxify for FlyUp Line.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'FlyUp Line travel platform — web design and UX strategy by Graphxify',
  twitter_title       = 'FlyUp Line — Travel Platform Redesign | Graphxify',
  twitter_description = 'A responsive travel platform redesigned to simplify the booking experience and drive conversion — delivered by Graphxify for FlyUp Line.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug IN ('northline-enterprise-replatform', 'flyup-line');


-- ── Maven ────────────────────────────────────────────────────────────────────
UPDATE works SET
  meta_title          = 'Maven — Women''s Fashion Brand Identity Case Study | Graphxify',
  meta_description    = 'Graphxify built a complete brand identity for Maven — a contemporary women''s fashion label defined by typographic precision, restrained colour, and a confident visual language.',
  og_title            = 'Maven — Women''s Fashion Brand Identity | Graphxify',
  og_description      = 'A complete brand identity system for a contemporary women''s fashion label — built on typographic precision, restrained colour, and a confident visual language.',
  og_image            = COALESCE(cover_image_url, og_image),
  og_image_alt        = 'Maven brand identity — logo, typography, and design system by Graphxify',
  twitter_title       = 'Maven — Women''s Fashion Brand Identity | Graphxify',
  twitter_description = 'A complete brand identity system for a contemporary women''s fashion label — built on typographic precision, restrained colour, and a confident visual language.',
  twitter_image       = COALESCE(cover_image_url, twitter_image, og_image),
  twitter_card        = 'summary_large_image'
WHERE slug IN ('vertex-brand-operations', 'maven');


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
WHERE slug IN ('axis-growth-platform', 'boss-medical-clinic', 'boss-raam-pharmacy');


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
WHERE slug IN ('lumen-commerce-redesign', 'pharmacy-on-king', 'orion-saas-relaunch');


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
WHERE slug IN ('atlas-fintech-experience-hub', 'luka-hair-salon', 'solace-investor-relations-portal');


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
WHERE slug IN ('meridian-health-network-portal', 'king-medical-art-pharmacy', 'kite-commerce-experience-refresh');


-- ── Verification — run this after the UPDATEs to confirm ────────────────────
-- Shows slug, which text fields are filled, and which image fields are filled.
-- Replace the SELECT below in a new query tab:
--
-- SELECT
--   slug,
--   LEFT(meta_title, 40)   AS meta_title,
--   LEFT(og_title, 40)     AS og_title,
--   LEFT(og_image, 60)     AS og_image,
--   twitter_card,
--   LEFT(canonical_url, 50) AS canonical_url
-- FROM works
-- ORDER BY updated_at DESC;
