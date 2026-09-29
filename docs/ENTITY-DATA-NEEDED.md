# Entity data needed from Daniel

> **2026-09-29 update:** the CMS data fix and the blog review are **done** (production cleanup). Still open: founder details, founding year, LinkedIn company URL, the Maven `overview` wording, and the optional items (Maven/B.O.S.S. years, client locations, measurable outcomes, testimonial companies).


## Status (2026-09-29, after Daniel's answers)

**RESOLVED:**
- Positioning: "web design and development agency".
- Company location: "Based in Canada · Working worldwide" (country only, no office, no LocalBusiness).
- Response time: typically within 24 hours.
- Project years for FlyUp Line, Pharmacy On King, Luka Hair Salon and King Medical Arts.
- Maven industry: Fashion.
- Official name: B.O.S.S. Medical Clinic.
- FlyUp Line branding: confirmed.
- CMS `location` meaning: client location / market.
- All 8 testimonials confirmed.
- All 10 marquee logos confirmed.

**STILL REQUIRES ACTION** (optional data is not an error):
- [ ] Run `supabase/drafts/confirmed-facts-2026-09-29.sql`, so the CMS matches the confirmed facts.
- [ ] Review the blog claims in [BLOG-CLAIMS-FOR-REVIEW.md](BLOG-CLAIMS-FOR-REVIEW.md).
- [ ] Founder: name, role, bio, photo, profiles (§2), which unlocks Person schema.
- [ ] Founding year (§3).
- [ ] Official LinkedIn company URL, and any other active profiles (§3), for `sameAs`.
- [ ] Optional: delivery years for Maven and B.O.S.S. Medical Clinic (both agree at 2025 / 2024 but weren't confirmed, so they're not published in schema).
- [ ] Optional: real client locations/markets per project, if they should be shown.
- [ ] Optional: measurable case-study outcomes (with source), and technologies per project (§4).
- [ ] Optional: company names for testimonials 5–8.
- [ ] Optional: rewrite Maven's `challenge` paragraph if it shouldn't read as women's fashion.

The sections below are the original questionnaire, kept for history. Items marked as resolved above take precedence.

---

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

The structured data now describes Graphxify using **only facts found in the codebase**. The items below are either missing or contradictory. Nothing was invented or guessed to fill them. Each answer unlocks a specific, legitimate improvement.

## 1. Conflicts to resolve (pick one value)

| # | Fact | Values found | Where | What depends on it |
|---|---|---|---|---|
| 1 | **Positioning noun** *(QC: resolved for machine-facing text: "web design and development agency"; "studio" stays in creative copy)* | "independent design **studio**" (home hero, About, OG) vs "web design and branding **agency**" (meta descriptions, schema, blog bios) | copy site-wide | One consistent description in `siteConfig.description`, schema and meta. Both can coexist naturally (for example "an independent web design and branding studio"), but pick the lead term. |
| 2 | **Where Graphxify operates** *(QC: resolved: "Based in Canada. Working with businesses worldwide." Country-only schema address, no office)* | "Remote · Worldwide" (footer, case-study rail) vs "Mississauga, Ontario" (unused `components/ui/demo.tsx`), timezone "America/Toronto" (dashboard default), a Toronto-area phone number (647) | footer, demo component, settings | Whether a real, public business address exists. Without one, Graphxify stays `Organization` with `areaServed: Worldwide`, which is correct for a remote studio. **Do not publish a home address just for SEO.** |
| 3 | **CMS `location` on works** *(QC: no longer exposed; see PROJECT-DATA-CONFLICTS.md)* | "Canada" on all 6 projects vs "Remote" hardcoded on the page | CMS `works.location`, `works/[slug]/page.tsx` | Is this the *client's* market or Graphxify's location? If it's the client market, rename it `market` (draft migration) and show it. Until then the page keeps showing "Remote". |
| 4 | **Project years** | FlyUp Line 2022 (CMS) / 2025 (code). Pharmacy On King 2024 / 2025. Luka Hair Salon 2023 / 2026. King Medical Arts 2023 / 2026. | CMS `works.year` vs `lib/project-details.ts` | `dateCreated` in CreativeWork schema uses the CMS value. Confirm or correct it in the CMS. |
| 5 | **Maven industry** | "Women's Fashion" (card, CMS) vs "Fashion and Streetwear" / "streetwear label" (detail copy) | `project-card-content.ts`, `project-details.ts`, CMS | Industry text in schema and titles. |
| 6 | **BOSS vs Boss Medical Clinic** *(RESOLVED: official name "B.O.S.S. Medical Clinic")* | "BOSS Medical Clinic" (CMS title, meta) vs "Boss Medical Clinic" (card title, H1) | CMS, `project-card-content.ts` | The client's own spelling. Use whatever their brand uses. |
| 7 | **Canonical URL in dashboard settings** | `https://graphxify.com` (non-www) | `dashboard/settings/settings-actions.ts` defaults | Cosmetic. Set it to `https://www.graphxify.com`. |

## 2. Founder / team (for `Person` schema)

There is no founder or team information anywhere in the repo, only "a designer who also builds" in the About copy. **No Person markup was added.** To add a real founder entity (`Person` → `worksFor` → Graphxify, and `Organization.founder` → Person), provide:

- [ ] Full public name (as it should appear online)
- [ ] Role/title (for example "Founder & Creative Director")
- [ ] A 2–4 sentence factual bio (background, disciplines, years of experience, only if accurate)
- [ ] A headshot you're happy to publish (square, at least 400 px)
- [ ] Official personal profiles to use as `sameAs`: LinkedIn, Behance, Dribbble, personal portfolio
- [ ] Whether to show a visible founder section on /about. Schema should mirror visible content, not replace it.
- [ ] Whether blog posts should be bylined to the founder instead of "Graphxify Team". Only switch posts they actually wrote.

## 3. Organization facts (only add if true and public)

- [ ] **Founding year**, which unlocks `foundingDate`
- [ ] **Legal / registered business name**, if different from "Graphxify" (`legalName`)
- [ ] **LinkedIn company page URL** (currently empty in settings). Also Dribbble, Clutch, DesignRush and similar, once those profiles really exist. They go into `socialProfiles` in `src/lib/seo.ts`, the `sameAs` list.
- [ ] Confirmation that **Facebook, Instagram, TikTok and Behance** (`/Graphxify`, `@graphxify`) are the official, active accounts
- [ ] Whether `privacy@graphxify.com` (privacy page) is a monitored mailbox
- [ ] **Languages** served, if more than English

## 4. Case-study facts (per project)

For each of FlyUp Line, Maven, B.O.S.S. Medical Clinic, Pharmacy On King, King Medical Arts Pharmacy and Luka Hair Salon:

- [ ] Client's legal/brand name, if different from the project title
- [ ] Client market/country
- [ ] Technologies actually used (for example Next.js, Figma, Supabase, the CMS used)
- [ ] Real delivery timeline
- [ ] **Measured outcomes with a source** (for example "enquiries up X% in the 3 months after launch, per GA4"). Only real, client-approved numbers.
- [ ] A client testimonial **with written permission**, plus the author's name and role as they approve it
- [ ] 6 distinct gallery images (the layout currently repeats images to fill slots), each with a one-line description for alt text
- [ ] Permission to name the client and link their live site (already linked for 4 projects)

## 5. Trust figures on the homepage

Provide evidence for each, or approve rewording or removal (see [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md)):

- [ ] "26+ projects delivered". The portfolio shows 6 and the marquee names 6 brands, 3 of which have no case study.
- [ ] "98% client satisfaction rate" (fallback metric). How was it measured?
- [ ] "10M Gross Revenue" (fallback metric). Whose revenue, which currency, what period?
- [ ] "4 to 8 wks average launch" and "24h response time"
- [ ] The 4 fallback testimonials in `src/lib/constants.ts`. Are they real, verbatim and approved? Are the CMS testimonials the same people?
- [ ] Marquee client logos "MBM Interior & Exterior", "Beity Eats" and "Kaffecino". Were these real clients, and may their logos be shown?
