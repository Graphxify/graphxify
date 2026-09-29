# IndexNow — production status

**Status: ACTIVE** (2026-09-29)

| Item | Value |
|---|---|
| Key storage | Vercel env var `INDEXNOW_KEY`, **encrypted, Production only**. Not in Git, docs or CI. |
| Key fingerprint | SHA-256 prefix `9e4d4be0`, 32 characters. The full key is deliberately not recorded here. |
| Key file | `https://www.graphxify.com/indexnow-key.txt` returns **200** `text/plain`, `X-Robots-Tag: noindex`. The served value matches the Vercel value (fingerprint compared). |
| Endpoint | `https://api.indexnow.org/indexnow`, shared with Bing, Yandex, Seznam, Naver and others. **Google doesn't use IndexNow.** |
| Activated by | Production deployment `dpl_5uSyvaCaNkRVqWVyZQUsDUw7J6E4` (commit `cea832b`, PR #6) |

## One-time initial submission

| When (UTC) | URLs | Source | Response |
|---|---|---|---|
| 2026-09-29 15:56 | 26 | `npm run indexnow:submit -- --sitemap` (every URL in the live sitemap) | **HTTP 202**: accepted; key validation pending |

A 202 means the search engine accepted the batch and will verify the key file asynchronously. **Don't re-run `--sitemap`.** IndexNow is for changes, not periodic full resubmission.

## Submission logic audit

| Check | Result |
|---|---|
| Submits only from production | Yes. `VERCEL_ENV === "production"`, or an explicit `INDEXNOW_FORCE=true` for the manual script. Preview, local and CI builds never ping. |
| Same-host URLs only | Yes. Other hosts are dropped before sending. |
| Can a failure break a CMS save? | No. It runs in `after()` with an 8 s timeout, and errors are logged and swallowed. |
| What the CMS auto-pings | Updates and deletions of **published** posts and case studies, including the old URL when a slug changes, plus the index page. |
| What it does not auto-ping | **New** items. `dynamicParams = false` means they 404 until the next deploy. Flow: publish → redeploy → `npm run indexnow:submit -- /blog/<slug> /blog`. |
| Manual script safety | Verifies that the live key file serves the same key before sending. It prints only the status and URL count. |
| Key validation | 8–128 characters of `[a-zA-Z0-9-]`, enforced by both the route and the script |

## Monitoring

- **Bing Webmaster Tools → IndexNow** lists URLs received per day. It becomes available after Daniel verifies the site ([DANIEL-SEARCH-SETUP-ACTIONS.md](DANIEL-SEARCH-SETUP-ACTIONS.md) §5). Expect the 26 URLs from 2026-09-29.
- Vercel runtime logs: search for `IndexNow submission rejected`. Any line there means a non-200/202 response.
- `npm run check:production-seo` fails if the key file stops serving.

## Rotating the key

1. Generate a new key.
2. Update `INDEXNOW_KEY` in Vercel (Production).
3. Redeploy.
4. Verify the key file.

Future submissions use the new key automatically. No resubmission is needed.
