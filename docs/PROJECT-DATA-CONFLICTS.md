# Project data conflicts

> **Production CMS synchronised 2026-09-29.** Applied directly (see [PRODUCTION-CMS-CLEANUP-2026-09-29.md](PRODUCTION-CMS-CLEANUP-2026-09-29.md)): FlyUp Line year 2022→2025 plus Branding in services, card services and role; the B.O.S.S. Medical Clinic name in title and 8 text/SEO fields; Maven industry → Fashion, plus 8 short/SEO fields and the `challenge` paragraph; `works.location` default dropped, the 6 bulk "Canada" values cleared, and the column documented. Pharmacy On King, Luka Hair Salon and King Medical Arts already had the confirmed years (no write). **`supabase/drafts/confirmed-facts-2026-09-29.sql` is superseded. Don't run it.** (It's harmless if run, because every statement is guarded.)
>
> **Update:** Maven `overview` and `content` were also corrected, so the **drift check now reports 0 conflicts**.
>
> **Drift check after the first cleanup (historical):** one remaining warning, `maven.overview` contains "women's fashion". It's long-form prose deliberately left for Daniel. The site's render-time correction already shows "fashion brand" there, but the sentence "without relying on traditional feminine clichés" still frames it. The unrendered `maven.content` field still contains similar wording and isn't part of the drift check's select.
>
> **Structured data:** the year is no longer emitted as `CreativeWork.dateCreated` (only a year is confirmed, not a date). It remains project data in the registry.


Last updated 2026-09-29 (confirmed facts from Daniel applied).

**Sources:**
- **Registry:** `src/lib/project-card-content.ts`, the single code-side source of confirmed facts.
- **CMS:** live Supabase `works`, read-only.
- **Fallback:** `src/lib/project-details.ts`, which now passes through the registry.

## How project facts work now

- **The registry is authoritative** for the official name, the normalized industry, the delivery year (only when confirmed) and the confirmed service list. Every page, card, service-page related-work list, JSON-LD block, OG tag and llms.txt reads these facts from it. The code fallback is mapped through the same registry, so it can't disagree.
- **The CMS is authoritative for everything else:** copy, images, SEO text, timelines.
- **Exact-phrase corrections** (official name; Maven's industry wording) are applied to CMS text at render time. The same corrections are in the SQL data fix.
- **Drift check:** `findProjectFactDrift()` runs once per build and logs `[project-facts] CMS value differs from confirmed fact` for each CMS field that contradicts the registry. After `supabase/drafts/confirmed-facts-2026-09-29.sql` has run, only Maven's `challenge` paragraph should still be reported.
- **Project year ≠ modification date.** The year is exposed only as `CreativeWork.dateCreated`. The sitemap `lastmod` and `dateModified` come from CMS `updated_at` and never from the year.

## RESOLVED

| Item | Confirmed value | Where applied | CMS today | CMS fix |
|---|---|---|---|---|
| FlyUp Line year | **2025** | Registry, fallback, `dateCreated` | 2022 | SQL §1 |
| Pharmacy On King year | **2024** | Registry, fallback, `dateCreated` | 2024 (matched) | guarded no-op |
| Luka Hair Salon year | **2023** | Registry, fallback (was 2026), `dateCreated` | 2023 (matched) | guarded no-op |
| King Medical Arts year | **2023** | Registry, fallback (was 2026), `dateCreated` | 2023 (matched) | guarded no-op |
| Maven industry | **Fashion** (Daniel: "fashion wear") | Registry, fallback, case-study rail, JSON-LD `about`, Brand Systems related work, llms.txt; card outcome text; the render-time phrase corrections fix the meta/OG/Twitter titles and descriptions and the subtitle/overview/excerpt | "Women's Fashion" plus "streetwear label" / "women's fashion label" phrases | SQL §4 |
| Official name | **B.O.S.S. Medical Clinic** | H1, `<title>`, OG/Twitter, image alt, JSON-LD, cards, Web Development + Brand Systems related work, llms.txt, fallback copy, seed SQL | "Boss Medical Clinic" (title, copy) / "BOSS Medical Clinic" (SEO fields) | SQL §3 |
| URL | `/works/boss-medical-clinic` (**unchanged**) | — | — | — |
| FlyUp Line services | **Branding**, Website Design, UX Strategy | Registry, case-study services rail, JSON-LD `keywords`, works-index card tags, fallback | Website Design, UX Strategy | SQL §2 |
| Project `location` meaning | **Client location / primary market** (not Graphxify's) | Dashboard label "Client location / market" with a new placeholder. The rail shows a "Client location" cell only when a real value exists. The retired "Remote" cell was removed. | "Canada" on all rows (a bulk default) | SQL §5 drops the column default, documents the column, and clears the exact bulk value |
| Legacy "Canada" default | not a per-project fact | Ignored by `getClientLocation()`; removed from `work-cms-fields.sql` and `migrate-and-seed-works.sql` so it can't come back | — | SQL §5 |
| Historical seed scripts | — | `migrate-and-seed-works.sql`, `seed-works-seo.sql`, `seed-og-metadata.sql`, `seed-seo-metadata.sql`, `work-cms-fields.sql` corrected (names, Maven wording, no Canada default, FlyUp branding) | — | — |

## STILL REQUIRES ACTION

| Item | Why | Who |
|---|---|---|
| **Run** `supabase/drafts/confirmed-facts-2026-09-29.sql` in the Supabase SQL editor | The CMS still holds the old values. The site renders the confirmed facts regardless, but CMS editors see stale data and the build logs drift warnings. | Daniel |
| Maven `challenge` paragraph | It's written around women's fashion ("Women's fashion branding often leans heavily on soft visuals … feel feminine without being delicate …"). It's prose, so it wasn't rewritten automatically, and it still renders. | Daniel (rewrite in the dashboard, or confirm it's accurate) |
| Maven and B.O.S.S. delivery years | CMS and code agree (2025 / 2024), but they weren't in the confirmed list, so `dateCreated` is omitted for these two | Daniel (optional: confirm to publish) |
| Client locations | All six are empty after the SQL. Enter real values only if you want them shown. | Daniel (optional) |
| "Pharmacy On King" vs marquee label "Pharmacy on King" | Cosmetic styling difference in the CMS marquee | Daniel (optional) |

## History

- Before 2026-09-29, the CMS and the code disagreed on 4 project years, on Maven's industry ("Women's Fashion" vs "Fashion and Streetwear" / "streetwear concept") and on the BOSS/Boss spelling.
- The CMS `location` value was a column default ('Canada') bulk-applied by `migrate-and-seed-works.sql`.
- In the QC pass the year was withheld from JSON-LD and the location was hidden, pending Daniel's answers.
- The `king-medical-art-pharmacy` slug (missing "s") is an established URL and is intentionally not renamed.
