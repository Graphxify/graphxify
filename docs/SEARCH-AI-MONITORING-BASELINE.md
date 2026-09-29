# Search and AI-visibility monitoring baseline

**Baseline status (2026-09-29): no search-performance or AI-visibility results have been recorded yet.** The query set exists. Its results don't. Nothing here, and nothing in the benchmark file, is estimated or simulated.

## What's in place

| Layer | Status | Where |
|---|---|---|
| Technical SEO regression suite | Live in CI on every push | `npm run test:seo`, `scripts/seo-check.mjs` |
| Production health check | Run on demand | `npm run check:production-seo` (read-only GETs) |
| Browser smoke tests | Live in CI | `tests/e2e/pages.spec.ts` (never submits forms) |
| Lighthouse CI | Live in CI; tolerant thresholds; 3 runs | `lighthouserc.json` |
| Query benchmark | **72 queries**, 0 checks recorded | [`data/search-ai-query-benchmark.json`](../data/search-ai-query-benchmark.json) |
| Search Console | Waiting for Daniel | [SEARCH-CONSOLE-BASELINE.md](SEARCH-CONSOLE-BASELINE.md) |
| Bing Webmaster Tools | Waiting for Daniel | [DANIEL-SEARCH-SETUP-ACTIONS.md](DANIEL-SEARCH-SETUP-ACTIONS.md) §5 |
| GA4 | Code ready; waiting for a Measurement ID | [GA4-SETUP.md](GA4-SETUP.md) |
| Vercel Web Analytics | Enabled for Production | Vercel dashboard |
| AI referral classification | Live in code | [AI-REFERRAL-MEASUREMENT.md](AI-REFERRAL-MEASUREMENT.md) |
| IndexNow | See status doc | [INDEXNOW-PRODUCTION-STATUS.md](INDEXNOW-PRODUCTION-STATUS.md) |

## Query benchmark

The 72 queries are grouped by category:

| Category | Count | What it tests |
|---|---|---|
| `brand` | 10 | Entity recognition: does "Graphxify" resolve to this site? |
| `service` | 17 | Service pages for core commercial terms |
| `industry` | 9 | Case studies for vertical terms (pharmacy, clinic, salon, fashion, moving) |
| `case-study` | 8 | Project-name queries |
| `informational` | 18 | Blog, process and resource pages |
| `ai-assistant` | 10 | Prompts phrased the way people ask assistants |

Every query has a `target_url` that's a live, indexable sitemap page.

## How to run a check (manual, quarterly)

1. **Search surfaces** (Google, Bing): use a private window, signed out, location set to Canada. Record the rank of the target URL (or any graphxify.com URL) in the top 20, or `null`.
2. **AI assistants** (ChatGPT, Perplexity, Claude, Gemini, Copilot, Google AI Mode): start a fresh chat with no memory or custom instructions and paste the query verbatim. Record:
   - `mentioned`: true or false;
   - `cited_url`: the Graphxify URL cited, if any;
   - `description_accurate`: yes, no or partial, compared against the site's facts.
3. Append one object to that query's `checks` array, following `check_record_format`, and commit it.
4. **Record only what you observed.** If a query wasn't checked, leave it out. Don't add `false`.

Answers vary from run to run, so compare quarter against quarter. Don't read much into single observations.

## Monthly metrics to log (once each source exists)

- GSC: clicks, impressions, indexed pages, brand-query clicks.
- GA4: `project_inquiry` total; sessions and inquiries from **Known AI referral traffic**.
- Bing WMT: IndexNow URLs received; indexed pages.
- CI: median Lighthouse performance, accessibility and SEO from the last `main` run.
