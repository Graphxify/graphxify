# Search-platform & measurement setup — final report

**Date:** 2026-09-29 · **Production:** `main@cea832b` (PR #6, squash-merged) · deployment `dpl_5uSyvaCaNkRVqWVyZQUsDUw7J6E4`, READY

## A. Summary

The code, CI, IndexNow and the monitoring foundation are live and verified in production. Search Console, Bing Webmaster Tools and the GA4 property need Daniel's own Google or Microsoft login, and they're documented step by step in [DANIEL-SEARCH-SETUP-ACTIONS.md](DANIEL-SEARCH-SETUP-ACTIONS.md). No search, analytics or AI-visibility data was invented anywhere.

## B. Deployment

- **Flow:** branch `search-platform-setup` → PR #6 → CI green and Vercel preview READY → squash-merge by Daniel → production READY.
- **Rollback target:** `dpl_9pwFarXcjxt43ofgca8SHd9eBrgq` (`66a202a`).

## C. Homepage hydration error #418

**FIXED.** Vercel prerendered `/` with pathname `/index` (RSC tree `["","index"]`), so the header's "Home" link was inactive in the server HTML and active on the client. `MarketingHeader` now normalises `/index` to `/`. There's no visual change.

Production verification: **0 console errors** on `/`, `/services/web-design`, `/works`, `/works/flyup-line`, a blog post and `/contact`, at both 412 px and 1440 px.

## D. Google Search Console

**Waiting for Daniel.** Claude has no Search Console access. Two `google-site-verification` TXT records already exist on `graphxify.com` (Vercel DNS), so the Domain property was verified before. Daniel needs to confirm he's an owner, submit the sitemap and inspect the 10 key URLs. [SEARCH-CONSOLE-BASELINE.md](SEARCH-CONSOLE-BASELINE.md): *"No meaningful Search Console performance history is available yet."*

## E. Bing Webmaster Tools

**Waiting for Daniel.** Recommended route: *Import from GSC*, which auto-verifies and brings the sitemap. There's no Bing verification file or meta tag today.

## F. IndexNow

**ACTIVE.**
- The key file returns 200, and its fingerprint `9e4d4be0` matches the value in Vercel.
- The one-time submission of **26 sitemap URLs** returned **HTTP 202**.
- The logic audit passed.

See [INDEXNOW-PRODUCTION-STATUS.md](INDEXNOW-PRODUCTION-STATUS.md).

## G. GA4

**Code live, inert.** It loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` holds a valid `G-` ID. That ID isn't set, and production makes 0 Google requests (verified). Existing-property check and ID: Daniel, action 7. Consent and privacy-policy decision: Daniel, action 6, **before** setting the ID. See [GA4-SETUP.md](GA4-SETUP.md).

## H. Vercel Web Analytics

**Enabled** (`NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`, Production). The script is served from Vercel's first-party path and `window.va` is present. The automated headless probe didn't show a page-view beacon; the Vercel dashboard confirms real visits.

## I. Speed Insights

**Not enabled.** The product is disabled at project level. Optional: Daniel, action 11.

## J. Events

| Event | Implemented |
|---|---|
| `contact_form_submit` | Yes: successful `/api/leads` only |
| `project_inquiry` | Yes: GA4 only, fires alongside the above |
| `primary_cta_click` / `email_click` / `phone_click` / `outbound_project_click` | Yes: one delegated listener; verified with a stubbed `gtag` |
| `newsletter_subscribed` / `review_submitted` | Unchanged |

There's no PII in event parameters.

## K. Key event

`project_inquiry` is the single key event, marked in GA4 by Daniel (action 8). Don't also mark `contact_form_submit`.

## L. UTM preservation

UTMs survive every legacy 308 redirect and the apex → www redirect (verified). First-touch landing page, UTMs and AI label are stored in `sessionStorage` and attached to lead events.

## M. AI referral classification

`src/lib/ai-referrals.ts` labels visits "Known AI referral traffic" from referrer host or `utm_source`, covering 11 platforms. It has 4 unit tests. The GA4 channel-group regex is exported from the same file. The limits (citations without clicks, stripped referrers, Google AI features) are in [AI-REFERRAL-MEASUREMENT.md](AI-REFERRAL-MEASUREMENT.md).

## N. Dashboard

**Spec only**, in [AI-ANALYTICS-DASHBOARD-SPEC.md](AI-ANALYTICS-DASHBOARD-SPEC.md). No charts were built and no data was mocked.

## O. GitHub Actions CI

**Fixed.**
- **What was wrong:** the build had failed with `supabaseKey is required` since July.
- **Config:** it now uses 3 **public** repository variables. There are no secrets and no service-role key, and the token is `contents: read`.
- **Steps:** lint → typecheck → build → `test:seo` → Playwright → Lighthouse CI.
- **Result:** green on PR #6.

## P. `npm run test:seo`

The read-only HTTP suite (`scripts/seo-check.mjs`) covers:
- robots, the sitemap and every sitemap page;
- title, description, canonical, indexability, a single H1, server-rendered `<main>`, OG and Twitter tags;
- JSON-LD validity and forbidden types;
- redirects, 404s, llms.txt, the feed and the IndexNow route;
- secret patterns.

CI result: **651 passed, 0 failed**.

## Q. Playwright

**18/18 passing** in CI, across the unit, desktop and mobile projects. It covers the homepage, Web Design, Work, the FlyUp Line case study, a blog article, the contact-form UI (never submitted; `/api/leads` is blocked) and the 404 page. It also catches console and hydration errors and horizontal overflow.

## R. `npm run check:production-seo`

The same suite plus production-only checks (IndexNow key, host redirects). **653 passed, 0 failed** on production after the deploy.

## S. Image-performance guard

It fails if any page's `<img src>` is a raw (unoptimised) Supabase Storage object over 1 MB. There are none today.

## T. Lighthouse CI

`lighthouserc.json` runs 4 pages × 3 runs with median assertions:
- performance at least 0.7 (warn);
- accessibility and SEO at least 0.9 (error);
- best practices at least 0.85 (warn);
- CLS at most 0.1 (warn).

It passed in CI. Reports are uploaded as a workflow artifact, not to public storage.

## U. B.O.S.S. landscape social image

**Waiting for Daniel** (optional, action 9). The CMS `og_image` field already supports it, and its hint says 1200×630. No image was invented.

## V. Query benchmark

[`data/search-ai-query-benchmark.json`](../data/search-ai-query-benchmark.json) holds **72 queries** in 6 categories. Each maps to a live sitemap URL, and **0 checks are recorded**.

## W. Monitoring baseline

[SEARCH-AI-MONITORING-BASELINE.md](SEARCH-AI-MONITORING-BASELINE.md) covers the method, cadence and metrics. No results are recorded yet.

## X. Environment variables

The names, scopes and public/secret status are in [PRODUCTION-ENVIRONMENT-VARIABLES.md](PRODUCTION-ENVIRONMENT-VARIABLES.md). No values are recorded. `.gitignore` now ignores every `.env.*` except `.env.example`.

## Y. Security

- Every push was gated on a secret scan. The staged diff was checked for the exact token and key values, and none were present.
- There are no secrets in CI.
- The IndexNow key was handled in memory only and never printed.
- **The GitHub, Vercel and Supabase tokens pasted in chat must be revoked** (Daniel, action 10).

## Z. Daniel actions

The full format, with exact steps and statuses, is in [DANIEL-SEARCH-SETUP-ACTIONS.md](DANIEL-SEARCH-SETUP-ACTIONS.md):
1. Confirm Search Console ownership (GSC).
2. Submit the sitemap (GSC).
3. Inspect the key URLs (GSC).
4. Record the GSC baseline.
5. Set up Bing Webmaster Tools.
6. Make the consent decision and update the privacy policy.
7. Get the GA4 Measurement ID.
8. Configure GA4.
9. Add the B.O.S.S. landscape image (optional).
10. Revoke the tokens.
11. Decide on Speed Insights and Vercel custom events (optional).

## AA. Known issues / not done

| Item | Why |
|---|---|
| Vercel preview not browser-tested | Deployment Protection requires a login. Protection settings weren't changed. The fix was verified on production instead. |
| Lighthouse CI can't finish on Windows | A known `chrome-launcher` temp-dir EPERM bug. Linux CI is unaffected. |
| 12 pre-existing lint warnings (unused variables) | Not in scope; 0 errors |
| GitHub Actions warning: Node 20 action runtime deprecation | Informational; the actions still run |
| `http://graphxify.com` takes 2 hops | Vercel platform behaviour |

## AB. Next phase

Graphxify's search-platform and measurement foundation is configured. The next phase is external entity authority, reviews/backlinks, case-study evidence, authoritative content and AI-visibility monitoring.
