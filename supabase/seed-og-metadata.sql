-- Seed OG / Twitter / canonical metadata for known CMS works.
-- Run AFTER og-seo-fields.sql migration.
-- Uses slug matching so it is safe if a record does not exist.
-- Idempotent: UPDATE … WHERE slug = '…' only affects matching rows.

-- ── FlyUp Line ─────────────────────────────────────────────────────────────
UPDATE works SET
  og_title            = 'FlyUp Line — Travel Platform Redesign | Graphxify',
  og_description      = 'A responsive travel platform redesigned to simplify the booking experience and drive conversion — delivered by Graphxify for FlyUp Line.',
  og_image_alt        = 'FlyUp Line travel platform — web design and UX strategy by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'northline-enterprise-replatform';

-- ── Maven ──────────────────────────────────────────────────────────────────
UPDATE works SET
  og_title            = 'Maven — Women''s Fashion Brand Identity | Graphxify',
  og_description      = 'A complete brand identity system for a contemporary women''s fashion label — built on typographic precision, restrained colour, and a confident visual language.',
  og_image_alt        = 'Maven brand identity — logo, typography, and design system by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'vertex-brand-operations';

-- ── BOSS Medical Clinic ─────────────────────────────────────────────────────
UPDATE works SET
  og_title            = 'BOSS Medical Clinic — Healthcare Web Design | Graphxify',
  og_description      = 'A professional, accessible website for a medical clinic — designed to communicate trust, simplify service navigation, and convert patients online.',
  og_image_alt        = 'BOSS Medical Clinic website — healthcare web design by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'axis-growth-platform';

-- ── Pharmacy On King ───────────────────────────────────────────────────────
UPDATE works SET
  og_title            = 'Pharmacy On King — Healthcare Web Design | Graphxify',
  og_description      = 'A clean, structured website for a community pharmacy — built to surface services, hours, and contact information clearly across every device.',
  og_image_alt        = 'Pharmacy On King website — healthcare web design by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'lumen-commerce-redesign';

-- ── Luka Hair Salon ────────────────────────────────────────────────────────
UPDATE works SET
  og_title            = 'Luka Hair Salon — Beauty Brand & Web Design | Graphxify',
  og_description      = 'Brand identity and website for an upscale hair salon — designed to project confidence, elegance, and make booking effortless for clients.',
  og_image_alt        = 'Luka Hair Salon brand and website — beauty design by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'atlas-fintech-experience-hub';

-- ── King Medical Arts Pharmacy ─────────────────────────────────────────────
UPDATE works SET
  og_title            = 'King Medical Arts Pharmacy — Healthcare Web Design | Graphxify',
  og_description      = 'A professional pharmacy website designed to make services, location, and contact easy to find — built for clarity, trust, and mobile performance.',
  og_image_alt        = 'King Medical Arts Pharmacy website — healthcare web design by Graphxify',
  twitter_card        = 'summary_large_image'
WHERE slug = 'meridian-health-network-portal';
