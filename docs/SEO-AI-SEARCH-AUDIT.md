# Graphxify — SEO & AI-Search Technical Audit

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

**Date:** 2026-09-29
**Scope:** this repository (Next.js app + Supabase CMS content), a local production build run against the live published CMS data (read-only, public key), and read-only checks against `https://www.graphxify.com`.
**Companion docs:** [implementation report](SEO-AI-SEARCH-IMPLEMENTATION-REPORT.md) · [content trust](CONTENT-TRUST-AUDIT.md) · [entity data needed](ENTITY-DATA-NEEDED.md) · [content gaps](CONTENT-GAPS.md)

Nothing here guarantees rankings, AI Overview inclusion or AI citations. The aim is to remove technical obstacles and make the site's real facts easy for machines to read.

---

## Starting state (before any change)

| Check | Result |
|---|---|
| Git | **Not a git repository** (ZIP download). The original tree was backed up before editing. |
| `npm run lint` | Pass: 0 errors, 13 warnings (unused vars, pre-existing) |
| `npm run typecheck` | Pass |
| Tests | **None exist.** There is no test runner or test files. |
| `npm run build` (no env) | **Fails.** `supabaseKey is required` while collecting `/blog/[slug]`. This is expected locally without Supabase env vars. Production (Vercel) has them. |
| `npm run build` (public env vars) | Pass. 77 static pages, 6 blog posts, 12 `/works/*` paths (6 of them duplicate aliases, see finding W1). |

## Architecture (A)

| Item | Finding |
|---|---|
| Framework | Next.js **16.2.10**, **App Router**, React 18.3, TypeScript strict, Tailwind 3, framer-motion, lenis |
| Build | `next build --webpack`. Hosting is Vercel (`vercel.json` cron, `@vercel/analytics`, `@vercel/speed-insights`). |
| Data | Supabase (Postgres + Storage). Public reads use a cookie-free client, so pages stay ISR-eligible. |
| CMS | A custom `/dashboard` for posts, works, testimonials, marquee, users and settings, with version history. |
| Routing | `(marketing)` group: `/`, `/about`, `/services` + 4 service pages, `/works` + `/works/[slug]`, `/blog` + `/blog/[slug]`, `/process`, `/contact`, `/privacy`, `/terms`, `/resources/website-growth-checklist`, `/review` (noindex). Private: `/dashboard`, `/admin`, `/auth`, `/api`, `/newsletter`, `/reset-password`. |
| Metadata | `buildMetadata()` in `src/lib/seo.ts`. It covers title, description, canonical, OG and Twitter, with per-field CMS overrides. There is a generated 1200×630 OG card at `/og`. |
| Robots / sitemap | `src/app/robots.ts`, `src/app/sitemap.ts` (native Metadata routes) |
| Structured data | `JsonLd` component with XSS-safe escaping. Organization + WebSite on every marketing page. Service and Breadcrumb on service pages. BlogPosting on posts. HowTo on /process. |
| Redirects | `next.config.ts` `redirects()`. All are permanent (Next emits **308**, which Google treats like 301). |
| Middleware | `src/proxy.ts`. Matcher is dashboard/admin/auth/api only, so it never touches public pages or crawlers. |
| Analytics | Vercel Web Analytics and Speed Insights, each behind an env flag. **No GA4**, no consent banner, no custom events. |
| Images | `next/image`, AVIF/WebP. Supabase storage images were forced `unoptimized` (finding P1). |
| Fonts | System fonts. No web-font loading cost. |
| Rendering | ISR (`revalidate` 30–3600 s). `/blog/[slug]` and `/works/[slug]` use `dynamicParams = false`. |
| Headers | Security headers (HSTS preload, XFO, nosniff, Referrer-Policy, Permissions-Policy). `X-Robots-Tag: noindex` on private paths. No CSP (documented as a known gap). |

## Severity summary

| Severity | Count |
|---|---|
| CRITICAL | 1 |
| HIGH | 7 |
| MEDIUM | 16 |
| LOW | 12 |
| INFORMATIONAL | 6 |

"Implemented" means fixed in this pass. "Doc" means the fix needs Daniel's facts or a product decision. Details are in the linked documents.

---

## Findings

### B–C · Crawlability & indexability

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| K1 | **CRITICAL** | `src/app/(marketing)/loading.tsx` (every marketing page) | The empty `loading.tsx` (it rendered `null`) created a Suspense boundary. In the initial HTML every page's `<main>` was **empty** (`<template id="B:0">`), and the real content (H1, copy, links) sat in `<div hidden id="S:0">` **after the footer** until JavaScript swapped it in. Crawlers and AI fetchers that don't run JS saw hidden, out-of-order content outside `<main>`. | Removed the file. It had no visual effect. Verified: 0 of 21 pages now contain a hidden stream block, and H1/content sit inside `<main>` before `<footer>`. | Implemented |
| K2 | MEDIUM | `components/marketing/home-sections.tsx` | The homepage projects slider used `next/dynamic` with a loading fallback. This was the same problem on a smaller scale: project links were streamed into a hidden div. | Imported the component directly. It was server-rendered anyway. | Implemented |
| K3 | MEDIUM | `components/marketing/deferred-home-islands.tsx` | Homepage testimonials and the quick lead form are `ssr: false` and mount on scroll. Testimonial text is not in the HTML. | Leave for now. Server-rendering the testimonial list is a design and perf trade-off, and testimonials must first be verified (see trust audit). | Doc |
| C1 | MEDIUM | `/blog/[slug]`, `/works/[slug]` | `dynamicParams = false` means a **newly published post or case study returns 404 until the next deploy**. Existing items update via ISR. | Keep, since it prevents soft-404s. Always redeploy after publishing new items, then submit to IndexNow (see [INDEXNOW-SETUP.md](INDEXNOW-SETUP.md)). An alternative is switching to `dynamicParams = true` with `notFound()`, which needs a production test. | Doc |
| C2 | INFO | live site | `graphxify.com` → `www` (308), `http` → `https` (308), trailing slash → no slash (308). The origin is consistent. | No change | — |

### D · robots.txt

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| D1 | MEDIUM | `src/app/robots.ts` | Only `*`, `GPTBot` (block) and `Google-Extended` (block) groups existed. Search and user-retrieval AI crawlers were allowed only implicitly. | Added an explicit allow group for **OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User**, with tokens verified against vendor docs. It repeats the private disallows, because a named group replaces `*`. | Implemented |
| D2 | INFO | same | Existing **training opt-outs** (GPTBot, Google-Extended) are a business decision. | **Preserved unchanged.** No new training policy was added (for example for ClaudeBot). Google-Extended does not affect Googlebot, Search or AI Overviews. GPTBot does not affect ChatGPT search. | Kept |
| D3 | MEDIUM | preview deployments | Vercel preview URLs served indexable copies of the site. | `robots.ts` returns `Disallow: /`, and `next.config.ts` adds `X-Robots-Tag: noindex`, when `VERCEL_ENV=preview`. Production is unaffected. | Implemented |
| D4 | INFO | all | CSS, JS, images, fonts and `/og` are not blocked. `/og` deliberately lives outside `/api`. | — | OK |

### E · Sitemap

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| E1 | MEDIUM | `src/lib/blog.ts`, `src/app/sitemap.ts` | Every blog post had the **same hardcoded `lastmod`** (2026-07-29), because `BlogPostSummary` dropped `updatedAt`. | Summary now carries `updatedAt`. Posts use the real CMS `updated_at`, falling back to `created_at`. | Implemented |
| E2 | LOW | sitemap | `/blog` and `/works` used a fixed date. The hardcoded works fallback emitted an invented `${year}-01-01`. | Indexes use their newest item's date. The fallback emits no `lastmod`. Legal pages use their own "Last updated" date. | Implemented |
| E3 | INFO | sitemap | Contains only canonical, indexable URLs. `/review` (noindex), aliases, private routes and API are correctly absent. | Service URLs now come from one catalogue. Published industry pages (none yet) are added automatically. | Implemented |

### F · Canonicals

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| F1 | MEDIUM | `src/app/layout.tsx` | The root layout called `buildMetadata({path:"/"})`, so every route without its own canonical **inherited `canonical: /`**. That included 404 pages and the dashboard. The 404 page also carried the homepage title and an off-brand "enterprise-grade" description. | Root layout now sets only `metadataBase` and defaults, with no canonical. The 404 page has its own title and noindex. | Implemented |
| F2 | INFO | all public pages | Self-referencing absolute canonicals on `https://www.graphxify.com`. Sitemap, OG `url` and JSON-LD `url`/`@id` all come from one helper (`canonicalUrl()`), so they match. | — | OK |
| F3 | INFO | `/blog/local-seo-*` | **The suspected Local SEO duplicate is already resolved.** Only `local-seo-getting-found-on-google` exists in the CMS and sitemap. `/blog/local-seo-canadian-businesses-getting-found-google` is a single-hop 308 to it on production (verified), with no chain. | No change. The redirect is kept. | Verified |

### G · Redirects

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| W1 | **HIGH** | `/works/[slug]` | Internal case-study slugs (6 serving 200 in production; 4 further legacy aliases 404) (for example `/works/axis-growth-platform`, `/works/northline-enterprise-replatform`) were **prerendered as HTTP 200 pages** carrying a client-side `<meta http-equiv="refresh">`. Next's `redirect()` inside a static page becomes a soft redirect. The result was duplicate indexable URLs, confirmed on production. | Real permanent redirects generated from `legacyWorkPathRedirects()` in `next.config.ts`. `generateStaticParams` now emits only public path slugs. The in-page fallback uses `permanentRedirect()`. All 16 redirects verified as single hops. | Implemented |
| G1 | INFO | `next.config.ts` | Existing redirects (`/index`, `/work`, `/flyupline`, `/mbmdesigns`, `/pricing`, Canada-legacy blog slugs) are permanent, single hop and loop-free. | Kept | OK |

### H · Metadata

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| H1 | MEDIUM | `src/lib/constants.ts` | The brand suffix was "**GRAPHXIFY**", while CMS titles, copy and the © line use "**Graphxify**". Titles also double-branded, for example "About Graphxify – … \| GRAPHXIFY". | `siteConfig.name = "Graphxify"`, with `alternateName: "GRAPHXIFY"` in schema. About and Contact titles rewritten. No duplicate titles or descriptions across the 21 audited pages. | Implemented |
| H2 | **HIGH** | CMS `og_image` on all 6 posts | Every post's OG image override pointed to a **placeholder SVG** (`/assets/post-1..3.svg`). Facebook, LinkedIn and X don't render SVG, so shares had blank previews even though real PNG covers exist. | `buildMetadata` ignores SVG share images and falls back to the cover photo, then the generated card. Recommend clearing those CMS fields. | Implemented |
| H3 | LOW | posts | No `article:modified_time`. The feed was not discoverable. | Added `modifiedTime` from CMS `updated_at`, plus `<link rel="alternate" type="application/atom+xml">` on /blog and posts. OG image alt now always set. | Implemented |

### I · Structured data

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| I1 | **HIGH** | `src/lib/seo.ts` | The Organization was typed `ProfessionalService`, which is a schema.org **subtype of LocalBusiness**, with no address. It had an unverified `priceRange: "$$"`. Its **logo was a generic placeholder SVG** (`/assets/logo-mark.svg`, not the Graphxify mark). No `@id` links existed: every Service and BlogPosting re-declared a separate, disconnected Organization. | One graph: `Organization` `#organization` (real 512² PNG mark, verified email/phone/area/sameAs, `makesOffer` → the 4 Services), `WebSite` `#website` → publisher. Service, BlogPosting, CreativeWork, Blog and CollectionPage all reference `#organization`. No SearchAction (there's no site search). | Implemented |
| I2 | **HIGH** | `/works/[slug]` | **Case studies had no structured data.** | `CreativeWork` (`#work`): creator/publisher → org, `dateCreated` (CMS year), `about` (industry), `keywords` (services), real images (placeholders excluded), live site as `mentions`. Plus BreadcrumbList. | Implemented |
| I3 | MEDIUM | `/blog/[slug]` | `datePublished` fell back to `new Date()` (fake freshness). The author was a disconnected Organization. | Real CMS dates only. The "Graphxify Team" byline maps to `#organization`, and a named author maps to Person with name only. Added `@id`, `isPartOf` Blog, `wordCount`. | Implemented |
| I4 | MEDIUM | `/process` | `HowTo` described Graphxify's internal workflow, not instructions for the reader. This misapplies the type. | Removed. The breadcrumb is kept. | Implemented |
| I5 | LOW | `/blog`, `/works`, `/services` | No list-level entities. | `Blog` + blogPost list, `CollectionPage` + ItemList of case studies, `ItemList` of Service entities, and breadcrumbs. | Implemented |
| I6 | INFO | — | No FAQPage, Review, AggregateRating, LocalBusiness or Person markup, and none was added. There's no eligible or verified data (see [ENTITY-DATA-NEEDED.md](ENTITY-DATA-NEEDED.md)). | — | Correct |

Validation: all JSON-LD blocks on 24 rendered routes parse as JSON. One Organization per page, all with the same `@id`. Every `@id` reference is either defined on the page or carries its own type, name and URL.

### J · Internal links, T · Orphans, U · Broken links

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| J1 | LOW | site-wide | Services are linked from the header dropdown, footer and home cards. Service pages link to case studies and posts, and posts link to a related service. Every indexable page is linked from the footer or a parent. No orphans (`/review` is intentionally unlinked and noindex). | — | OK |
| J2 | MEDIUM | `/services/cms-architecture` | The only service page with **no related case study**. | Needs a real CMS case study (Graphxify's own site is a candidate). See CONTENT-GAPS. | Doc |
| J3 | LOW | `/works/[slug]` | Case studies link to services (info rail) but not to relevant articles. | Content recommendation | Doc |
| J4 | INFO | links | No broken internal links found in rendered HTML. All internal links point to final URLs (no redirect hops). | — | OK |
| J5 | LOW | blog post | Added a visible, accessible breadcrumb (Blog / current post), matching the service-page style. | — | Implemented |

### K · Content rendering, L · JS dependency

See K1–K3. Search-critical copy (services, process, case-study narrative, posts, FAQs) is server-rendered HTML. The service FAQs use `<dl>`, and the home FAQs use `<details>`, which is in the HTML. Animations are CSS/transform-based and do not hide text from the DOM.

### M · Mobile

| ID | Sev | Where | Finding | Status |
|---|---|---|---|---|
| M1 | INFO | all | Responsive, mobile nav, viewport OK, no horizontal overflow found. Lighthouse SEO is 100 on all tested pages. | OK |
| M2 | LOW | `/services/web-design` | Lighthouse "font-size": 58% legible text (tiny uppercase labels at 0.56–0.62rem). This is a design choice. Consider a 12 px minimum for labels. | Doc |

### N · Accessibility

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| N1 | MEDIUM | `header.tsx` | The Services submenu opened on **hover only** (visibility hidden), so keyboard users couldn't reach it. Navs had no labels. | `group-focus-within` opens it on focus. Added "Primary" and "Mobile" nav labels. | Implemented |
| N2 | MEDIUM | `footer.tsx` | Footer used `h3`/`h4` in a page with no `h2` context (and, because of K1, *before* the H1 in DOM order). | Tagline → `p`. Group titles → `h2` inside labelled `<nav>`s. Same classes, no visual change. | Implemented |
| N3 | MEDIUM | cards (8 places) | `aria-label="Open project X"` / `"Open blog X"` did not contain the visible text (WCAG 2.5.3, flagged by Lighthouse). | Removed. The link is named by its visible title. | Implemented |
| N4 | MEDIUM | blog body links | Links distinguished by colour only (WCAG 1.4.1). | Subtle underline added. | Implemented |
| N5 | LOW | `/works/[slug]` | "Case Study", "Overview", "Challenge" and similar labels were `<p>`. | Now `h2`/`h3` with identical styling. | Implemented |
| N6 | LOW | 404 | No `h1`. | `h1` "404 — Page not found" (visually unchanged) plus recovery links. | Implemented |
| N7 | INFO | forms | All inputs labelled, errors inline, reduced-motion respected by motion components. | — | OK |

Lighthouse accessibility after the changes: 100 on home, case study, blog post and service page.

### O · Image SEO, 41 · Visual search

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| O1 | MEDIUM | `/works/[slug]` | Gallery alt text was "`Title visual 3`". Hero alt was just the title. | "`FlyUp Line project by Graphxify, gallery image 3`" and "`… project cover image by Graphxify`". The real image content is unknown to code, so a per-image alt needs the CMS field (see the draft migration). | Implemented (partial) |
| O2 | LOW | `/works/[slug]` | The gallery repeats the same images to fill 6 layout slots, so duplicate images appear on the page. | Layout decision. Upload 6 distinct images per project. | Doc |
| O3 | INFO | all | Portfolio images are real `<img>` (next/image), not CSS backgrounds. They have captions and context (title, industry, services) around them. | — | OK |

### P · Performance, Q · Core Web Vitals

| ID | Sev | Where | Finding | Fix | Status |
|---|---|---|---|---|---|
| P1 | **HIGH** | `lib/content-helpers.ts` | All Supabase CMS images were served **`unoptimized`**, as full-size 0.7–1.4 MB PNG/JPG originals. The FlyUp Line case study weighed **6,979 KiB**. Lab LCP was 7.3 s (case study) and 11.6 s (blog post). | Supabase images now go through next/image (AVIF/WebP, resized). Example: 675 KB → 58 KB. There's an escape-hatch env var. **Result: case study 627 KiB, LCP 3.2 s, Perf 94. Blog post LCP 4.9 s, Perf 82.** | Implemented |
| P2 | LOW | `/`, service pages | Text LCP shows a ~3 s "render delay" in Lighthouse's simulated throttling, with FCP 0.9 s. There's no web font, no hidden initial style, and no theme flip. This is likely a lab artefact. | Verify with field data (Speed Insights / CrUX) before changing anything. | Doc |
| P3 | LOW | all | About 110 KiB of unused JS (framer-motion, lenis) and legacy polyfills. This is typical, and TBT is 10–20 ms. | No action needed now. | Doc |
| P4 | INFO | — | CLS is 0 on all tested pages. | — | OK |

### R · Duplicates, S · Thin pages

| ID | Sev | Where | Finding | Status |
|---|---|---|---|---|
| R1 | — | works aliases | See W1 (fixed). | Implemented |
| S1 | MEDIUM | `/works/*` | Case studies render only about **230–320 words**, with no metrics, testimonials, timeline detail or technologies. | Doc (CONTENT-GAPS) |
| S2 | LOW | `/resources/website-growth-checklist` | About 240 words, and it had a nested `<main>`. | Nested main fixed. Content: Doc |
| S3 | INFO | — | No tag archives, no city pages, no doorway pages. | OK |

### V · Entity consistency, 43 · Contact info

| ID | Sev | Where | Finding | Status |
|---|---|---|---|---|
| V1 | MEDIUM | copy | Positioning alternates between "**independent design studio**" (hero, OG, About) and "**web design and branding agency**" (meta descriptions, schema). | Doc. Daniel to pick a preferred phrasing. |
| V2 | LOW | footer, contact, terms | Phone shown as "(647)-570-0334" in some places and "+1 (647) 570-0334" in others. | Implemented (normalised to `+1 (647) 570-0334`) |
| V3 | MEDIUM | CMS vs code | Conflicting facts: FlyUp Line year **2022** (CMS) vs 2025 (code). Pharmacy On King 2024 vs 2025. Luka Hair Salon 2023 vs 2026. King Medical Arts 2023 vs 2026. Maven "Women's Fashion" vs "Fashion and Streetwear". "BOSS" vs "Boss" Medical Clinic. CMS `location` is "**Canada**" for every project while the page shows "Remote". Unused `components/ui/demo.tsx` says "**Mississauga, Ontario**". Dashboard default `site_url` is non-www. | Doc ([ENTITY-DATA-NEEDED.md](ENTITY-DATA-NEEDED.md)). Nothing was silently chosen. Schema uses the CMS values actually rendered. |
| V4 | **HIGH** | `lib/project-details.ts` | The fallback project data contains **template placeholder content**: invented metrics ("31% conversion lift", "42% pipeline growth") and testimonials attributed to fictional people at fictional companies ("Northline", "Vertex", "Axis", "Lumen", "Atlas", "Meridian"). **This is not rendered today** (only the unused `project-detail-renderer.tsx` reads it). If that renderer is ever re-wired, fabricated proof would go live. | Doc. Recommend deleting those fields (see trust audit). |
| V5 | **HIGH** | `lib/constants.ts`, home | Unverified trust figures: "26+ projects", "98% client satisfaction", "10M Gross Revenue" (fallback metrics), "24h response". | Doc ([CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md)) |

### W · Case-study structure, X · Services, Y · Blog

- **W:** The CMS already supports industry, platform, timeline, location, live URL, overview/challenge/approach/solution/result and all SEO/OG fields. It is missing client name, market, technologies, image alt text, testimonial and a real `published_at`. There's a draft migration in `supabase/drafts/seo-content-fields.sql`, **not applied**.
- **X:** There are 4 genuine service pages, each with deliverables, "best for", related work, related posts, FAQ and CTA. Gaps are listed in CONTENT-GAPS.
- **Y:** There are 6 posts, all "Graphxify Team". `created_at` is used as the publish date. Posts contain unsourced statistics (trust audit). There was no feed; an Atom feed is now at `/feed.xml`.

### Z · AI crawler accessibility

| ID | Sev | Finding | Status |
|---|---|---|---|
| Z1 | INFO | Live check: `/` returns 200 for Googlebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot and GPTBot user-agent strings. There's no WAF challenge on those UAs. GPTBot is disallowed by robots policy, not by the server. | OK |
| Z2 | — | K1 was the real AI-readability problem (content hidden until JS runs) and is fixed. `/llms.txt` was added as an optional, factual map. | Implemented |
| Z3 | — | Verification procedure for Vercel, Cloudflare and firewall: [AI-CRAWLER-VERIFICATION.md](AI-CRAWLER-VERIFICATION.md). | Doc |

### 38 · Security (unchanged)

The existing security headers were kept. No secrets were added to client bundles. The IndexNow key is server-only, and its key file returns 404 until configured. `noindex` / `X-Robots-Tag` usage was reviewed: it's applied only to private paths, `/review`, 404s, unknown slugs and (new) preview deployments. No production content page is excluded.
