# External SEO & AI-visibility checklist

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

These tasks can't be done in the codebase. **Who:** D = Daniel · Dev = developer · M = marketing. Priorities are relative, and none of these guarantees rankings or AI citations.

## Critical — do first

| # | Who | Where | What | Info needed |
|---|---|---|---|---|
| 1 | Dev | Vercel | Deploy this branch. Confirm Production env vars exist: `NEXT_PUBLIC_SITE_URL=https://www.graphxify.com`, Supabase URL/keys. Run the deployment checklist in the implementation report. | Vercel access |
| 2 | D | Google Search Console | Verify the **Domain property** `graphxify.com` (DNS TXT), so www, non-www, http and https are all covered. Submit `https://www.graphxify.com/sitemap.xml`. | DNS access at the registrar |
| 3 | D | Google Search Console | **URL Inspection → Test live URL** on `/`, `/services/web-design`, one case study and one post. Confirm "rendered HTML" contains the page text and that the canonical is the page itself. Request indexing for the 6 case studies. | — |
| 4 | D | Google Search Console → Removals / Pages | Watch "Page with redirect" for the 7 redirected `/works/*` URLs (see QC report §1). The 4 demo-project aliases should show as "Not found (404)". They should move there over the coming weeks. No action is needed unless they stay "Indexed". | — |
| 5 | D | Bing Webmaster Tools | Add the site, which can be **imported from Search Console**. Submit the sitemap. | Microsoft account |
| 6 | D | Dashboard (CMS) | **Clear the SVG `og_image` values** on all 6 blog posts (`/assets/post-1..3.svg`). Code now ignores them, but the CMS should hold real images. | — |
| 7 | D | — | Answer [ENTITY-DATA-NEEDED.md](ENTITY-DATA-NEEDED.md) §1 (conflicting facts) and §5 (trust figures). | Business records |

## High

| # | Who | Where | What | Info needed |
|---|---|---|---|---|
| 8 | D | Vercel env + terminal | **IndexNow:** generate a key, set `INDEXNOW_KEY` (Production), redeploy, run the one-time `--sitemap` submission. See [INDEXNOW-SETUP.md](INDEXNOW-SETUP.md). | — |
| 9 | D / M | Blog (CMS) | Fix the High-risk claims in [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md), especially the "we offer SEO / GBP services" line and the unsourced statistics. | Sources, or approval to remove |
| 10 | D | Case studies (CMS) | For each of the 6 projects: real outcomes, an approved testimonial, 6 distinct images, and the correct year, industry and client spelling. | Client permission |
| 11 | D | LinkedIn | Create or confirm the **company page**. Use the same name, logo, description, URL and service area as the site. Then send the URL to the developer to add to `sameAs`. | — |
| 12 | D | Behance / Dribbble | Behance (`/graphxify`) is already linked. Make sure each project there links back to its `/works/<slug>` page. Create Dribbble only if you'll maintain it. | — |
| 13 | D | Google Business Profile | **Only if** Graphxify has a legitimate eligible presence. GBP allows service-area businesses **without** a public address. Don't create one with a fake or virtual address. | Eligibility decision |
| 14 | D | Clients | Ask each past client for a **genuine review** on a public platform (Google, if you have a GBP, or Clutch). Never incentivise reviews or write them yourself. Don't mark them up with schema on your own site. | Client contacts |
| 15 | D | Clients | Ask clients whose live sites Graphxify built for a **"Website by Graphxify"** footer credit or a mention on their About page, linking to the matching case study. | Client consent |

## Medium

| # | Who | Where | What | Info needed |
|---|---|---|---|---|
| 16 | D | Clutch, DesignRush, GoodFirms, Sortlist | Create profiles **only on platforms you'll keep updated**. Keep name, description, URL and services identical to the site. Clutch reviews are interview-verified, which carries more weight than self-listed directories. | Portfolio, rates, client references |
| 17 | D | Awards | Submit the strongest projects (Maven, FlyUp Line) to design awards (for example Awwwards, CSS Design Awards, Communication Arts) where they genuinely fit. | Project assets |
| 18 | M | Digital PR | Pitch a genuinely useful angle, for example "what three pharmacy websites taught us about accessibility", to local business or industry publications. | Real project lessons |
| 19 | D | Search Console + Bing | Monthly: review queries, pages, Core Web Vitals (field data), and indexing issues. Bing: check **IndexNow** and AI Performance (if shown). | — |
| 20 | D | Vercel Analytics | Enable Web Analytics (`NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`) if it's not on. Confirm the plan supports **custom events**. Set up the AI-referrer view from [AI-REFERRAL-TRACKING.md](AI-REFERRAL-TRACKING.md). | Plan details |
| 21 | D | Vercel Speed Insights | Enable it (`NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS=true`) to get **real-user** LCP/INP/CLS. The lab text-LCP delay on the homepage needs field data to confirm. | — |
| 22 | M | — | **Competitor research:** list 5–10 studios competing for the same clients, and note their service pages, proof and content gaps. | — |
| 23 | M | Ahrefs / Semrush / Bing WMT backlinks | **Backlink audit:** list existing referring domains, reclaim broken links to old URLs (redirects already exist), and find unlinked brand mentions. | Tool access |

## Low / ongoing

| # | Who | Where | What |
|---|---|---|---|
| 24 | D / M | ChatGPT, Perplexity, Claude, Copilot, Gemini, Google AI Mode | **AI-query tracking:** quarterly, ask 10 fixed questions (for example "web design studio for pharmacies", "who designed FlyUp Line's website", "what is Graphxify") and log whether Graphxify appears, how it's described and which URL is cited. Correct any factual errors at their source (the site or profiles). |
| 25 | D | Original research | Only if feasible: a small, honest dataset from your own projects (for example page-weight or CWV before and after rebuilds). Original data is the most citable content type. |
| 26 | Dev | Vercel / Cloudflare | Re-run [AI-CRAWLER-VERIFICATION.md](AI-CRAWLER-VERIFICATION.md) after any firewall or bot-protection change. |
| 27 | D | robots policy | Decide whether to also opt out of **ClaudeBot** (training) to match the existing GPTBot and Google-Extended opt-outs. It's a business choice, and search access is unaffected either way. |
| 28 | Dev | Supabase | When ready, apply `supabase/drafts/seo-content-fields.sql`, then wire the new fields (alt text, testimonial, technologies, `published_at`) into the queries and templates. |
