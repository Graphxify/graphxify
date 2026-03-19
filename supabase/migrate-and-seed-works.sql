-- ============================================================
-- Combined migration + content seed for works case study fields
-- Run once in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cajxvhcrfgpyyqohlkfp/sql/new
-- ============================================================

-- Step 1: Add missing columns (safe to re-run)
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

-- Step 2: Populate content for each work

-- Maven (e6ccee33)
update public.works set
  industry    = 'Fashion and Streetwear',
  platform    = 'Brand Identity System',
  timeline    = '4 Weeks',
  location    = 'Canada',
  featured    = true,
  sort_order  = 1,
  card_outcome = 'Complete brand identity system for a minimalist streetwear label.',
  card_services = ARRAY['Brand', 'Design System'],
  overview    = 'Maven is a minimalist streetwear concept built around bold typography, controlled colour, and a strong editorial perspective. Graphxify was responsible for crafting the full brand identity and visual system, establishing a foundation that extends across garments, packaging, and digital touchpoints with consistency and intent.',
  challenge   = 'The streetwear space is highly saturated, where visual noise often replaces identity. Maven required a system that felt distinctive without relying on trend-driven elements, while remaining flexible enough to scale across multiple formats without losing its core aesthetic.',
  approach    = 'We anchored the identity in typography as the primary expression of the brand. Every visual decision was derived from this foundation, with a restrained colour palette and structured compositions used to maintain clarity, hierarchy, and control across all applications.',
  solution    = 'Graphxify delivered a complete identity system including primary and secondary logotypes, typographic lockups, colour palette, and comprehensive usage guidelines. The system was built to perform consistently across apparel, packaging, and digital media at any scale.',
  result      = 'Maven launched with a visual identity that reads as established and intentional. The system provides long-term flexibility while maintaining a distinct point of view, allowing the brand to expand without compromising its core aesthetic.',
  updated_at  = now()
where id = 'e6ccee33-2907-4ac3-8dd6-877c09a8893d';

-- FlyUp Line (e04a5a54)
update public.works set
  industry    = 'Travel and Aviation',
  platform    = 'Web',
  timeline    = '3–4 Weeks',
  location    = 'Canada',
  featured    = true,
  sort_order  = 2,
  card_outcome = 'Responsive travel platform with a streamlined booking flow and strong conversion focus.',
  card_services = ARRAY['Website Design', 'UX Strategy'],
  overview    = 'FlyUp Line is a travel platform focused on affordable flights and efficient service. The objective was to design a website that builds immediate trust while guiding users toward booking with minimal friction.',
  challenge   = 'Travel platforms often overwhelm users with excessive information and unclear flows. The challenge was to simplify the experience while maintaining functionality and clarity across all booking stages.',
  approach    = 'We focused on reducing friction through clear hierarchy and intuitive navigation. Content and interface elements were structured to guide users naturally from search to action without unnecessary distractions.',
  solution    = 'Graphxify developed a responsive platform with a streamlined booking flow, strong call-to-action placement, and optimized performance across devices.',
  result      = 'FlyUp Line now presents as a credible and efficient travel platform. The improved structure enhances user confidence and supports a smoother path to conversion.',
  updated_at  = now()
where id = 'e04a5a54-94c5-4352-92d4-a8a95b430dea';

-- Pharmacy On King (470df87a)
update public.works set
  industry    = 'Healthcare / Pharmacy',
  platform    = 'Web',
  timeline    = '2–3 Weeks',
  location    = 'Canada',
  featured    = false,
  sort_order  = 3,
  card_outcome = 'Accessible, trust-focused website for a community pharmacy.',
  card_services = ARRAY['Website Design', 'UI/UX'],
  overview    = 'Pharmacy on King is a community-focused pharmacy offering essential healthcare services. The objective was to design a website that communicates reliability while making information easily accessible to all patients.',
  challenge   = 'Healthcare websites often suffer from cluttered layouts and unclear navigation. The challenge was to simplify the experience while ensuring all critical information remains accessible and easy to find.',
  approach    = 'We prioritized structure and readability, organizing content into clear sections supported by consistent typography and spacing that directs users to what they need without friction.',
  solution    = 'Graphxify created a responsive website with intuitive navigation, clear service presentation, and optimized usability across all device sizes.',
  result      = 'The platform reinforces trust and improves accessibility, allowing patients to navigate and engage with the pharmacy with confidence and ease.',
  updated_at  = now()
where id = '470df87a-8b1a-4b93-aebd-c4a404d6cee8';

-- Boss Medical Clinic (d8066f0c — previously BOSS RAAM Pharmacy)
update public.works set
  industry    = 'Healthcare / Medical Clinic',
  platform    = 'Web',
  timeline    = '3–4 Weeks',
  location    = 'Canada',
  featured    = false,
  sort_order  = 4,
  card_outcome = 'Professional clinic website balancing authority with accessible usability.',
  card_services = ARRAY['Website Design', 'Branding'],
  overview    = 'Boss Medical Clinic offers a range of medical services and needed a platform that reflects professionalism while presenting information in a structured and accessible way for patients.',
  challenge   = 'The primary challenge was balancing credibility with usability — avoiding overly complex layouts while maintaining a strong professional presence that builds patient trust.',
  approach    = 'We focused on hierarchy and clarity, ensuring users can quickly understand the services available and navigate without confusion, supported by a clean and authoritative visual language.',
  solution    = 'Graphxify delivered a responsive website with a service-driven layout, clear content structure, and an optimized user experience that communicates competence at every touchpoint.',
  result      = 'The clinic now has a digital presence that strengthens trust and improves patient engagement, presenting as a credible and approachable medical provider.',
  updated_at  = now()
where id = 'd8066f0c-b7dc-4dd1-b2e1-8f871c20e0a2';

-- King Medical Arts Pharmacy (6a0939ac)
update public.works set
  industry    = 'Healthcare / Pharmacy',
  platform    = 'Web',
  timeline    = '2–3 Weeks',
  location    = 'Canada',
  featured    = false,
  sort_order  = 5,
  card_outcome = 'Refined, accessible pharmacy website with improved patient usability.',
  card_services = ARRAY['Website Design', 'UI/UX'],
  overview    = 'King Medical Arts Pharmacy provides essential healthcare services and needed a website that improves accessibility while maintaining a professional and trustworthy tone.',
  challenge   = 'The previous experience lacked structure, making it difficult for patients to access key information efficiently and navigate the available services.',
  approach    = 'We simplified the user journey through structured layouts, consistent spacing, and clear typographic hierarchy that guides patients to the information they need quickly.',
  solution    = 'Graphxify created a responsive website with streamlined navigation, clear service presentation, and improved usability across all devices.',
  result      = 'The updated platform enhances accessibility and reinforces the pharmacy''s credibility, creating a more effective and trustworthy digital presence.',
  updated_at  = now()
where id = '6a0939ac-2725-4d15-95bc-2275e90f2596';

-- Luka Hair Salon (93fa6f31)
update public.works set
  industry    = 'Beauty / Hair Salon',
  platform    = 'Web',
  timeline    = '2–3 Weeks',
  location    = 'Canada',
  featured    = false,
  sort_order  = 6,
  card_outcome = 'Modern salon brand and website that elevates client perception and drives bookings.',
  card_services = ARRAY['Website Design', 'Branding'],
  overview    = 'Luka Hair Salon offers professional hair services and needed a website that communicates quality while attracting new clients through a strong and modern visual presence.',
  challenge   = 'Salon websites often rely heavily on visuals but lack structure. The challenge was to maintain a strong aesthetic while ensuring usability and clear navigation for prospective clients.',
  approach    = 'We combined visual simplicity with structured layouts, allowing imagery and content to work together cohesively without overwhelming the user or diluting the brand.',
  solution    = 'Graphxify designed a responsive website with clear service sections, strong visual hierarchy, and optimized booking pathways that make it easy for clients to take action.',
  result      = 'The salon now presents a polished and modern brand image, improving client perception and engagement while supporting a stronger path to new bookings.',
  updated_at  = now()
where id = '93fa6f31-edac-4c33-818b-5c4226646576';

-- Notify PostgREST to reload schema cache
notify pgrst, 'reload schema';
