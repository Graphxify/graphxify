# Trust claims inventory

> **2026-09-29 production cleanup:** all blog claims listed in BLOG-CLAIMS-FOR-REVIEW.md were rewritten in the CMS ([PRODUCTION-CMS-CLEANUP-2026-09-29.md](PRODUCTION-CMS-CLEANUP-2026-09-29.md)). The deleted metrics (98%, 10M, 26+) remain removed.


## Status after Daniel's confirmations (2026-09-29)

**RESOLVED / CONFIRMED**
- **24-hour response:** confirmed commitment. Phrased as "We typically respond within 24 hours" in sentences; short labels ("24h", "Response: within 24 hours") kept.
- **Testimonials:** all 8 published testimonials confirmed real and approved. No schema.
- **Marquee client/project logos:** all 10 confirmed real Graphxify work, including the 6 without a public case study.
- **Project years:** FlyUp Line 2025, Pharmacy On King 2024, Luka Hair Salon 2023, King Medical Arts 2023.
- **Maven industry:** Fashion.
- **Official name:** B.O.S.S. Medical Clinic.
- **FlyUp Line branding:** confirmed.

**STILL NOT VERIFIED (not reinstated):** "98% client satisfaction", "10M gross revenue", "26+ projects" and every deleted template statistic. They stay removed.

**STILL REQUIRES ACTION:** the blog claims. See [BLOG-CLAIMS-FOR-REVIEW.md](BLOG-CLAIMS-FOR-REVIEW.md).

---

Pre-deployment QC, 2026-09-29. This is every numeric, outcome, ranking, performance or social-proof claim found in the codebase and the live CMS content it renders.

**Evidence standard:** "evidence exists" means a record in this repository or the CMS supports the claim. Nothing was assumed verified, and no support was invented.

**Status:**
- **Removed / Replaced**: changed in code in this pass.
- **Kept (flagged)**: innocuous, or a Graphxify commitment Daniel controls.
- **CMS / needs Daniel**: lives in CMS content, which I did not edit (no writes to the production database).

## A. Numbers and statistics

| Exact claim | Where | Renders publicly? | Evidence in repo/CMS? | Risk | Status |
|---|---|---|---|---|---|
| "26+ Finalized Projects" | `lib/constants.ts` `testimonialMetricsDefault` | **No.** Passed to `TestimonialsSection`, which ignores its `metrics` prop. | No | High | **Removed** (fallback emptied) |
| "98% Client satisfaction rate" | same | No | No | High | **Removed** |
| "10M Gross Revenue" | same | No | No (no owner, currency or period) | High | **Removed** |
| "26+ Projects delivered" | Home hero stats strip | **Yes** | **No.** The CMS has **6** published case studies; the marquee names 10 brands; the repo supports about **12 distinct client names** in total | High | **Replaced** with a live count: "6 Published case studies" (from the CMS works actually shown) |
| "4 to 8 wks Average launch" | Home hero | Yes | Partial. `/process` states "four to eight weeks end to end for most projects", but that's a stated range, not a measured average. | Medium | **Replaced** label → "Typical launch" |
| "24h Response time" / "We respond within 24 hours" | Home hero, home contact block, Contact page, About | Yes | No record (it's a service commitment) | Medium | **CONFIRMED by Daniel (2026-09-29).** Sentences now read "We typically respond within 24 hours". |
| "Lighthouse scores above 90 across all metrics", "above 90 out of the box" | `/services/web-development` (meta, hero, deliverables), `/services`, blog "Related Service" box | Yes | No measured scores recorded | Medium | **Replaced**: "engineered to a Lighthouse 90+ performance target" / "Performance budget targeting Lighthouse 90+" |
| "98" + "Lighthouse", "Commit 84% / Build 68% / Test 92%" | `services-page-content.tsx` `ServiceVisual` | Yes (as a decorative animated mock-up) | n/a (illustration) | Low | **Kept**. Wrapped in `aria-hidden` and documented as illustrative. Consider removing the "98" if it could be read as a claim. |
| "Built on Next.js 15" | `/services` web-dev micro-proof | Yes | The site runs Next 16 | Low | **Replaced**: "Built on Next.js" |
| Template metrics ("31% conversion lift", "42% pipeline growth", …) | `lib/project-details.ts` | No | No (fictional) | High | **Deleted** (see QC report §2) |
| "Unified marketing and CMS stack with measurable conversion lift", etc. | `supabase/seed.sql` demo works | Only if the seed were re-run | No (fictional) | High | **Deleted** from the seed |

## B. Ranking and outcome claims

| Exact claim | Where | Renders? | Evidence? | Risk | Status |
|---|---|---|---|---|---|
| "Loads instantly, ranks better, and scales without friction." | `constants.ts` services (home service cards) | Yes | No | High | **Replaced**: "Fast by design, technically sound for search, and built to scale." |
| "A site that loads fast, ranks better, …" | `/services/web-development`, `/services` | Yes | No | High | **Replaced**: "…is technically sound for search, …" |
| "Built to rank, load instantly, and scale without friction." | web-dev OG description | Yes (social previews) | No | High | **Replaced** |
| "…the main reason it performs better" | `/services/web-design` FAQ | Yes | No | Low | Kept (opinion). See CONTENT-TRUST-AUDIT. |
| "The stage most agencies skip." | `/process` | Yes | No | Low | Kept (opinion). |
| Blog statistics and guarantees ("up to 27%", "10–20% revenue", "will consistently outrank", "results within 30–60 days", "pays back in ~6 weeks", pricing ranges, "we also offer … SEO / GBP services") | CMS `posts.content` (6 posts) | **Yes** | No | High | **CMS / needs Daniel.** Full list with suggested edits in [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md) §B. These are already live today, so deploying doesn't make them worse. Fix them in the CMS. |

## C. Social proof

| Exact claim | Where | Renders? | Evidence? | Risk | Status |
|---|---|---|---|---|---|
| "Trusted by Clients" (heading above testimonials) | `/about` | Yes | Depends on testimonial authenticity (see [CLIENT-PROOF-NEEDS-VERIFICATION.md](CLIENT-PROOF-NEEDS-VERIFICATION.md)) | Medium | **Resolved:** testimonials confirmed |
| 8 published testimonials, all rated 5 | CMS `testimonials` → home (client component), `/about` (server HTML) | Yes | **Confirmed real and approved by Daniel** | Low | Kept. No Review/AggregateRating schema. |
| 10 client logos in the marquee | CMS `marquee_items` → home | Yes | **All 10 confirmed real work by Daniel** (6 have no public case study, which is legitimate) | Low | Kept |
| "Client Stories" | Home heading | Yes | same as testimonials | Low | Kept |

## D. Descriptive copy (innocuous, kept)

"No handoffs, no gaps, no surprises", "Independent Design Studio" (pill), "Built on structure. Designed to scale.", "A studio that does both." These are brand voice with no factual assertion that can be verified.

## E. Not public

- `app/dashboard/(components)/testimonial-metrics-form.tsx` uses the input placeholder `"26+"`. Admin-only UI, not a claim.
