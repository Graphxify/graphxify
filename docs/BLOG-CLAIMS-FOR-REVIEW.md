# Blog claims: Daniel's manual review list

> **RESOLVED 2026-09-29 (production CMS cleanup).** Every item below was rewritten directly in the production CMS, with Daniel's authorisation. Unverifiable statistics were **removed**, not cited. Three claims were re-grounded in first-party sources (Google Business Profile Help, Google Search Central, web.dev). Ranking and timeline guarantees are now qualified. The Local SEO post no longer claims SEO, content-planning or Google Business Profile services, and its CTA points to Web Design and Web Development. Old → new text for every sentence is in [PRODUCTION-CMS-CLEANUP-2026-09-29.md](PRODUCTION-CMS-CLEANUP-2026-09-29.md).
>
> **Kept as-is (judged acceptable):** "Never pay for or solicit fake reviews" (correct advice); the Marty Neumeier quote (attributed; not independently re-verified); the Core Web Vitals thresholds (Google's published values); opinion quotes attributed to "Graphxify Team".


**Status: UNRESOLVED.** These sentences are live in the production CMS (`posts.content` / `excerpt`). None was edited, because there's no authorised write access to production content, and none is marked verified.

**For each item:** add a real primary source, reword it as clearly-labelled opinion or an illustrative example, or delete it. Don't add a source that doesn't actually support the exact claim.

Edit in **Dashboard → Posts**. Changes to published posts go live via ISR, and the CMS automatically pings IndexNow once it's configured.

## 1. Claims of services Graphxify doesn't offer (fix first)

The verified services are Brand Systems, Web Design, Web Development and CMS Architecture.

| Article | Exact wording | Problem |
|---|---|---|
| Local SEO: Getting Found on Google in Your City | "We also offer full digital strategy services including SEO foundation setup, content planning, and Google Business Profile optimization." | No SEO, content-planning or Google Business Profile service exists. Either delete the sentence, or keep only what's true (for example "we build websites that are technically optimized for search"). |

## 2. Ranking guarantees and SEO outcome claims

| Article | Exact wording |
|---|---|
| Local SEO | "A business with 45 reviews averaging 4.7 stars will consistently outrank a competitor with 8 reviews averaging 5.0 stars." |
| Local SEO | "These three steps take less than two hours and will produce measurable results within 30–60 days." |
| Local SEO | "Inconsistencies confuse Google's local algorithm and suppress your rankings." |
| Local SEO | Heading: "Why Local SEO Is the Highest-ROI Digital Investment for Local Businesses" |
| Mobile-First Website | "Higher Google rankings (Google's index is mobile-first — your mobile performance is your SEO performance)" |
| Mobile-First Website | "Since 2021, Google has used mobile-first indexing for all websites." (timeline needs checking against Google's own announcements) |
| Mobile-First Website | "Core Web Vitals — Google's performance metrics — are measured on mobile." (Google reports mobile and desktop separately) |

## 3. Unsupported statistics

| Article | Exact wording |
|---|---|
| Mobile-First Website | Excerpt: "More than 70% of web traffic now comes from mobile devices." / Body: "over 70% of people browse the internet primarily on their smartphones" (two different claims, no source) |
| Mobile-First Website | "A 1-second improvement in mobile page load time can increase conversion rates by up to 27%." |
| What Makes a Strong Brand Identity | "Research consistently shows that consistent brand presentation can increase revenue by 10–20%." (+ the "$30,000–$60,000" derived figure) |
| Custom Web Development vs. WordPress | "WordPress powers 43% of the web" / "powering approximately 43% of all websites" (needs source + "as of" date) |
| Custom Web Development vs. WordPress | "Modern performance standards expect under 200ms." (TTFB) |
| Custom Web Development vs. WordPress | Cost table: "$3,000–$12,000", "$10,000–$50,000+", "$1,500–$5,000", "$500–$2,000"; "plugin subscription costs ($50–$300/year each)" (no currency, no source) |
| How to Choose the Right Web Design Agency | Price ranges "$1,500–$5,000", "$5,000–$15,000", "$15,000–$50,000+", and "an $8,000–$20,000 investment … returns value within the first year" (no currency or source; conflicts with removing published pricing) |
| How a Professional Website Drives Real Business Growth | "You have approximately 3–5 seconds to make a first impression online." |
| How a Professional Website Drives Real Business Growth | "'Get a Free Quote' outperforms 'Contact Us' by measurable margins." |

## 4. Absolute or overstated wording (lower risk)

| Article | Exact wording |
|---|---|
| Professional Website Growth | "A $15,000 website investment pays back in approximately 6 weeks at that rate — and continues generating the same leads indefinitely" (a hypothetical presented as an outcome) |
| Professional Website Growth | "The businesses in your market that invest in their digital presence consistently out-earn those that don't." |
| Custom Web Development vs. WordPress | "can achieve Lighthouse performance scores of 95+ consistently", "significantly more secure by default"; table: "Security Incidents: Minimal risk", "Performance: Excellent by default", "Flexibility: Unlimited" |
| Custom Web Development vs. WordPress | "Much of the content in WordPress lives in a proprietary database format" (WordPress is open source) |
| Mobile-First Website | "Font sizes below 16px are nearly impossible to read on mobile without zooming."; "touch targets of at least 44×44 pixels" (Apple's HIG says points) |
| What Makes a Strong Brand Identity | "Changing your brand every 2–3 years destroys the recognition equity you've built"; the Marty Neumeier quote (verify exact wording and source) |
| How to Choose the Right Web Design Agency | "Your website is your most valuable sales asset." |

Fuller context and suggested rewordings are in [CONTENT-TRUST-AUDIT.md](CONTENT-TRUST-AUDIT.md) §B.
