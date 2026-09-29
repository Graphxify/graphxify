# Pre-deployment QC report

> **Update 2026-09-29 (confirmed facts applied):** see §19 at the end. It supersedes the "Testimonials and logos", "Project data conflicts", "Location" and "Deployment safety verdict" sections, and parts of the trust-claims section.

**Date:** 2026-09-29 · **Status: NOT deployed.** This pass reviews and corrects the first SEO / AI-search pass ([implementation report](SEO-AI-SEARCH-IMPLEMENTATION-REPORT.md)). Where the two disagree, this report is authoritative.

Evidence came from the repository, the live CMS (read-only via the public publishable key; no writes), production (read-only HTTP requests), and a local production build.

## 1. Redirect audit

**Origin research:**

- `supabase/seed.sql` originally inserted six **template demo** case studies: "Northline Enterprise Replatform", "Vertex Brand Operations", "Axis Growth Platform", "Orion SaaS Relaunch", "Solace Investor Relations Portal" and "Kite Commerce Experience Refresh". They were published, with invented copy.
- `supabase/seed-works-seo.sql` later **overwrote those same database rows** with the six real client projects.
- The code (`project-card-content.ts`, `project-details.ts`) kept template-style names as internal keys: `northline-enterprise-replatform`, `lumen-commerce-redesign`, and so on.

**Current live CMS:** all six rows use the public slugs (`flyup-line`, `maven`, …). No row carries any old slug.

**Production today:**

- The 6 internal keys return **200** with the real case study and a canonical pointing to the real URL. They're duplicates.
- The 4 legacy aliases return **404**.
- `boss-raam-pharmacy` is a pre-existing 308.

| Old URL | Original content / origin | Destination | Semantically equivalent? | Action | Reason |
|---|---|---|---|---|---|
| `/works/northline-enterprise-replatform` | Seed demo "Northline Enterprise Replatform". The DB row was later repurposed as FlyUp Line; the code's internal key for FlyUp Line. **Production currently serves the FlyUp Line case study here (200).** | `/works/flyup-line` | **Yes** (identical content today) | **Keep 308** | Consolidates a live duplicate of the same page. The demo content no longer exists anywhere. |
| `/works/vertex-brand-operations` | Seed demo "Vertex Brand Operations" → row repurposed as Maven; internal key. Production serves Maven (200). | `/works/maven` | **Yes** | **Keep 308** | Same |
| `/works/axis-growth-platform` | Seed demo "Axis Growth Platform" → row repurposed as B.O.S.S. Medical Clinic; internal key. Production serves B.O.S.S. Medical Clinic (200). | `/works/boss-medical-clinic` | **Yes** | **Keep 308** | Same |
| `/works/lumen-commerce-redesign` | Code-only template key ("Lumen" demo in `project-details.ts`) used for Pharmacy On King. Production serves Pharmacy On King (200). | `/works/pharmacy-on-king` | **Yes** | **Keep 308** | Same |
| `/works/atlas-fintech-experience-hub` | Code-only template key ("Atlas" demo) used for Luka Hair Salon. Production serves Luka Hair Salon (200). | `/works/luka-hair-salon` | **Yes** | **Keep 308** | Same |
| `/works/meridian-health-network-portal` | Code-only template key ("Meridian" demo) used for King Medical Arts Pharmacy. Production serves it (200). | `/works/king-medical-art-pharmacy` | **Yes** | **Keep 308** | Same |
| `/works/boss-raam-pharmacy` | An earlier public slug of the **same** CMS record (`seed-works-seo.sql` matches it with `boss-medical-clinic`). A pre-existing redirect by the original developer. | `/works/boss-medical-clinic` | **Yes** (rename of the same client project) | **Keep 308** | Verified rename. It was already live. |
| `/works/northline-enterprise-platform` | Legacy alias of the Northline **demo** project. It appears only in the code alias map, never in the CMS. **Production: 404.** | — | **No** | **Removed. Stays 404.** | No real equivalent. Redirecting to FlyUp Line would be an irrelevant redirect (soft-404 risk). |
| `/works/orion-saas-relaunch` | Seed **demo** "Orion SaaS Relaunch" (unrelated to any client). **Production: 404.** | — | **No** | **Removed. Stays 404.** | Unrelated demo. It must not point at Pharmacy On King. |
| `/works/solace-investor-relations-portal` | Seed **demo** "Solace Investor Relations Portal". **Production: 404.** | — | **No** | **Removed. Stays 404.** | Unrelated demo |
| `/works/kite-commerce-experience-refresh` | Seed **demo** "Kite Commerce Experience Refresh". **Production: 404.** | — | **No** | **Removed. Stays 404.** | Unrelated demo |

**404 vs 410:** the four removed aliases return a real **404**, the same response production gives today. Google treats 404 and 410 almost identically for removal. A 410 would need custom middleware for no practical gain.

**Verified locally:** the 7 kept redirects are single-hop 308s straight to the final URL, the 4 removed ones are 404, and there are no chains or loops. The alias map (`legacySlugToCanonicalSlug`) now holds only the verified rename.

Other redirects (`/index`, `/work`, `/flyupline`, `/mbmdesigns → /works`, `/pricing → /services`, the 6 Canada-era blog slugs) predate this work and were already live. They're unchanged and single-hop. `/mbmdesigns → /works` points to a listing rather than an equivalent page; it's pre-existing, but Daniel may prefer a 404 if MBM was never a published case study.

## 2. Fictional data removed

| Item | Where | Depended on by | Action |
|---|---|---|---|
| Invented metrics ("31% conversion lift", "42% pipeline growth", …), testimonials from fictional people at fictional companies, template timelines, chapters, tab panels, tools, demo image captions | `src/lib/project-details.ts` | Only the unused `project-detail-renderer.tsx` and 4 unused components in `project-details-interactive.tsx` | **Deleted.** The type now carries only descriptive fields, and a file comment forbids sample proof. The descriptive copy for the six real projects is kept. |
| `ProjectDetailRenderer` (rendered those metrics and testimonials) | `components/marketing/project-detail-renderer.tsx` | nothing | **Deleted** |
| `CountUpMetric`, `ScrollScaleHero`, `StickySplitShowcase`, `GridFeatureTransform`, `StoryboardLane` | `components/marketing/project-details-interactive.tsx` | only the deleted renderer | **Deleted.** `ProjectLightboxImage`, the only one in use, is kept unchanged. |
| Template fallback testimonial ("Graphxify Team, Creative Partner") and default links | `works/[slug]/page.tsx` | type only | **Deleted** |
| Six fictional **published** demo works | `supabase/seed.sql` | Re-running the seed would have **published six fake projects**. The `on conflict (slug)` guard no longer matched, because real rows use new slugs. | **Deleted** from the seed (a comment explains why) |
| Unverified fallback metrics "26+ / 98% / 10M" | `lib/constants.ts` | not rendered | **Emptied** |
| Stale full-source snapshot containing all of the above | `PROJECT_FILES_DUMP.txt` | nothing (the July audit L6 already recommended deletion) | **Deleted** |
| "Mississauga, Ontario" location | unused `components/ui/demo.tsx` | nothing | **Deleted** |

A search for the fictional names and companies now matches only historical SQL `WHERE slug IN (…)` clauses. Those are update scripts that key on old slug strings and contain no fictional content.

## 3. Trust claims

The full inventory is in [TRUST-CLAIMS-INVENTORY.md](TRUST-CLAIMS-INVENTORY.md).

**Changed in code:**
- **"26+ Projects delivered"** (rendered) → the **live count of published case studies (6)**. The repo supports about 12 client names, not 26.
- "Average launch" → "Typical launch" (it's the stated process range).
- "Lighthouse scores above 90" (×6 places) → "engineered to a Lighthouse 90+ performance target".
- "ranks better" / "Built to rank" (×4) → "technically sound for search".
- "Next.js 15" → "Next.js".
- The decorative "98 Lighthouse" mock-up is marked `aria-hidden`.

**Kept and flagged:** "24h response" (a Graphxify commitment).

**Needs Daniel (CMS content, not edited):** blog statistics and guarantees in all 6 posts. See [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md).

## 4. Testimonials and logos

See [CLIENT-PROOF-NEEDS-VERIFICATION.md](CLIENT-PROOF-NEEDS-VERIFICATION.md).

- **Testimonials:** 8 published.
  - 4 were inserted by the seed script. They're tied to real case-study clients, but have no authenticity record.
  - 4 were added on 2026-05-03 within about 3 minutes. They have **no company**. One uses the role **"Lead Product Partner"**, which is identical to the fictional demo seed. One has the role typo "Manger".
- **Logos:** 10 in the marquee, of which **6 have no case study** (MBM Interior & Exterior, Beity Eats, Kaffecino, Branza, Echoshell, Pick Click).
- No Review schema exists, and none was added.

## 5. Positioning (implemented)

Machine-facing text now uses **"web design and development agency"**:
- `siteConfig.description` (used by Organization, WebSite, llms.txt and default metadata)
- the home, about and contact meta descriptions
- the home and default titles
- the privacy intro
- the home hero sentence (the site's main definitional sentence)

"Studio" remains in creative copy: the "Independent Design Studio" pill, "A studio that does both", "Interface Design Studio", and the About title's "Studio". Nothing was mechanically replaced.

## 6. Location (implemented)

- "Based in Canada · Working worldwide" replaces "Remote · Worldwide" in the footer, privacy and terms. llms.txt uses the same wording.
- Organization schema: `address: { PostalAddress, addressCountry: "CA" }` (country only, no street, city or office), plus `areaServed: "Worldwide"`. It's still **not** LocalBusiness.
- CMS `works.location = "Canada"` is a **column default**, bulk-applied, so it's not per-project data. It was being serialised into every case study's page payload. It's **no longer passed through**, and the visible rail still says "Remote".
- There's no Toronto or Mississauga reference anywhere in rendered output.

## 7. Project data conflicts

See [PROJECT-DATA-CONFLICTS.md](PROJECT-DATA-CONFLICTS.md).

- **Years:** CMS and code disagree for 4 of 6 projects. The year was previously published in JSON-LD (`dateCreated`); it's now **withheld for all 6** until confirmed. It isn't displayed on the page.
- **Maven:** the CMS says "Women's Fashion", while the code copy says "streetwear label / concept".
- **BOSS vs Boss** is inconsistent across the H1, `<title>` and two service pages.
- Others: "Pharmacy on/On King", "Maven Brand", FlyUp Line's branding scope, and the `king-medical-art-pharmacy` slug (don't rename).

## 8. Open Graph

- **CMS check:** all 6 posts and all 6 case studies have real raster covers (Supabase PNG/JPG), and those are used. The SVG placeholder overrides are ignored (code from pass 1). Daniel should still clear them in the CMS.
- **Fallback:** the framework-native `/og` ImageResponse card is used by service, core and index pages, and by any post without a cover. It previously showed a generic gradient square as its "logo"; it now renders the **real Graphxify wordmark**, fetched from the site's own `graphxify-logo-light.svg`, with a text fallback.
- The card is a 1200×630 PNG with a readable title and eyebrow, the domain, and no statistics. Verified visually. The default eyebrow is now "Web Design & Development".

## 9. Performance (second pass)

**LCP elements:**
- `/`: the hero description paragraph
- `/works/flyup-line`: the hero cover `<img>` (next/image, `priority`, `sizes=100vw`)
- `/blog/…`: the cover `<img>` (`priority`)

**Findings:**
- **Observed (unthrottled) LCP equals FCP** on all three pages: 258–424 ms. The multi-second values are Lighthouse's *simulated* slow-4G projection, which is driven by bytes on the critical path.
- There's no web font, no hidden-until-JS style, no theme flip and no fetch waterfall. Images are preloaded, and after pass 1 they're only 4–20 KB.
- The critical-path cost was JavaScript. **Supabase-js, a 203 KB (raw) chunk, was downloaded by every visitor on every page**, only so the header could decide whether to show a "CMS" button to logged-in staff.

**Fix:** the header now dynamic-imports Supabase **only when a Supabase auth cookie exists**. Staff see no change. Anonymous visitors and crawlers never download it (verified: the chunk is absent from the homepage HTML).

Lighthouse 12 (mobile, local production build, the same machine for every column):

| Page | Original | After pass 1 | **After QC** |
|---|---|---|---|
| `/` | Perf 91 · LCP 3.5 s | Perf 91 · LCP 3.5 s · 815 KiB | **Perf 89–93 · LCP 3.2–3.8 s · 686 KiB** (two runs) |
| `/works/flyup-line` | Perf 76 · LCP 7.3 s · 6,979 KiB | Perf 94 · LCP 3.2 s · 627 KiB | **Perf 94 · LCP 3.1 s · 567 KiB** |
| `/blog/how-to-choose-a-web-design-agency` | Perf 75 · LCP 11.6 s | Perf 82 · LCP 4.9 s · 513 KiB | **Perf 96 · LCP 2.8 s · 459 KiB** |

Accessibility, Best Practices and SEO are 100 on all three. CLS is 0 and TBT is 10–20 ms.

**Remaining:** about 350 KiB of JS (React/Next runtime, framer-motion for the gallery and slider animations). That's the rest of the simulated gap on the case study. I didn't remove animations for a lab score. Validate with **field data** (Speed Insights / CrUX) after deploying.

## 10. robots.txt (final)

```
User-Agent: *
Allow: /
Disallow: /dashboard  /admin  /api  /auth  /newsletter  /reset-password   (one line each)

User-Agent: OAI-SearchBot
User-Agent: ChatGPT-User
User-Agent: Claude-SearchBot
User-Agent: Claude-User
User-Agent: PerplexityBot
User-Agent: Perplexity-User
Allow: /
Disallow: (same six private paths)

User-Agent: GPTBot
Disallow: /

User-Agent: Google-Extended
Disallow: /

Sitemap: https://www.graphxify.com/sitemap.xml
```

On Vercel preview deployments, robots is `Disallow: /` plus `X-Robots-Tag: noindex`.

**Re-verified against first-party documentation on 2026-09-29:**

| Agent | Source | What the source says |
|---|---|---|
| OAI-SearchBot, ChatGPT-User, GPTBot | developers.openai.com/api/docs/bots | OAI-SearchBot governs ChatGPT search ("opted out … will not be shown in ChatGPT search answers"). ChatGPT-User "is not used to determine whether content may appear in Search", and for it "robots.txt rules may not apply". GPTBot: "should not be used in training". |
| Claude-SearchBot, Claude-User, ClaudeBot | support.claude.com/en/articles/8896518 | Three separate agents (training / user fetch / search). All honour robots.txt. |
| PerplexityBot, **Perplexity-User** | docs.perplexity.ai/guides/bots | Both are listed first-party. Perplexity-User "generally ignores robots.txt rules". So its line is **documented, not relied upon**. |
| Googlebot, Google-Extended | developers.google.com/search/docs/crawling-indexing/google-common-crawlers | Google-Extended "does not impact a site's inclusion in Google Search nor is it used as a ranking signal". It's a control token with no separate crawler. |

GPTBot and Google-Extended are **unchanged** (the existing policy). ClaudeBot has no explicit rule, which leaves it allowed via `*`; that's the unchanged default and a decision for Daniel.

## 11. llms.txt

**Kept.** It's generated at request time from the service catalogue, CMS works and CMS posts. All **28 URLs it lists return 200**, none are stale (no aliases, no industry routes), and none are redirects.

Content: title plus category or industry only. The descriptive sentences come from `siteConfig.description` and the location line. There are no statistics, and article excerpts are deliberately excluded.

It's served with `X-Robots-Tag: noindex`, so it's readable by tools but not a search result. It isn't claimed to affect Google.

## 12. Sitemap

26 URLs. Every one was checked on the local production build:

- status 200, not redirected
- no `noindex`
- a self-referencing canonical
- exactly one `<main>` and one H1
- a 123–159-character meta description
- JSON-LD present
- 196–1,624 words of server-rendered content inside `<main>`
- no duplicates

| # | URL | Content in `<main>` (words) |
|---|---|---|
| 1 | https://www.graphxify.com | 776 |
| 2 | /services | 959 |
| 3 | /services/brand-systems | 441 |
| 4 | /services/web-design | 462 |
| 5 | /services/web-development | 463 |
| 6 | /services/cms-architecture | 519 |
| 7 | /process | 840 |
| 8 | /about | 682 |
| 9 | /contact | 335 |
| 10 | /resources/website-growth-checklist | 217 |
| 11 | /privacy | 1,139 |
| 12 | /terms | 1,624 |
| 13 | /works | 150 |
| 14 | /blog | 372 |
| 15 | /blog/how-to-choose-a-web-design-agency | 1,013 |
| 16 | /blog/mobile-first-website-small-businesses | 930 |
| 17 | /blog/what-makes-a-strong-brand-identity | 1,120 |
| 18 | /blog/custom-web-development-vs-wordpress | 1,076 |
| 19 | /blog/professional-website-business-growth | 1,105 |
| 20 | /blog/local-seo-getting-found-on-google | 1,185 |
| 21 | /works/maven | 309 |
| 22 | /works/flyup-line | 231 |
| 23 | /works/pharmacy-on-king | 218 |
| 24 | /works/boss-medical-clinic | 219 |
| 25 | /works/king-medical-art-pharmacy | 196 |
| 26 | /works/luka-hair-salon | 219 |

**Not in the sitemap (deliberately):** `/feed.xml` and `/llms.txt` (both now `X-Robots-Tag: noindex`), `/indexnow-key.txt` (404 until configured, noindex once set), `/industries/*` (none published), `/review` (noindex), `/og` and all aliases and private routes.

Thinnest: `/works` (150 words) and the case studies (about 200–300). That's a content issue, see CONTENT-GAPS.

## 13. Industry route safety

- `/industries/[slug]` uses `dynamicParams = false` and prerenders only entries passing `isPublishable()` (currently **0**).
- Verified: `/industries/healthcare` (the draft) → **404**, `/industries/random-slug` → **404**.
- There's no `/industries` index route, no catch-all, and no wildcard capable of emitting empty 200 pages.

## 14. IndexNow

- **Inactive:** `/indexnow-key.txt` → 404 and `getIndexNowKey()` → null. No key exists in the code, env or docs; only a generation command is documented.
- Submissions are also blocked outside `VERCEL_ENV=production`.
- **No flow submits the whole site.** CMS saves submit at most the item URL, its index page and an old slug. `--sitemap` exists only in the manual script, and the docs mark it as one-time.
- Tested with a throwaway local key: the key file serves 200 + noindex.

## 15. Analytics

- Vercel Analytics and Speed Insights are unchanged and env-gated.
- The existing conversion events (`lead_submitted`, `newsletter_subscribed`, `review_submitted`) go through the one helper.
- **No GA4** (no Measurement ID, and consent is undecided).
- Page views, conversions, primary-CTA tracking and AI-referral reporting are documented for later in [GA4-SETUP.md](GA4-SETUP.md), with explicit double-count guards.

## 16. Rendered HTML recheck

Covered by §12 for every sitemap URL, including `/`, `/about`, `/services`, all 4 service pages, `/works`, every case study, `/blog`, every article and `/contact`. The results:

- Main content is in the initial HTML.
- One `<main>` and a logical H1 on every page.
- Self canonical, title and description present.
- JSON-LD graph valid: 0 parse errors, 0 unresolved references.
- 3–12 internal links inside `<main>` (the checklist page has 0 in-content links; it relies on the header and footer).
- **0 hidden streamed document bodies** and **0 accidental noindex**.

## 17. Quality checks

| Check | Result |
|---|---|
| `npm run lint` | exit 0 · **0 errors, 12 warnings** (was 13; the removed `project-detail-renderer.tsx` carried one. All 12 are pre-existing unused-variable warnings in dashboard and auth files.) |
| `npm run typecheck` | pass |
| Tests | none exist in the project |
| `npm run build` (with public Supabase env) | pass · compiled in about 6 s · **73 static pages** |

**Route-count history:**

| Build | Static pages | Why |
|---|---|---|
| Original | 77 | Included **12** `/works/*` pages: the 6 real ones plus 6 internal-key duplicates. |
| After pass 1 | 73 | −6 duplicate work pages; +`/feed.xml` and +`/llms.txt` (static routes); `/industries/[slug]` prerenders 0. |
| After this QC pass | 73 | No page-count change. Deleted files were components, not routes. The 4 removed redirects were never pages. |

The build's route table (every entry including dynamic routes) lists 77 entries after QC.

## 18. Not deployed

Nothing was deployed, pushed or committed. The folder is still not a git repository.

## Files changed in this QC pass

**Deleted:**
- `PROJECT_FILES_DUMP.txt`
- `src/components/marketing/project-detail-renderer.tsx`
- `src/components/ui/demo.tsx`

**Modified:**
- `next.config.ts`
- `supabase/seed.sql`
- Routes: `src/app/(marketing)/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `blog/[slug]/page.tsx`, `services/web-development/page.tsx`, `works/[slug]/page.tsx`
- `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/og/route.tsx`, `src/app/feed.xml/route.ts`, `src/app/llms.txt/route.ts`
- `src/components/marketing/footer.tsx`, `header.tsx`, `home-sections.tsx`, `project-details-interactive.tsx`, `services-page-content.tsx`
- `src/lib/constants.ts`, `project-card-content.ts`, `project-details.ts`, `seo.ts`

**Docs:**
- New: `docs/SEO-AI-SEARCH-QC-REPORT.md`, `TRUST-CLAIMS-INVENTORY.md`, `CLIENT-PROOF-NEEDS-VERIFICATION.md`, `PROJECT-DATA-CONFLICTS.md`, `GA4-SETUP.md`
- Updated with QC notes: `SEO-AI-SEARCH-IMPLEMENTATION-REPORT.md`, `SEO-AI-SEARCH-AUDIT.md`, `ENTITY-DATA-NEEDED.md`, `CONTENT-TRUST-AUDIT.md`, `DANIEL-EXTERNAL-SEO-CHECKLIST.md`, `AI-CRAWLER-VERIFICATION.md`

## Deployment safety verdict

**Technically safe:** yes. There are no indexing regressions: every sitemap URL is a clean, self-canonical 200; no irrelevant redirects remain; unknown and demo URLs 404; the preview is noindexed; no fictional data remains in application code or seeds; and lint, typecheck and build pass. Deploying would also strictly improve on what production serves today.

**Not "ready", by your definition:** unverified public factual content still exists. It lives in the **CMS**, and it's already live in production:

1. The High-risk blog claims (unsourced statistics, ranking guarantees, and an "SEO / Google Business Profile services" offer that doesn't exist).
2. Testimonials 5–8, which have no company, and one of which uses the demo seed's role string. Testimonials 1–4 need an authenticity and permission confirmation.
3. 6 marquee logos without case-study evidence.
4. Project-year, Maven-industry and BOSS/Boss conflicts. These are withheld from schema, but the conflicting CMS values remain.
5. The "24h response" commitment, which needs confirming.

Items 1–3 can be fixed in the CMS dashboard without a code change.


## 19. Confirmed facts applied (third pass, 2026-09-29)

### RESOLVED
| Fact | Applied to |
|---|---|
| 24-hour response (confirmed) | Sentences reworded to "We typically respond within 24 hours" (home, contact page, contact OG description). Labels unchanged. |
| Years: FlyUp Line 2025 · Pharmacy On King 2024 · Luka Hair Salon 2023 · King Medical Arts 2023 | Confirmed-facts registry, code fallback, `CreativeWork.dateCreated`. Not used for `dateModified` or sitemap `lastmod`. Maven and B.O.S.S. years (unconfirmed) stay omitted from schema. |
| Maven = Fashion | Registry, rail, JSON-LD `about`, Brand Systems related work, llms.txt, fallback copy, render-time phrase corrections for SEO/OG text and short copy. Seed SQL corrected. |
| B.O.S.S. Medical Clinic | H1, `<title>`, OG/Twitter, image alt, JSON-LD, cards, service-page related work, llms.txt, fallback, seed SQL. Slug `/works/boss-medical-clinic` unchanged. |
| FlyUp Line branding | Services rail, JSON-LD `keywords`, works-index card tags, registry, fallback, seed SQL |
| CMS `location` = client location / market | Dashboard label + placeholder. The rail shows "Client location" only for real values. The legacy "Canada" bulk default is ignored, removed from the schema SQL, and cleared by the data fix. The "Remote" cell was removed. |
| Testimonials (8) confirmed | Kept. No schema. The "Manger" → "Manager" fix is in the data SQL. |
| Marquee logos (10) confirmed | Kept |

### Data model / single source of truth
- `src/lib/project-card-content.ts` is now the one code-side registry of confirmed facts (name, industry, year, services, retired spellings, exact-phrase corrections).
- `project-details.ts` fallback and the three service pages' related-work lists derive from it, so their hard-coded title and industry duplicates were removed.
- `findProjectFactDrift()` plus a once-per-build warning in `db/queries/works.ts` report CMS drift.
- `supabase/drafts/confirmed-facts-2026-09-29.sql` is a **not applied**, idempotent, guarded data fix: years, FlyUp services, the B.O.S.S. name, Maven industry and phrases, dropping the location default and clearing the bulk value, and the testimonial typo.

### Validation (this pass)
- Lint: 0 errors, 12 warnings (unchanged, pre-existing).
- Typecheck: pass.
- Build: pass, 73 static pages (no route change).
- Rendered checks on 13 key pages plus llms.txt: no "BOSS/Boss Medical Clinic", no "streetwear", no "Women's Fashion" label, no 98% / 10M, no "Remote" or "Canada" project location.
- The 4 confirmed years appear as `dateCreated`. FlyUp Line lists Branding. All 8 testimonials and 10 logos are present.
- Redirects: 7× 308 and 4× 404, unchanged. Sitemap: the same 26 URLs, all 200. JSON-LD: 0 errors. 0 hidden stream blocks. Only `/review` is noindex.
- The one remaining occurrence of retired wording is Maven's CMS `challenge` paragraph ("Women's fashion branding …"). It's prose, awaiting Daniel.

### STILL REQUIRES ACTION
1. Run the CMS data-fix SQL (Daniel, in the Supabase SQL editor).
2. Review the blog claims in [BLOG-CLAIMS-FOR-REVIEW.md](BLOG-CLAIMS-FOR-REVIEW.md). They're unresolved and not marked verified.
3. Maven `challenge` paragraph wording.
4. Optional entity data: founder, founding year, LinkedIn URL, client locations, measurable outcomes, testimonial companies, Maven/B.O.S.S. years.

### Deployment verdict (supersedes the earlier verdict)
The code and repository are **technically safe to deploy**. Every confirmed fact renders correctly even before the CMS SQL runs, there are no regressions, and no fictional data or unsupported metrics remain.

**One factual blocker remains** before calling the site fully ready: the unresolved blog claims (above all, the local-SEO post offering SEO / Google Business Profile services Graphxify doesn't provide). These are already live in production today, so deploying doesn't make them worse. Fix them in the CMS, ideally before or alongside the deploy, and run the data-fix SQL.


## 20. Production CMS cleanup (2026-09-29)

Done with Daniel's authorisation, via the Supabase Management API. Full old → new record: [PRODUCTION-CMS-CLEANUP-2026-09-29.md](PRODUCTION-CMS-CLEANUP-2026-09-29.md).

- **Read-only audit first.** The schema, triggers (only `set_updated_at` on works/posts/testimonials), constraints and all rows matched the earlier audit. The full JSON backup was stored outside the repository.
- **One transaction:** 55 field changes across 6 posts, 3 works (plus the location value on all 6) and 1 testimonial. It dropped the `works.location` default and added a column comment. v1/v2 version snapshots were written (`post_versions` 12, `work_versions` 6).
- **Second read:** 55/55 values match, 0 unintended changes, all 20 rows still published, slugs unchanged, no new content rows, 10/10 marquee items identical.
- **Live site:** the currently deployed code already serves the corrected CMS content via ISR (verified on production: the Local SEO post no longer claims GBP services, cites Google, and uses its real cover as the OG image; Maven shows "Fashion"). **No code was deployed.**
- **Code:** the year-only `CreativeWork.dateCreated` was removed.
- **Checks after the cleanup:**
  - lint: 0 errors, 12 pre-existing warnings
  - typecheck: pass
  - build: pass, 73 static pages
  - drift check: 1 remaining warning (`maven.overview`, deliberate)
  - routes: 7× 308 and 4× 404 unchanged; `/nope`, `/blog/nope`, `/works/nope`, `/industries/healthcare` all 404
  - sitemap: the same 26 URLs, all 200 with one `<main>`
  - JSON-LD: 0 errors; no `dateCreated`; 0 hidden streams
  - OG images: all 12 posts and case studies emit raster covers

### Deployment verdict (supersedes §19)
The CMS and repository are now **synchronised**, except the deliberately unresolved Maven `overview` prose. The repository is **safe to deploy**. There are no remaining factual blockers in rendered content. Open items are optional entity data (founder, founding year, LinkedIn), which aren't errors.

**Follow-up:** Maven `overview` and `content` were corrected in the CMS, and the drift check now reports **0 conflicts** (see PRODUCTION-CMS-CLEANUP-2026-09-29.md).
