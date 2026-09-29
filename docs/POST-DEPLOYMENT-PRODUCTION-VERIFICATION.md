# Post-deployment production verification

**Verdict: PASS WITH MINOR ISSUES.** Every SEO / AI-search requirement verifies on the live site. The remaining items are pre-existing and non-blocking (see T).

> History: the first run of this verification (2026-09-29, 14:36 UTC) returned **FAIL**, because PR #5 had not been merged and production was still serving `main@2edb3f3` from 2026-08-20. Three case studies also had broken share images; those were fixed in the CMS before the merge. This document now reflects the post-merge production deployment.

## A. Deployment tested

| Item | Value |
|---|---|
| Public URL | https://www.graphxify.com/ (HTTPS; read-only `GET` requests only) |
| PR | #5 `seo-ai-search-pass` → `main`, **squash-merged** |
| `main` commit | **`66a202a`** "SEO / AI-search technical pass and confirmed project facts (#5)". Parent `2edb3f3`; tree identical to PR head `a145d75` |
| Vercel production deployment | `dpl_9pwFarXcjxt43ofgca8SHd9eBrgq`, **READY**, built from `66a202a` |
| Domains on that deployment | `www.graphxify.com`, `graphxify.com` (→ www) |

## B. Timestamp

2026-09-29, 15:00–15:25 UTC.

## C. HTTP status

- **All 26 sitemap pages return 200**, as do `/robots.txt`, `/sitemap.xml`, `/llms.txt` (text/plain) and `/feed.xml` (application/atom+xml).
- No unexpected 3xx on canonical URLs and no 5xx responses.
- `/indexnow-key.txt` returns 404, which is expected: IndexNow isn't configured yet.

## D. Redirects

**Host canonicalisation:**
- `http://www.` → 1 hop.
- `https://graphxify.com` → 1 hop.
- `http://graphxify.com` → 2 hops. This is Vercel's standard HTTP→HTTPS-then-www sequence, which is minor.

**All 18 permanent redirects are single-hop 308s to 200 pages:**

| Old URL | Destination |
|---|---|
| `/works/northline-enterprise-replatform` | `/works/flyup-line` |
| `/works/vertex-brand-operations` | `/works/maven` |
| `/works/axis-growth-platform` | `/works/boss-medical-clinic` |
| `/works/lumen-commerce-redesign` | `/works/pharmacy-on-king` |
| `/works/atlas-fintech-experience-hub` | `/works/luka-hair-salon` |
| `/works/meridian-health-network-portal` | `/works/king-medical-art-pharmacy` |
| `/works/boss-raam-pharmacy` | `/works/boss-medical-clinic` |
| `/index` | `/` |
| `/work` | `/works` |
| `/flyupline` | `/works/flyup-line` |
| `/mbmdesigns` | `/works` |
| `/pricing` | `/services` |
| 6 Canada-era blog slugs | their current posts |

**No duplicate case-study page returns 200 any more.** Before the merge, 6 did.

## E. 404s

- `/works/northline-enterprise-platform`, `/works/orion-saas-relaunch`, `/works/solace-investor-relations-portal` and `/works/kite-commerce-experience-refresh` → **404**, with no redirects.
- `/this-page-does-not-exist-123456` → **404**. It has the title "Page Not Found | Graphxify", **no canonical**, `noindex`, an H1, and links to home, Work, Services, Blog and Contact. It's a genuine 404, not a soft one.

## F. robots.txt

- `*` allows `/` and disallows `/dashboard /admin /api /auth /newsletter /reset-password`.
- **An explicit group** for OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot and Perplexity-User has the same rules.
- GPTBot: `Disallow: /` (unchanged). Google-Extended: `Disallow: /` (unchanged).
- Googlebot and Bingbot are allowed via `*`.
- The sitemap directive is `https://www.graphxify.com/sitemap.xml`.
- No public page is disallowed. **PASS.**

## G. Sitemap

- 26 URLs: every one returns 200, is indexable and self-canonical, is not redirected and has no duplicate. No llms/feed/indexnow, preview, private, obsolete, industry or `/review` URLs.
- **Real modification dates:**
  - posts and `/blog`: 2026-09-29 11:54 (the CMS content cleanup)
  - case studies: their CMS `updated_at` (Maven 14:07, and 14:48 for the share-image fix)
  - legal pages: 2026-03-09
  - other static pages: fixed 2026-07-29
- **PASS.**

## H. llms.txt

200, `text/plain`, `X-Robots-Tag: noindex`. It lists 28 URLs, **all 200** and none redirecting. There are no demo or stale URLs and no marketing claims. **PASS.**

## I. Feed

200, valid Atom. It has 6 entries: the 6 published posts, with no drafts or duplicates. Entry IDs are canonical `https://www.graphxify.com/blog/…` URLs. Published dates are 2025-12-18 through 2026-03-05, and updated dates are 2026-09-29 (the real CMS edit). **PASS.**

## J. Metadata

- All 26 pages have a title, description, canonical, OG title, description, image and URL, and Twitter title, description and image.
- 0 duplicate titles, 0 duplicate descriptions.
- No localhost or preview URLs. No SVG share images.
- No "| GRAPHXIFY" suffix, and no old project names ("BOSS/Boss Medical Clinic", "Women's Fashion", "streetwear") anywhere in metadata, H1s or visible text.
- **PASS.**

## K. Canonicals

- All 26 pages self-canonicalise on `https://www.graphxify.com` (HTTPS, www). None point to old slugs or to redirects.
- `/works/boss-medical-clinic` → itself. **PASS.**

## L. Structured data

- **Types found:** Organization ×26, WebSite ×26, BreadcrumbList ×20, BlogPosting ×6, **CreativeWork ×6** (one per case study), Service ×4, ItemList, Blog, CollectionPage.
- 0 invalid blocks. One Organization `@id` (`https://www.graphxify.com/#organization`) is reused everywhere.
- The logo is the real `/icon.png`. The address is **country-only** (`addressCountry: CA`), and `areaServed` is Worldwide.
- **Absent, as required:** LocalBusiness / ProfessionalService, `priceRange`, the placeholder `logo-mark.svg`, HowTo, Review, AggregateRating, FAQPage, `dateCreated`, and street/city addresses.
- **PASS.**

## M. Project data

| Project | Verified on production |
|---|---|
| FlyUp Line | CreativeWork `keywords`: **Branding**, Website Design, UX Strategy. CMS year 2025. |
| Pharmacy On King / Luka Hair Salon / King Medical Arts | CMS years 2024 / 2023 / 2023. The year isn't displayed, and it's deliberately not in schema. |
| Maven | Industry **Fashion** (rail + schema). No women's-fashion, streetwear or feminine wording in the metadata or body. |
| B.O.S.S. Medical Clinic | H1, `<title>`, OG, Twitter and CreativeWork `name` are all **"B.O.S.S. Medical Clinic"**. The canonical is `/works/boss-medical-clinic`. |

**PASS.**

## N. Testimonials

All **8/8** approved testimonials are present. "Manger" is gone; the role reads "Manager". No companies were added. **PASS.**

## O. Client logos

All **10/10** marquee logos render, and each image returns 200. That includes MBM Interior & Exterior, Beity Eats, Kaffecino, Branza, Echoshell and Pick Click. The marquee has no links. **PASS.**

## P. OG / Twitter images

Every image was fetched directly.

| Page | Image | Status / type / size |
|---|---|---|
| `/` | generated `/og` card | 200 PNG 1200×630 |
| `/services/web-design` | generated `/og` card | 200 PNG 1200×630 |
| FlyUp Line | CMS cover | 200 JPEG |
| Maven | CMS cover | 200 PNG 1920×1280 |
| **B.O.S.S. Medical Clinic** | cover fallback `…/1775173790965-4qwhinbgcz8.png` | 200 PNG 1254×1254 |
| **King Medical Arts Pharmacy** | cover fallback `…/1775256706042-lsqx8n1vjhr.png` | 200 PNG 1671×940 |
| **Pharmacy On King** | cover fallback `…/1775198098313-ronvfss6ou.jpg` | 200 JPEG |
| Luka Hair Salon | CMS cover | 200 PNG 2250×1500 |
| All 6 blog posts | post covers | 200 PNG 1536×1024 |

OG and Twitter use the same valid image on every page. All URLs are absolute production or Supabase URLs, and no broken Storage objects are referenced. **PASS.**

## Q. Internal links

26 unique internal URLs are linked from the 26 crawled pages. All return 200, with none going through redirects, to old slugs, to localhost or to preview deployments. No orphan sitemap pages. **PASS.**

*Checker note:* `/about` contains `<footer>` elements for testimonial attributions (valid HTML). The site footer there has all 14 links.

## R. Indexability

No `noindex` / `nofollow` meta and no `X-Robots-Tag` on any of the 26 public pages. `noindex` appears only on the 404 page, `/llms.txt` and `/feed.xml`, all intentional. **PASS.**

## Initial HTML (the previous critical defect)

- On all 26 pages, `<main>` contains the real content (195–1,617 words).
- There are **0 hidden stream blocks**, the H1 comes **before** the footer, and there's exactly one `<main>` and one H1 per page.
- The `(marketing)/loading.tsx` defect is **gone**.

## S. Performance (production, Lighthouse 12 mobile)

| Page | Before merge (old build) | **After merge** |
|---|---|---|
| `/works/flyup-line` | Perf 76 · LCP 7.0 s · **6,965 KiB** | **Perf 96 · LCP 2.8 s · 538 KiB** |
| `/blog/how-to-choose-a-web-design-agency` | Perf 80 · A11y 96 · LCP 4.6 s · 1,863 KiB | **Perf 93 · A11y 100 · LCP 3.2 s · 436 KiB** |
| `/services/web-design` | Perf 94 · LCP 3.0 s · 481 KiB | **Perf 98 · LCP 2.4 s · 427 KiB** |
| `/` | Perf 94 · LCP 3.0 s · 908 KiB | **Perf 83–94 · LCP 3.0–4.1 s · 605 KiB** (5 runs) |

- CLS is 0 everywhere, TBT is 10–70 ms, and Accessibility and SEO are 100 on all four pages.
- The homepage range comes from network variance on the test machine. Its best run (94 / 3.0 s, observed FCP 447 ms) equals the old build, and its worst runs coincided with 2.5 s observed FCP from the same connection. It ships less JavaScript than before (340 vs 398 KiB).
- **FlyUp Line no longer serves the ~7 MB implementation.**

## Secrets

**No exposed server-only credentials detected.** 35 client bundles and 26 pages were scanned.

## T. Unresolved issues (minor, non-blocking)

| # | Issue | Severity | Note |
|---|---|---|---|
| 1 | React hydration error **#418** in the browser console on the homepage and `/services/web-design`. It lowers Best Practices to 96. | LOW | **Pre-existing** (also present on the old production build). Worth investigating separately. It doesn't affect crawled HTML. |
| 2 | The GitHub Actions `build` job fails with `supabaseKey is required`. | LOW | **Pre-existing** on every `main` commit since July. The workflow has no Supabase secrets. The Vercel build, which is the real deploy, passes. Add the repository secrets or skip the data-dependent build in CI. |
| 3 | `http://graphxify.com` takes 2 hops (HTTP→HTTPS, then apex→www). | LOW | Vercel platform behaviour |
| 4 | The B.O.S.S. Medical Clinic share image is square (1254×1254). | LOW | Valid, but platforms will crop it to 1.91:1. A landscape cover would present better. |
| 5 | Homepage lab performance varies between runs (83–94). | INFO | Validate with field data (Speed Insights / CrUX) |

## U. Final verdict

**PASS WITH MINOR ISSUES.**

Every SEO / AI-search deliverable verifies on the live production site. None of the minor items blocks indexing. Graphxify is ready for Google Search Console, Bing Webmaster Tools and IndexNow setup.
