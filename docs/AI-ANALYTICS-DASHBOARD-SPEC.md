# AI & search analytics dashboard — specification

**This is a spec only.** No dashboard has been built and no data exists yet. Build it once GA4 and Search Console each have at least 4 weeks of data. Every panel must show real numbers from its source, or state "No data yet". Nothing may be modelled, estimated or placeholder.

## Sources

| Source | Access | Available from |
|---|---|---|
| Google Search Console, Domain property `sc-domain:graphxify.com` | Looker Studio native connector, or the Search Console API | About 2–3 days after verification; 16 months of history maximum |
| GA4 property | Looker Studio native connector | From the day `NEXT_PUBLIC_GA_MEASUREMENT_ID` is deployed |
| Bing Webmaster Tools | Manual CSV export (no Looker connector) | After verification |
| Vercel Web Analytics | Vercel dashboard only (no export API on most plans) | Already live |
| AI visibility checks | `data/search-ai-query-benchmark.json` + manual log | When the first manual check is recorded |

Recommended tool: **Looker Studio**. It's free, connects natively to GSC and GA4, and viewers can be shared read-only.

## Page 1 — Search overview (GSC)

| Panel | Metric | Dimension | Notes |
|---|---|---|---|
| Scorecards | Clicks, impressions, average CTR, average position | — | Compare with the previous period |
| Trend | Clicks + impressions | Date (weekly) | Annotate deploy dates |
| Brand vs non-brand | Clicks | Query, split by regex `graphxify` | Brand demand is a signal of entity strength |
| Top pages | Clicks, impressions, CTR | Page | Filter to the 26 sitemap URLs |
| Service queries | Impressions, position | Query | The query list from the benchmark file, category `service` |

## Page 2 — Leads and attribution (GA4)

| Panel | Metric | Dimension |
|---|---|---|
| Key events | `project_inquiry` count | Date |
| Inquiries by channel | `project_inquiry` | Session default channel group |
| Inquiries by form | `contact_form_submit` | `form` |
| CTA engagement | `primary_cta_click` | `cta_location` |
| Contact clicks | `email_click`, `phone_click` | `link_location` |
| Outbound project clicks | `outbound_project_click` | `project` |

## Page 3 — Known AI referral traffic

| Panel | Metric | Dimension | Caveat shown on the panel |
|---|---|---|---|
| AI sessions | Sessions, engaged sessions | Session custom channel group = Known AI referral traffic | "Click-throughs only; excludes citations, stripped referrers and Google AI features" |
| By platform | Sessions | Session source | — |
| AI landing pages | Sessions | Landing page | — |
| AI-referred inquiries | `project_inquiry` | `ai_referral` | Small numbers. Show raw counts, not percentages, below 30 |

## Page 4 — AI visibility log (manual)

A table fed from a Google Sheet that mirrors the benchmark file. It has these columns: date checked, assistant, query ID, query, *Graphxify mentioned (Y/N)*, *cited URL*, *description accurate (Y/N/partial)*, notes.

- Only rows from real checks are allowed. An unchecked query shows as blank, **not** "N".
- The trend is the share of checked queries where Graphxify is mentioned, per assistant, per quarter.

## Page 5 — Indexing health

| Panel | Source |
|---|---|
| Indexed vs not indexed pages | GSC → Pages (manual monthly entry, since the API doesn't expose it) |
| Core Web Vitals (field) | GSC → Core Web Vitals, or the CrUX dashboard |
| IndexNow submissions | Bing WMT → IndexNow (manual) |
| CI Lighthouse medians | GitHub Actions artifacts (`.lighthouseci`) |

## Access

Share read-only with named Google accounts. Don't use "anyone with the link" for data that includes lead counts.
