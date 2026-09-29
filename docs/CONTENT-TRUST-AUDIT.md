# Content trust audit

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

Claims that are unsupported, absolute, outdated or inconsistent with what Graphxify actually offers. Web-grounded AI systems and search quality systems both favour content whose claims are specific, sourced and consistent with the rest of the site. This is also basic credibility with human readers.

**No copy was rewritten in this pass**, except titles and metadata. This list is for Daniel to action. **No citations were invented:** where a statistic needs a source, the action is "find the primary source or remove it", never "add a plausible-looking link".

Risk: **High** = could mislead or be read as a guarantee/fabrication · **Medium** = unsourced or overstated · **Low** = tone / precision.

## A. Marketing pages and site data

| Page | Section | Claim | Risk | Suggested action |
|---|---|---|---|---|
| `src/lib/project-details.ts` | fallback data (not rendered) | Invented metrics ("31% conversion lift", "42% pipeline growth", "Lighthouse 98"…) and testimonials attributed to fictional people at fictional companies (Northline, Vertex, Axis, Lumen, Atlas, Meridian) | **High** | *QC: **deleted.*** Delete `metrics`, `testimonial`, `timelineSteps`, `chapters` and `tabPanels` content, or replace it with real data. Only the unused `project-detail-renderer.tsx` reads it, so it can go live if that component is ever re-wired. |
| Home (fallback) / `constants.ts` `testimonialMetricsDefault` | Testimonials metrics | "98% Client satisfaction rate", "10M Gross Revenue", "26+ Finalized Projects" | **High** | *QC: **removed** (never actually rendered).* Shown when the CMS metrics table is empty. Keep only figures with evidence. "10M Gross Revenue" needs an owner, currency and period, or should be removed. |
| Home hero | stats strip | "26+ Projects delivered", "4 to 8 wks Average launch", "24h Response time" | Medium | *QC: "26+" replaced by the live case-study count; "Average" → "Typical"; 24h kept, flagged.* Portfolio shows 6. Confirm the count and response time, or reword (for example "Typical launch: 4–8 weeks"). |
| Home (fallback) / `constants.ts` `testimonials` | Client Stories | 4 testimonials with first names and client businesses | Medium | Confirm they're real, verbatim and approved to publish. Never use schema Review markup for them. |
| `/services/web-development` (meta, hero, deliverables), `/services` card, blog "Related Service" box | copy | "Lighthouse scores above 90 across all metrics", "above 90 out of the box" | Medium | *QC: reworded to "Lighthouse 90+ performance target".* A lab score depends on content, images and third-party scripts, so it's a target, not a guarantee. Reword to "built to a Lighthouse 90+ performance target" or cite measured results for named projects. |
| `/services/web-development` OG, `constants.ts` services | copy | "Built to rank", "ranks better", "Loads instantly" | **High** | *QC: reworded ("technically sound for search").* Reads as a ranking guarantee. Suggest "built on a technically sound SEO foundation" and "fast by design". |
| `/services/web-design` FAQ | "Do you use templates?" | "…the main reason it performs better" | Low | "…one of the main reasons it can perform better". |
| `/process` | Structure stage | "The stage most agencies skip." | Low | Opinion stated as fact. "A stage that often gets skipped." |
| About / founder copy | intro | "No handoffs, no gaps, no surprises." | Low | Fine as brand voice. Keep it only if it's operationally true (for example no subcontracted development). |
| Contact, home | response promise | "We respond within 24 hours" | Low | Operational promise. Keep it only if it's consistently met (including weekends). |
| Home marquee | client logos | MBM Interior & Exterior, Beity Eats, Kaffecino have no case study | Low | Confirm permission to display. Consider adding case studies (see CONTENT-GAPS). |

## B. Blog posts

Dates shown are the CMS `created_at` values (publish dates).

### `/blog/how-to-choose-a-web-design-agency` (2026-03-05)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| Excerpt / intro | "Your website is your most valuable sales asset" | Low | "one of your most valuable…" |
| Cost section | Price ranges ($1,500–$5,000 … $15,000–$50,000+) and "an $8,000–$20,000 investment … returns value within the first year" | **High** | No currency, source or date. It also conflicts with the decision to remove `/pricing` and "all published figures". Either remove it, or label it clearly as Graphxify's own market observation with a currency and "as of 2026". |
| Accessibility note | "legal requirement, typically referencing WCAG 2.1 Level AA" | Low | WCAG 2.2 is the current W3C Recommendation. Name specific laws only with sources. |

### `/blog/mobile-first-website-small-businesses` (2026-02-18)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| Excerpt | "More than 70% of web traffic now comes from mobile devices" | Medium | Unsourced. The body says something different: "70% of *people browse primarily* on smartphones". Pick one, cite a primary dataset with a date, or soften it. |
| How Google ranks | "Since 2021, Google has used mobile-first indexing for all websites" | Medium | Inaccurate timeline. Verify against Google Search Central's own announcements and correct the year. |
| How Google ranks | "Core Web Vitals … are measured on mobile" | Medium | CWV are reported separately for mobile and desktop. Correct this. |
| List | "Higher Google rankings (… your mobile performance is your SEO performance)" | Medium | Overstated. Page experience is one of many signals. |
| Key Insight | "A 1-second improvement … can increase conversion rates by up to 27%" | **High** | Unsourced statistic. Find the primary study or remove it. |
| Unreadable text | "Font sizes below 16px are nearly impossible to read" | Low | Overstated. "harder to read on small screens". |
| Tap targets | "Apple's HIG recommend … 44×44 pixels" | Low | HIG specifies **points**, not pixels. |

### `/blog/what-makes-a-strong-brand-identity` (2026-02-04)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| Key Insight | "Research consistently shows … can increase revenue by 10–20%" + "$30,000–$60,000" | **High** | Unsourced. Cite the actual study (with its methodology caveats) or remove the number. |
| Quote | "A brand is not what you say it is…" — Marty Neumeier | Low | Verify the exact wording and source (book/edition), or paraphrase. |
| Mistakes | "Changing your brand every 2–3 years destroys the recognition equity" | Low | "can erode…" |
| CTA | "one of the highest-ROI decisions you'll make" | Low | Opinion. Fine if framed as such. |

### `/blog/custom-web-development-vs-wordpress` (2026-01-22)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| Excerpt / body | "WordPress powers 43% of the web" | Medium | Name the source (usage surveys like W3Techs) and the "as of" date, since the figure changes. |
| Performance | "Modern performance standards expect [TTFB] under 200ms" | Medium | Not a published standard. Google's guidance is looser. Correct it or remove the threshold. |
| Lock-in | "content … lives in a proprietary database format" | Medium | WordPress is open source on MySQL/MariaDB. "Tied to WordPress's schema and plugins" is accurate. |
| Custom section | "can achieve Lighthouse performance scores of 95+ consistently", "significantly more secure by default" | Medium | Absolute. Hedge it, or back it with Graphxify's own measured projects. |
| Cost table | "Security incidents: Minimal risk", "Performance: Excellent by default", "Flexibility: Unlimited", cost ranges | Medium | Absolutes and unsourced prices (no currency). Soften, and add "typical, in our experience". |

### `/blog/professional-website-business-growth` (2026-01-10)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| First impression | "approximately 3–5 seconds to make a first impression" | Medium | Unsourced. Cite or soften to "a few seconds". |
| Tip | "'Get a Free Quote' outperforms 'Contact Us' by measurable margins" | Medium | Unsourced. "often performs better in tests". |
| ROI | "$15,000 website … pays back in approximately 6 weeks … generating the same leads indefinitely" | **High** | A hypothetical presented as an outcome. Label it clearly as an illustrative example and remove "indefinitely". |
| Close | "businesses … that invest … consistently out-earn those that don't" | Medium | Unsupported absolute. |

### `/blog/local-seo-getting-found-on-google` (2025-12-18)

| Section | Claim | Risk | Suggested action |
|---|---|---|---|
| Heading | "Local SEO Is the Highest-ROI Digital Investment" | Medium | Absolute. "One of the highest-ROI…" |
| GBP | "the single most important local SEO asset you control" | Low | Widely held view. Soften to "one of the most important". |
| NAP note | "Inconsistencies … suppress your rankings" | Low | Overstated causal claim. "can confuse…" |
| Reviews Key Insight | "45 reviews averaging 4.7 stars will **consistently outrank** … 8 reviews averaging 5.0" | **High** | An unsupported ranking guarantee. Remove it or reframe it as a general tendency. |
| Getting started | "will produce measurable results within 30–60 days" | **High** | Reads as a guarantee. "Can start to show movement…" |
| Final CTA | "We also offer full digital strategy services including SEO foundation setup, content planning, and Google Business Profile optimization" | **High** | **Inconsistent with the site's services.** No SEO, content-strategy or GBP service page exists. Either create a real service page for these, or cut the sentence to what's offered (technically SEO-ready websites). |
| Advice vs practice | Recommends a footer address, a Google Map and LocalBusiness schema | Info | Good advice for local businesses, but Graphxify itself is remote. Consider one sentence saying "for businesses with a physical location" so it doesn't read as contradictory. |

## C. General patterns across the blog

- **Byline:** all 6 posts are "Graphxify Team". That's fine, and the schema attributes them to the Organization. A named expert author (with a real bio) usually strengthens trust. See ENTITY-DATA-NEEDED §2.
- **Dates:** `updated_at` is 2026-07-29 for every post because of the bulk slug/copy migration. That's genuine, but a visible "Updated" date is not shown. If copy was materially rewritten on that date, consider showing it.
- **Year-stamped titles** ("… in 2026") age quickly. Either refresh them annually with real edits, or drop the year from the H1.
- **Self-attributed quotes** ("— Graphxify Team") are fine. Keep them clearly as opinion.
