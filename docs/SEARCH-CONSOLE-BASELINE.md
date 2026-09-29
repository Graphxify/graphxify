# Search Console baseline

**No meaningful Search Console performance history is available yet.**

Claude has no access to Google Search Console (there's no OAuth connection), so no clicks, impressions, index-coverage or URL-inspection data has been read. **Nothing in this file is estimated.** Daniel fills it in from actions 1–4 in [DANIEL-SEARCH-SETUP-ACTIONS.md](DANIEL-SEARCH-SETUP-ACTIONS.md).

## What is known (verified 2026-09-29, from public data only)

| Item | Finding |
|---|---|
| Property type to use | Domain property `sc-domain:graphxify.com` |
| Verification | DNS for `graphxify.com` (Vercel DNS) already has **two `google-site-verification` TXT records**, so the domain has been verified before. Whether Daniel's account is an Owner is **unconfirmed**. |
| Sitemap | `https://www.graphxify.com/sitemap.xml`: 200, 26 URLs, all 200, indexable and self-canonical |
| robots.txt | Allows Googlebot on all public pages; declares the sitemap |
| Pre-merge state | Until 2026-09-29, production served an older build with 6 duplicate case-study URLs and demo projects. Search Console will show those URLs moving to "Page with redirect" / "Not found (404)" over the coming weeks. That's expected. |

## To fill in (Daniel)

**Date captured:** ____

### Performance (last 3 months, Web search)
| Metric | Value |
|---|---|
| Clicks | |
| Impressions | |
| Average CTR | |
| Average position | |
| Top 5 queries | |
| Top 5 pages | |

### Indexing → Pages
| Metric | Value |
|---|---|
| Indexed | |
| Not indexed | |
| Top reasons | |

### URL Inspection
| URL | On Google? | Google-selected canonical | Indexing requested |
|---|---|---|---|
| `/` | | | |
| `/services/web-design` | | | |
| `/services/web-development` | | | |
| `/works` | | | |
| `/works/flyup-line` | | | |
| `/works/maven` | | | |
| `/works/boss-medical-clinic` | | | |
| `/blog/how-to-choose-a-web-design-agency` | | | |
| `/about` | | | |
| `/contact` | | | |

### Sitemap
| Submitted | Status | Discovered pages |
|---|---|---|
| | | |

### Core Web Vitals (field)
Mobile: ____ Desktop: ____ ("Not enough data" is a valid entry.)
