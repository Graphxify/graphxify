# Post-deployment production verification

**Verdict: FAIL — deployment requires correction.** The SEO / AI-search code is **not deployed**. Production is still serving the pre-SEO build. The CMS content cleanup *is* live.

## A. Deployment tested

- **URL:** https://www.graphxify.com/ (public HTTPS only; no local build used)
- **Method:** read-only `GET` requests, with no redirect following except where hop counting required it. Nothing on the site or database was modified.
- **What is actually deployed** (read-only check of GitHub and Vercel):

| Item | State |
|---|---|
| PR #5 `seo-ai-search-pass` (all SEO code) | **Open, not merged** |
| GitHub `main` | `2edb3f3` (2026-08-20, "Remove the pricing page…") — pre-SEO |
| Vercel production deployment | `dpl_A1tQ67j…`, built from `main@2edb3f3` on 2026-08-20 |
| Vercel preview of PR #5 | `dpl_DjgG7Nr…`, READY (protected) — **not production** |
| Production CMS data (cleanup of 2026-09-29) | **Live** (served through ISR by the old code) |

**To deploy:** merge PR #5 (https://github.com/Graphxify/graphxify/pull/5) into `main`. Vercel builds and deploys it automatically. Then re-run this verification (`verify_prod.mjs`).

## B. Timestamp

2026-09-29, 14:36–14:45 UTC.

## C. HTTP status

| URL | Status | Expected after deploy |
|---|---|---|
| `/`, `/about`, `/services`, the 4 service pages, `/works`, all 6 case studies, `/blog`, all 6 posts, `/contact`, `/process`, `/privacy`, `/terms`, `/resources/website-growth-checklist` | **200** (26/26) | 200 |
| `/robots.txt`, `/sitemap.xml` | 200 | 200 |
| `/llms.txt` | **404** | 200 (new code) |
| `/feed.xml` | **404** | 200 (new code) |
| `/indexnow-key.txt` | 404 | 404 until configured (**expected**) |

No 5xx responses. No unexpected 3xx on canonical pages.

## D. Redirect summary

**Host canonicalisation:**

| Source | Chain | Hops |
|---|---|---|
| `http://www.graphxify.com/` | 308 → `https://www.graphxify.com/` (200) | 1 |
| `https://graphxify.com/` | 308 → `https://www.graphxify.com/` (200) | 1 |
| `http://graphxify.com/` | 308 → `https://graphxify.com/` → 308 → `https://www.graphxify.com/` (200) | **2** (Vercel upgrades to HTTPS first, then apex → www; minor and platform-level) |

**Permanent redirects:**

| Old URL | Status | Destination | Hops | Result |
|---|---|---|---|---|
| `/works/boss-raam-pharmacy` | 308 | `/works/boss-medical-clinic` | 1 | OK |
| `/index` | 308 | `/` | 1 | OK |
| `/work` | 308 | `/works` | 1 | OK |
| `/flyupline` | 308 | `/works/flyup-line` | 1 | OK |
| `/mbmdesigns` | 308 | `/works` | 1 | OK |
| `/pricing` | 308 | `/services` | 1 | OK |
| 6 Canada-era blog slugs | 308 | matching current post | 1 | OK |
| `/works/northline-enterprise-replatform` | **200** | — | 0 | **FAIL** (duplicate page; new code → 308 to `/works/flyup-line`) |
| `/works/vertex-brand-operations` | **200** | — | 0 | **FAIL** (→ `/works/maven`) |
| `/works/axis-growth-platform` | **200** | — | 0 | **FAIL** (→ `/works/boss-medical-clinic`) |
| `/works/lumen-commerce-redesign` | **200** | — | 0 | **FAIL** (→ `/works/pharmacy-on-king`) |
| `/works/atlas-fintech-experience-hub` | **200** | — | 0 | **FAIL** (→ `/works/luka-hair-salon`) |
| `/works/meridian-health-network-portal` | **200** | — | 0 | **FAIL** (→ `/works/king-medical-art-pharmacy`) |

## E. 404 summary

| URL | Status | Result |
|---|---|---|
| `/works/northline-enterprise-platform`, `/works/orion-saas-relaunch`, `/works/solace-investor-relations-portal`, `/works/kite-commerce-experience-refresh` | **404** (no redirect) | PASS |
| `/this-page-does-not-exist-123456` | **404**, `noindex`, branded UI, links home plus 4 section links | PASS on status (not a soft 404) |
| Same 404 page, metadata | Title is the homepage's; `canonical` = `https://www.graphxify.com`; **no H1** | **FAIL** (fixed in new code: own title, no canonical, H1) |

## F. robots.txt

The live file is the **old** policy:
- `*`: allow `/`, disallow private paths.
- GPTBot: `Disallow: /` ✔.
- Google-Extended: `Disallow: /` ✔.
- Sitemap line: `https://www.graphxify.com/sitemap.xml` ✔.

**Missing:** the explicit group for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User. These agents are still *allowed* via `*`, so nothing is blocked. The explicit policy just isn't live. Googlebot and Bingbot are allowed via `*`. No public marketing path is disallowed.

## G. Sitemap

- 26 URLs, all return 200, are indexable and self-canonical, with no duplicates.
- It contains no llms/feed/indexnow/preview/private/obsolete/industry/redirecting URLs. PASS on content.
- **Stale behaviour (old code):** every post shares one hardcoded `lastmod` (2026-07-29). It isn't updated to the real CMS `updated_at` values (the posts were edited 2026-09-29). Fixed in new code.

## H. llms.txt

**404.** Not deployed.

## I. Feed

**404.** Not deployed.

## J. Metadata

- Every one of the 26 pages has a title, description, canonical, OG title, description, image and URL, and Twitter title, description and image.
- 0 duplicate titles, 0 duplicate descriptions.
- No localhost or preview URLs. No SVG share images on any page (the CMS cleanup is live). No old project names in titles or OG tags: "B.O.S.S. Medical Clinic — Healthcare Case Study", "Maven — Fashion Brand Identity Case Study".
- **Old code still live:**
  - Titles end in "| GRAPHXIFY" and double-brand: "About Graphxify – Design & Development Studio | GRAPHXIFY".
  - Descriptions say "web design and branding agency" instead of the approved "web design and development agency".
  - The 404 page carries homepage metadata.

## K. Canonicals

- All 26 pages self-canonicalise on `https://www.graphxify.com`. There are no non-www, HTTP or old-slug canonicals.
- `/works/boss-medical-clinic` canonicalises to itself. PASS.
- The 6 old internal slugs return 200 with a canonical pointing at the real page, i.e. duplicates (see D).

## L. Structured data

- All JSON-LD parses (0 invalid). One Organization `@id` (`/#organization`) is used consistently.
- **Old schema still live (all FAIL, fixed in new code):**
  - The Organization is typed **`ProfessionalService`**, a LocalBusiness subtype.
  - It carries **`priceRange`**.
  - It uses the **placeholder logo** `logo-mark.svg`.
  - `/process` has misapplied **`HowTo`** markup.
  - **No `CreativeWork`** on any of the 6 case studies.
  - No Blog or CollectionPage entities.
  - Service and BlogPosting nodes aren't linked to the Organization `@id`.
- **PASS:** no Review, AggregateRating or FAQPage markup, and no year-only `dateCreated`.

## M. Project data (live CMS through the old code)

| Project | Check | Result |
|---|---|---|
| FlyUp Line | Year 2025 / Branding | CMS values are correct. Branding appears in the services data. (With no CreativeWork on the old code, the structured-data check can't be done.) |
| Pharmacy On King / Luka Hair Salon / King Medical Arts | Years 2024 / 2023 / 2023 | CMS correct. The year isn't displayed on pages. |
| Maven | Industry "Fashion"; no women's-fashion or streetwear categorisation | **PASS** (rail shows "Fashion"; title "Maven — Fashion Brand Identity…") |
| B.O.S.S. Medical Clinic | Exact name | `<title>`/OG say "B.O.S.S. Medical Clinic" ✔, but the **H1 says "Boss Medical Clinic"**. The old code's hard-coded card title overrides the CMS. **FAIL until deploy.** The canonical `/works/boss-medical-clinic` ✔. |

## N. Testimonials

All 8 approved testimonials are present in the homepage payload. `/about` shows its 6 (the first 6, by design). **"Manger" does not appear anywhere**; "Manager" is present. No invented companies. PASS.

## O. Client logos

All 10 marquee logos render, every image returns HTTP 200 (SVG/WebP), and there are no links to verify (the marquee has no links). Includes MBM Interior & Exterior, Beity Eats, Kaffecino, Branza, Echoshell and Pick Click. PASS.

## P. OG images (each image fetched directly)

| Page | OG image | Status | Type | Size |
|---|---|---|---|---|
| `/` | generated `/og?title=…` | 200 | PNG | 1200×630 |
| `/services/web-design` | generated `/og` | 200 | PNG | 1200×630 |
| `/works/flyup-line` | CMS cover (Supabase) | 200 | JPEG | 1920×1280 |
| `/works/maven` | CMS cover | 200 | PNG | 1920×1280 |
| **`/works/boss-medical-clinic`** | CMS `og_image` | **400 — object not found** | — | — |
| `/blog/local-seo-getting-found-on-google` | post cover | 200 | PNG | 1536×1024 |
| `/blog/how-to-choose-a-web-design-agency` | post cover | 200 | PNG | 1536×1024 |

All are absolute URLs with no localhost, preview or SVG placeholders.

**New issue found:** three case studies have CMS `og_image` / `twitter_image` values pointing at **deleted Supabase Storage objects** ("Object not found"):
- **B.O.S.S. Medical Clinic**
- **King Medical Arts Pharmacy**
- **Pharmacy On King**

Their social previews are broken on both old and new code. Their cover and gallery images all load. **Fix:** clear those 3 × 2 CMS fields, so the page falls back to its working cover, or upload replacement images. This is a CMS change and wasn't made in this read-only task.

## Q. Internal links

- 26 unique internal URLs are linked from the 26 crawled pages. All return 200.
- No links go through redirects, to old project slugs, to localhost or to preview deployments. No orphan sitemap pages.
- PASS.

## R. Indexability

- No `noindex`/`nofollow` meta tag and no `X-Robots-Tag` on any of the 26 public pages.
- `noindex` appears only on the 404 page. PASS.

## S. Performance (production, Lighthouse 12 mobile)

| Page | Perf | A11y | BP | SEO | LCP | CLS | TBT | Transfer |
|---|---|---|---|---|---|---|---|---|
| `/` | 94 | 100 | 96 | 100 | 3.0 s | 0 | 30 ms | 908 KiB |
| `/blog/how-to-choose-a-web-design-agency` | 80 | 96 | 100 | 100 | 4.6 s | 0 | 30 ms | 1,863 KiB |
| `/works/flyup-line` | 76 | 100 | 100 | 100 | 7.0 s | 0 | 20 ms | **6,965 KiB** |
| `/services/web-design` | 94 | 100 | 96 | 100 | 3.0 s | 0 | 70 ms | 481 KiB |

These match the **old** build's local baseline (FlyUp Line 6,979 KiB / LCP 7.3 s). The new build measured FlyUp Line at 567 KiB / LCP 3.1 s, and the blog at LCP 2.8 s with A11y 100. The gains aren't live yet.

## Secrets

**No exposed server-only credentials detected.** 36 client JS bundles and 26 HTML pages were scanned for service-role JWTs, `sb_secret_` keys and server-key assignments. Only the public publishable key is present, and that's intended.

## IndexNow

`/indexnow-key.txt` returns 404. That's **expected**: it isn't configured yet, and the route doesn't exist in the old build either.

## T. Unresolved production issues

| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | **SEO code not deployed.** PR #5 is unmerged; production runs `main@2edb3f3`. Causes: page content hidden in streamed `<div hidden>` blocks outside `<main>` on all 26 pages (0 words in `<main>`, H1 after the footer); 6 duplicate 200 case-study aliases; old robots policy; no llms.txt or feed; old schema (ProfessionalService, priceRange, placeholder logo, HowTo, no CreativeWork); "Boss Medical Clinic" H1; stale sitemap `lastmod`; 404 page metadata; nested `<main>` on case studies; unoptimised 7 MB case-study pages. | **CRITICAL** | Merge PR #5, then re-run this verification |
| 2 | Broken CMS `og_image` / `twitter_image` on B.O.S.S. Medical Clinic, King Medical Arts and Pharmacy On King (deleted storage objects) | **HIGH** (social previews) | Clear those fields (fallback = cover image) or re-upload the images |
| 3 | `http://graphxify.com` takes 2 hops (HTTP→HTTPS, then apex→www) | LOW | Platform default on Vercel. Acceptable. |

## U. Final verdict

**FAIL — deployment requires correction.**

The CMS content is correct in production: names, Maven industry, blog claims, testimonials, logos, and no SVG share images. However, the SEO / AI-search code has not been deployed, and three case studies have broken OG images. After merging PR #5 and fixing issue 2, re-run the verification. I'd expect the result to move to PASS, pending that re-run.

## Update 2026-09-29: issue T2 fixed

The broken `og_image` / `twitter_image` values on B.O.S.S. Medical Clinic, King Medical Arts Pharmacy and Pharmacy On King were cleared in the CMS (6 fields; see PRODUCTION-CMS-CLEANUP-2026-09-29.md). All three now emit their working cover image (HTTP 200, PNG/PNG/JPEG) as `og:image` and `twitter:image`. Verified on the live production site and on the PR #5 build. The remaining open item is T1 (merge PR #5).
