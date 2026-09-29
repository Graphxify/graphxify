# SEO & AI-Search Implementation Report

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

**Date:** 2026-09-29 · **Audit:** [SEO-AI-SEARCH-AUDIT.md](SEO-AI-SEARCH-AUDIT.md)

No change here guarantees rankings, AI Overview inclusion or AI-assistant citations. These changes remove technical obstacles and make Graphxify's real facts readable by machines.

## 1. Executive summary

- **Biggest fix: every marketing page's content was hidden in the initial HTML.** An empty `loading.tsx` made Next.js stream each page into a `<div hidden>` placed *after* the footer, leaving `<main>` empty. Crawlers and AI fetchers that don't execute JavaScript got hidden, out-of-order content. Removing the file (no visual effect) puts all content inside `<main>` in document order. It's now verified on all 21 public routes.
- **Duplicate case-study URLs removed.** 6 internal `/works/*` slugs rendered as indexable 200 duplicates of the real case study. They're now permanent redirects. *(QC pass: 4 other aliases turned out to be unrelated template demo projects. They are **not** redirected and return 404; see the QC report §1.)*
- **One connected entity graph.** Organization (with the real logo mark, no longer a LocalBusiness subtype, no unverified price range) ← WebSite, Service ×4, BlogPosting, Blog, CreativeWork (new for all 6 case studies), CollectionPage, Breadcrumbs.
- **Performance:** CMS images were served as full-size originals. Now optimised: case study **6,979 KiB → 627 KiB**, LCP **7.3 s → 3.2 s**. Blog post LCP **11.6 s → 4.9 s** (Lighthouse mobile, lab).
- **Social previews fixed.** All 6 posts pointed their OG image at placeholder SVGs, which Facebook, LinkedIn and X can't render.
- **New:** explicit search/AI-retrieval crawler policy (existing training opt-outs preserved), Atom feed, `llms.txt`, IndexNow (inert until a key is set), preview-deployment noindex, conversion events on the existing analytics, and a gated industry-page architecture (nothing published).
- **Not changed, needs Daniel:** unverified trust figures and blog statistics, conflicting project facts (years, location, industry), founder/team data, and dead template data containing fabricated metrics and testimonials.

## 2. Files changed

**Added**
- `src/app/feed.xml/route.ts`: Atom feed
- `src/app/llms.txt/route.ts`: generated site map for LLM tools
- `src/app/indexnow-key.txt/route.ts`: IndexNow key file (404 until configured)
- `src/app/(marketing)/industries/[slug]/page.tsx`: industry template (no published pages)
- `src/lib/indexnow.ts`, `src/lib/industries.ts`, `src/lib/analytics-events.ts`
- `scripts/indexnow-submit.mjs` (+ `npm run indexnow:submit`)
- `supabase/drafts/seo-content-fields.sql`: **draft, not applied**
- `docs/*.md` (11 documents)

**Removed**
- `src/app/(marketing)/loading.tsx`

**Modified**
- `next.config.ts`: work-slug redirects, preview noindex
- `package.json`: script
- `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`
- `src/lib/seo.ts`: entity graph, metadata helpers
- `src/lib/constants.ts`: brand name, service catalogue, phone format
- `src/lib/blog.ts`, `src/lib/content-helpers.ts`, `src/lib/project-card-content.ts`
- `src/services/content-service.ts`: IndexNow hooks
- Routes: `about`, `blog`, `blog/[slug]`, `contact`, `process`, `resources/website-growth-checklist`, `services` + 4 service pages, `works`, `works/[slug]`
- Components: `footer`, `header`, `home-sections`, `home-projects-slider`, `other-projects-slider`, `about-page-content`, `blog-page-content`, `services-page-content`, `contact-page-content`, `lead-form`, `newsletter-signup`, `review-form`, `ui/not-found-2`

## 3. Technical issues fixed

| Audit ID | Issue | Fix |
|---|---|---|
| K1 (CRITICAL) | Page content streamed into a hidden div outside `<main>` | Removed the empty `loading.tsx` |
| K2 | Home project links streamed the same way | Direct import instead of `next/dynamic` |
| W1 (HIGH) | 6 duplicate 200 + meta-refresh case-study URLs | Permanent redirects for verified equivalents only; static params limited to canonical slugs |
| I1/I2 (HIGH) | Disconnected, partly invalid schema; no case-study schema | Connected `@id` graph; CreativeWork for case studies |
| P1 (HIGH) | Unoptimised CMS images | Supabase images now go through next/image |
| H2 (HIGH) | SVG OG images on all posts | SVG share images ignored, falling back to the cover |
| F1 | Root canonical "/" inherited by 404s and dashboard | Removed; 404 has its own metadata |
| E1/E2 | Identical or invented sitemap `lastmod` | Real CMS dates |
| H1 | GRAPHXIFY/Graphxify and double-branded titles | Single brand name; titles fixed |
| I3/I4 | Fake-fresh `datePublished` fallback; misused HowTo | Real dates only; HowTo removed |
| N1–N6 | Keyboard submenu, footer headings, label-in-name, colour-only links, case-study headings, 404 H1 | Fixed without visual change |
| D1/D3 | Implicit AI-search policy; indexable previews | Explicit groups; preview noindex |
| — | Blog date shown a day early outside UTC | UTC-pinned formatting |
| S2 | Nested `<main>` on case studies and checklist | Changed to `<article>` |

## 4. robots changes

Final output (`/robots.txt`):
```
User-Agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /api
Disallow: /auth
Disallow: /newsletter
Disallow: /reset-password

User-Agent: OAI-SearchBot
User-Agent: ChatGPT-User
User-Agent: Claude-SearchBot
User-Agent: Claude-User
User-Agent: PerplexityBot
User-Agent: Perplexity-User
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /api
Disallow: /auth
Disallow: /newsletter
Disallow: /reset-password

User-Agent: GPTBot
Disallow: /

User-Agent: Google-Extended
Disallow: /

Sitemap: https://www.graphxify.com/sitemap.xml
```

- GPTBot and Google-Extended (training) are the **existing policy, unchanged**. Neither affects ChatGPT search, Google Search or AI Overviews.
- No new training policy was introduced (ClaudeBot remains under `*`).
- On Vercel **preview** deployments, robots is `Disallow: /`.
- Agent tokens were verified against the OpenAI, Anthropic and Perplexity docs (links in [AI-CRAWLER-VERIFICATION.md](AI-CRAWLER-VERIFICATION.md)).

## 5. Sitemap changes

- 26 URLs: 12 static pages, `/works`, `/blog`, 6 posts and 6 case studies. There are no aliases, private routes or noindex pages.
- **Real `lastmod`:**
  - Posts use CMS `updated_at` (previously all shared one hardcoded date).
  - Case studies use CMS `updated_at`.
  - `/blog` and `/works` use their newest item's date.
  - Legal pages use their stated "Last updated" date (2026-03-09).
  - Other static pages use a fixed, dated constant that should only be bumped when their copy changes.
- The hardcoded works fallback no longer invents `YYYY-01-01` dates.
- Service URLs come from the single `serviceCatalog`. Published industry pages are appended automatically (currently none).

## 6. Canonical fixes

- Every indexable page has a self-referencing absolute canonical on `https://www.graphxify.com`.
- One helper (`canonicalUrl()`) now produces canonical, sitemap, OG `url` and JSON-LD `url`/`@id` values, so they can't drift apart.
- The root layout no longer injects `canonical: /` into routes without their own (404s, dashboard).
- **Local SEO duplicate:** already resolved before this pass. The CMS has one post (`local-seo-getting-found-on-google`), and the old Canada slug is a single-hop 308 in production. It was verified, not changed.

## 7. Redirect fixes

New permanent redirects (all single hop). **Superseded by the QC report §1:** the 4 demo-project aliases (northline-enterprise-platform, orion-saas-relaunch, solace-investor-relations-portal, kite-commerce-experience-refresh) were **removed** and 404.

| From | To |
|---|---|
| `/works/northline-enterprise-replatform`, `/works/northline-enterprise-platform` | `/works/flyup-line` |
| `/works/vertex-brand-operations` | `/works/maven` |
| `/works/axis-growth-platform`, `/works/boss-raam-pharmacy` | `/works/boss-medical-clinic` |
| `/works/lumen-commerce-redesign`, `/works/orion-saas-relaunch` | `/works/pharmacy-on-king` |
| `/works/atlas-fintech-experience-hub`, `/works/solace-investor-relations-portal` | `/works/luka-hair-salon` |
| `/works/meridian-health-network-portal`, `/works/kite-commerce-experience-refresh` | `/works/king-medical-art-pharmacy` |

These are generated from `legacyWorkPathRedirects()`, so any future alias added to `project-card-content.ts` gets a redirect automatically.

Existing redirects were kept: `/index`, `/work`, `/flyupline`, `/mbmdesigns`, `/pricing`, and the 6 Canada-era blog slugs.

Next.js emits **308** for `permanent: true`. Google treats 308 exactly like 301.

## 8. Metadata changes

- Brand suffix is now "`| Graphxify`" (was "`| GRAPHXIFY`"). The uppercase form is kept as the schema `alternateName`.
- New titles:
  - About: "About — Web Design, Branding & Development Studio | Graphxify"
  - Contact: "Contact — Start a Web Design or Branding Project | Graphxify"
  - 404: "Page Not Found | Graphxify" (noindex)
- There are 0 duplicate titles or descriptions across the audited routes.
- OG images:
  - SVG overrides are ignored.
  - OG image alt is always set.
  - Generated cards declare 1200×630 PNG.
  - Twitter image carries alt text.
- Posts gain `article:modified_time` and an Atom `<link rel="alternate">`, which is also on `/blog`.

## 9. Structured data added

One graph with stable IDs:

| Entity | `@id` | Where | Key links |
|---|---|---|---|
| Organization | `/#organization` | every marketing page | logo (`/icon.png`, 512²), email, telephone, areaServed Worldwide, sameAs (4 official profiles), `makesOffer` → 4 Services |
| WebSite | `/#website` | every marketing page | publisher → Organization. No SearchAction (no site search). |
| Service ×4 | `/services/<key>#service` | each service page; ItemList on `/services` | provider → Organization |
| BlogPosting | `/blog/<slug>#article` | each post | author (team byline → Organization), publisher → Organization, isPartOf Blog, real dates, wordCount |
| Blog | `/blog#blog` | `/blog` | blogPost list |
| CreativeWork | `/works/<slug>#work` | each case study (**new**) | creator/publisher → Organization, dateCreated (CMS year), about (industry), keywords (services), real images, live site as `mentions` |
| CollectionPage | `/works#collection` | `/works` | ItemList of 6 case studies |
| BreadcrumbList | `<url>#breadcrumb` | services, service pages, process, works, case studies, blog, posts, industries | — |

**Removed:**
- `ProfessionalService` type, replaced by `Organization`, since ProfessionalService is a LocalBusiness subtype and no address exists.
- `priceRange: "$$"` (unverified).
- Placeholder logo SVG.
- HowTo on /process.

**Deliberately not added:** LocalBusiness, Person, FAQPage, Review/AggregateRating, SearchAction. There's no eligible or verified data for them.

**Validation:** all blocks on 24 routes parse as JSON, there's one Organization per page, and every reference resolves on the page or is self-describing (type, name, URL). Before deploying, run the [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org) on one page of each type.

## 10. Performance changes

| Page (Lighthouse 12, mobile, local production build) | Before | After |
|---|---|---|
| `/works/flyup-line` | Perf 76 · LCP 7.3 s · **6,979 KiB** | **Perf 94 · LCP 3.2 s · 627 KiB** |
| `/blog/how-to-choose-a-web-design-agency` | Perf 75 · LCP 11.6 s · A11y 96 | **Perf 82 · LCP 4.9 s · A11y 100** |
| `/` | Perf 91 · LCP 3.5 s | Perf 91 · LCP 3.5 s · 815 KiB (text LCP; see audit P2) |
| `/services/web-design` | — | Perf 92 · LCP 3.3 s |

CLS is 0 and TBT is 10–20 ms everywhere. These are lab numbers from a local machine, not the Vercel CDN. Use Speed Insights / CrUX for real-user data.

- **Change:** `shouldBypassNextImageOptimization()` now returns false by default, so Supabase images go through next/image (AVIF/WebP, sized per `sizes`). The escape hatch `NEXT_PUBLIC_BYPASS_SUPABASE_IMAGE_OPTIMIZATION=true` restores the old behaviour. Watch the Vercel image-optimisation usage once after deploying; the site has only about 50 CMS images.
- **Not changed:** animations, fonts (system stack) and client JS. The text-LCP render delay on `/` needs field data first (audit P2).

## 11. Accessibility changes

- Services submenu opens on keyboard focus.
- Nav landmarks are labelled (Primary, Mobile, footer groups).
- Footer heading order is fixed.
- Card links are named by their visible title (WCAG 2.5.3).
- In-article links are underlined (WCAG 1.4.1).
- Case-study section labels are real headings.
- The 404 page has an H1 and recovery links.
- Social icon links are labelled "Graphxify on …".

Lighthouse accessibility is **100** on all four tested pages. No visual redesign.

## 12. Image SEO changes

- Case-study gallery alt changed from "`X visual 3`" to "`X project by Graphxify, gallery image 3`". Cover alt: "`X project cover image by Graphxify`". Works-index card alt includes the industry.
- Only real CMS images (not `/assets/*` placeholders) go into CreativeWork `image`.
- Optimised delivery: see §10.
- Truly descriptive per-image alt text needs CMS fields. The draft migration adds `cover_image_alt` and `gallery_image_alts`.

## 13. Internal linking changes

- Visible breadcrumb on posts (Blog / title).
- The 404 page now links to Work, Services, Blog and Contact.
- Card links are named by their titles.
- The site had no orphans or broken links. The remaining gaps are content work (CMS Architecture has no case study, and case studies don't link to articles); see CONTENT-GAPS.

## 14. Content issues discovered

Covered in [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md), [CONTENT-GAPS.md](CONTENT-GAPS.md) and [ENTITY-DATA-NEEDED.md](ENTITY-DATA-NEEDED.md). The most important:

- Unsourced blog statistics and ranking-guarantee phrasing ("will consistently outrank", "results within 30–60 days").
- The local-SEO post claims SEO and Google Business Profile services the site doesn't offer.
- Unverified homepage figures ("26+ projects", "98% satisfaction", "10M gross revenue").
- `lib/project-details.ts` holds **fabricated template metrics and testimonials** (not rendered, but one import away from going live).
- CMS/code factual conflicts: project years, "Canada" vs "Remote", Maven's industry, BOSS/Boss.
- Case studies are thin (about 230–320 words).

## 15. Duplicate-content issues

| Issue | Status |
|---|---|
| 6 case-study aliases returning 200 | Fixed (redirects to the identical project) |
| Local SEO post duplicate | Already a single 308; verified |
| Tag archives, city pages, near-duplicate services | None exist |

The gallery repeating images to fill layout slots remains a minor design issue (audit O2).

## 16. IndexNow status

**Built, inert until configured.**
- Server utility with production-only guard.
- Key file at `/indexnow-key.txt`, which serves 404 until `INDEXNOW_KEY` is set. Tested with a test key: 200 + noindex.
- CMS hooks on update, unpublish and delete of live content.
- Manual script for new items after deploy.

Setup steps are in [INDEXNOW-SETUP.md](INDEXNOW-SETUP.md).

## 17. llms.txt status

**Implemented** at `/llms.txt`. It's generated from the service catalogue and CMS works and posts, so it can't drift. It contains only main pages, services, case studies (title + industry) and articles (title + category). There are no marketing claims.

It isn't a ranking signal: Google has said llms.txt is not used by Google Search.

## 18. Analytics status

- **Existing:** Vercel Web Analytics and Speed Insights, each behind an env flag. It's a single implementation, cookieless, with automatic SPA route tracking and no duplicate page views. There's no GA4 and no consent tooling, and none was added.
- **New conversion events**, through the same Vercel Analytics (`track()`), no-ops unless `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`, with no personal data:

| Event | Properties | Fired when |
|---|---|---|
| `lead_submitted` | `form: "contact_page" \| "quick_form"` | successful `/api/leads` response |
| `newsletter_subscribed` | `placement: "home" \| "checklist" \| …` | successful `/api/newsletter` response |
| `review_submitted` | — | successful `/api/reviews` response |

- **Not added (documented):** click events for email, phone and outbound project links. Those need small client wrappers around the server-rendered links. Custom events also require a Vercel plan that includes them.
- AI referral measurement: [AI-REFERRAL-TRACKING.md](AI-REFERRAL-TRACKING.md).

## 19. Crawlability status

- All public pages return 200 with complete server-rendered HTML inside `<main>`: 0 hidden stream blocks, one H1 each.
- Unknown URLs return a real 404 (verified for `/x`, `/blog/x`, `/works/x`, `/industries/x`).
- Private routes: robots disallow plus `X-Robots-Tag: noindex`. `/review` is `noindex, follow`.
- The live site returns 200 to search and AI crawler user agents (no WAF block seen).
- Middleware never runs on public pages.

## 20. Remaining external tasks

See [DANIEL-EXTERNAL-SEO-CHECKLIST.md](DANIEL-EXTERNAL-SEO-CHECKLIST.md) (28 items). Critical items:

- Deploy.
- Search Console domain property + sitemap.
- URL Inspection on key templates.
- Bing Webmaster Tools.
- Clear the SVG `og_image` values in the CMS.
- Resolve the factual conflicts.

## 21. Information required from Daniel

All of [ENTITY-DATA-NEEDED.md](ENTITY-DATA-NEEDED.md):

- Preferred "studio" vs "agency" positioning.
- Operating location (remote vs Mississauga/Toronto) and what CMS `location = Canada` means.
- Correct project years, industries and client spellings.
- Founder name, role, bio, photo and profiles, for Person schema.
- Founding year and LinkedIn company URL.
- Evidence for "26+ projects", "98% satisfaction", "10M gross revenue" and "24h response".
- Confirmation the testimonials and marquee logos are real and approved.
- Real case-study outcomes, testimonials, technologies and distinct images.

## 22. Items intentionally NOT implemented, and why

| Item | Why |
|---|---|
| LocalBusiness schema, address, GBP-style markup | No public physical address; Graphxify presents as remote. |
| Person / founder schema | No founder data exists in the repo. |
| Review / AggregateRating / FAQPage schema | No eligible, verified review data. FAQ markup would be for manipulation, not eligibility. |
| SearchAction | There's no site search. |
| Industry pages published | No substantial, verified industry copy yet. The architecture is ready and gated. |
| Blog / marketing copy rewrites | Claims need Daniel's sources or approval. There are no invented citations. |
| Deleting fabricated template data in `project-details.ts` | *QC pass: **deleted**, along with the demo works in `seed.sql` and `PROJECT_FILES_DUMP.txt`.* |
| Showing CMS `location` ("Canada") on case studies | Conflicts with the worldwide positioning. Kept "Remote" pending Daniel. |
| New training-crawler policy (for example ClaudeBot) | This is a business decision. The existing GPTBot and Google-Extended opt-outs are preserved. |
| GA4 / second analytics system | It would duplicate Vercel Analytics and need consent work. |
| Server-rendering homepage testimonials | Design and perf trade-off, and testimonials must be verified first. |
| Switching `dynamicParams` to true | Would change 404 behaviour. It needs a production test; for now, redeploy after publishing. |
| Applying the Supabase migration | A production schema change. It's provided as a draft in `supabase/drafts/`. |
| Gallery layout (repeated images) | Visual design; it needs more real images, not code. |
| 301 instead of 308 | Next's permanent redirects use 308, which Google treats identically. |

## 23. Tests / build results

| Check | Before | After |
|---|---|---|
| `npm run lint` | 0 errors, 13 warnings | 0 errors, 13 warnings (same pre-existing warnings, none introduced) |
| `npm run typecheck` | pass | pass |
| Tests | none exist | none exist. No test runner in the project, so none were added. |
| `npm run build` (no env) | fails: `supabaseKey is required` (expected locally) | same (unchanged; needs Supabase env) |
| `npm run build` (public Supabase env) | pass (77 pages) | pass (73 pages: the 6 duplicate work-alias pages are gone; feed and llms added; industry route prerenders 0 pages) |
| Rendered-HTML audit (24 routes) | 21/21 public pages hide content in a stream block; 2 pages with nested `<main>`; 10 alias URLs return 200 | 0 hidden stream blocks, 1 `<main>` and 1 H1 per page, all aliases 308, 404s correct |
| JSON-LD validation | disconnected entities; no case-study schema | 0 JSON errors, 0 unresolved references |

## 24. Deployment checklist

1. Commit to a branch and open a PR. The folder isn't a git repo yet: clone the real repository and copy these changes in, or `git init` and push.
2. The Vercel preview deploy should show `robots.txt` = `Disallow: /` and an `X-Robots-Tag: noindex` header. That confirms the preview guard.
3. On the preview, spot-check `/`, a case study, a post, `/feed.xml` and `/llms.txt`. Images should be sharp. The page source should contain the H1 text inside `<main>`.
4. Merge and deploy to production. Then run:
   - `curl -s https://www.graphxify.com/robots.txt`, which should show the six-agent group.
   - `curl -sI https://www.graphxify.com/works/axis-growth-platform`, which should return `308 → /works/boss-medical-clinic`.
   - `curl -s https://www.graphxify.com/services/web-design | grep -c 'hidden id="S:'`, which should return `0`.
5. Validate one of each page type in the Rich Results Test and the Schema Markup Validator.
6. Test the share preview of one post in the LinkedIn Post Inspector or Facebook Sharing Debugger. It should show the real cover, not a blank.
7. Search Console: resubmit the sitemap and run URL Inspection on the key templates.
8. Optionally set `INDEXNOW_KEY` and do the one-time submission.
9. Watch Vercel image-optimisation usage for the first few days.
10. Work through the Critical and High items in the external checklist.
