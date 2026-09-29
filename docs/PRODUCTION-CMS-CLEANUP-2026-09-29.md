# Production CMS cleanup — 2026-09-29

Applied directly to the production Supabase database (project `cajxvhcrfgpyyqohlkfp`) in **one transaction**, after a read-only audit and a full JSON backup of every affected row (kept outside the repository). Each `UPDATE` was keyed by primary key, guarded by the row's pre-change `updated_at` (optimistic lock) and asserted to affect exactly one row. Version snapshots were written for the dashboard's history: **v1 = before, v2 = after** (`post_versions` ×12, `work_versions` ×6).

Post-write verification (2026-09-29T11:54:34.032707+00:00): **55/55 field changes match**, 0 unintended field changes, all rows still `published`, no slug changes, no new rows, 10/10 marquee items unchanged.

Schema-level changes: `works.location` default `'Canada'` → **none (NULL)**; column comment set to *Client location / project market (NOT Graphxify's own location)*. No tables/columns dropped; no auth, storage or unrelated data touched.

To roll back a post or case study: Dashboard → the item → Version history → restore **v1**.

## Works, testimonials — field changes

| Table | Record | Field | Old | New |
|---|---|---|---|---|
| works | maven | industry | Women's Fashion | Fashion |
| works | maven | subtitle | Maven was developed as a women's fashion label defined by precision, confidence, and refined minimalism. | Maven was developed as a fashion label defined by precision, confidence, and refined minimalism. |
| works | maven | excerpt | Graphxify developed a complete identity system for Maven, a minimalist streetwear label built around bold typography, controlled colour, and editorial precision. | Graphxify developed a complete identity system for Maven, a minimalist fashion label built around bold typography, controlled colour, and editorial precision. |
| works | maven | card_outcome | Complete brand identity system for a minimalist streetwear label. | Complete brand identity system for a minimalist fashion label. |
| works | maven | meta_description | A complete brand identity for Maven — a contemporary women's fashion label built on typographic precision and a confident visual language. | A complete brand identity for Maven — a contemporary fashion label built on typographic precision and a confident visual language. |
| works | maven | og_title | Maven — Women's Fashion Brand Identity \| Graphxify | Maven — Fashion Brand Identity \| Graphxify |
| works | maven | og_description | A complete brand identity system for a contemporary women's fashion label — built on typographic precision, restrained colour, and a confident visual language. | A complete brand identity system for a contemporary fashion label — built on typographic precision, restrained colour, and a confident visual language. |
| works | maven | twitter_title | Maven — Women's Fashion Brand Identity \| Graphxify | Maven — Fashion Brand Identity \| Graphxify |
| works | maven | twitter_description | A complete brand identity system for a contemporary women's fashion label — built on typographic precision, restrained colour, and a confident visual language. | A complete brand identity system for a contemporary fashion label — built on typographic precision, restrained colour, and a confident visual language. |
| works | maven | challenge | Women's fashion branding often leans heavily on soft visuals and predictable aesthetics. The challenge was to build a brand that feels feminine without being delicate, and strong without being aggressive — striking a balance that positions Maven as both refined and distinctive in a saturated market. | Fashion branding often leans heavily on soft visuals and predictable aesthetics. The challenge was to build a brand that feels elegant without being delicate, and strong without being aggressive — striking a balance that positions Maven as both refined and distinctive in a saturated market. |
| works | flyup-line | year | 2022 | 2025 |
| works | flyup-line | services | Website Design, UX Strategy | Branding, Website Design, UX Strategy |
| works | flyup-line | card_services | Website Design, UX Strategy | Branding, Website Design, UX Strategy |
| works | flyup-line | role | Website Design + UX Strategy | Branding + Website Design + UX Strategy |
| works | boss-medical-clinic | title | Boss Medical Clinic | B.O.S.S. Medical Clinic |
| works | boss-medical-clinic | excerpt | Boss Medical Clinic required a digital identity that communicates authority while remaining approachable. Graphxify developed a visual system focused on clarity and credibility. | B.O.S.S. Medical Clinic required a digital identity that communicates authority while remaining approachable. Graphxify developed a visual system focused on clarity and credibility. |
| works | boss-medical-clinic | content | _(long text — name variants replaced)_  | “Boss/BOSS Medical Clinic” → “B.O.S.S. Medical Clinic” |
| works | boss-medical-clinic | overview | Boss Medical Clinic offers a range of medical services and needed a platform that reflects professionalism while presenting information in a structured and accessible way for patients. | B.O.S.S. Medical Clinic offers a range of medical services and needed a platform that reflects professionalism while presenting information in a structured and accessible way for patients. |
| works | boss-medical-clinic | meta_title | BOSS Medical Clinic — Healthcare Case Study \| Graphxify | B.O.S.S. Medical Clinic — Healthcare Case Study \| Graphxify |
| works | boss-medical-clinic | meta_description | Graphxify designed BOSS Medical Clinic's website to communicate clinical authority while guiding patients through services with clarity and ease. | Graphxify designed B.O.S.S. Medical Clinic's website to communicate clinical authority while guiding patients through services with clarity and ease. |
| works | boss-medical-clinic | og_title | BOSS Medical Clinic — Healthcare Web Design \| Graphxify | B.O.S.S. Medical Clinic — Healthcare Web Design \| Graphxify |
| works | boss-medical-clinic | og_image_alt | BOSS Medical Clinic website — healthcare web design by Graphxify | B.O.S.S. Medical Clinic website — healthcare web design by Graphxify |
| works | boss-medical-clinic | twitter_title | BOSS Medical Clinic — Healthcare Web Design \| Graphxify | B.O.S.S. Medical Clinic — Healthcare Web Design \| Graphxify |
| works | maven | location | Canada | _(null)_ |
| works | flyup-line | location | Canada | _(null)_ |
| works | pharmacy-on-king | location | Canada | _(null)_ |
| works | boss-medical-clinic | location | Canada | _(null)_ |
| works | king-medical-art-pharmacy | location | Canada | _(null)_ |
| works | luka-hair-salon | location | Canada | _(null)_ |
| testimonials | 094ff68d… | role | Manger | Manager |

## Blog posts — share-image fields

| Post | og_image | twitter_image |
|---|---|---|
| local-seo-getting-found-on-google | `/assets/post-3.svg` → NULL | `/assets/post-3.svg` → NULL |
| professional-website-business-growth | `/assets/post-2.svg` → NULL | `/assets/post-2.svg` → NULL |
| custom-web-development-vs-wordpress | `/assets/post-1.svg` → NULL | `/assets/post-1.svg` → NULL |
| what-makes-a-strong-brand-identity | `/assets/post-3.svg` → NULL | `/assets/post-3.svg` → NULL |
| mobile-first-website-small-businesses | `/assets/post-2.svg` → NULL | `/assets/post-2.svg` → NULL |
| how-to-choose-a-web-design-agency | `/assets/post-1.svg` → NULL | `/assets/post-1.svg` → NULL |

With the placeholders cleared, both the deployed code and the new code fall back to each post's real cover image (verified: all 6 posts and all 6 case studies emit a PNG/JPG `og:image`).

## Blog posts — rewritten sentences (old → new)

### local-seo-getting-found-on-google

**excerpt**

- Old: Most local businesses leave enormous amounts of revenue on the table because potential customers can't find them on Google.
- New: Many local businesses miss out on enquiries because potential customers can't find them on Google.

**seo_description**

- Old: Learn a proven local SEO strategy
- New: Learn a practical local SEO strategy

**og_description**

- Old: Learn a proven local SEO strategy
- New: Learn a practical local SEO strategy

**twitter_description**

- Old: Learn a proven local SEO strategy
- New: Learn a practical local SEO strategy

**content**

- Old: ## Why Local SEO Is the Highest-ROI Digital Investment for Local Businesses
- New: ## Why Local SEO Matters for Local Businesses

**content**

- Old: The businesses that appear at the top of those results get the call.
- New: The businesses that appear at the top of those results are the ones most likely to get the call.

**content**

- Old: is the most direct line between digital effort and real revenue for small and medium businesses. Unlike paid advertising, local SEO compounds over time. The investment you make this quarter builds ranking authority that generates leads for years.
- New: is one of the most direct ways for small and medium businesses to turn digital effort into enquiries. Unlike paid advertising, the work tends to compound: improvements you make this quarter can keep supporting your visibility long after they are made.

**content**

- Old: is the single most important local SEO asset you control.
- New: is one of the most important local SEO assets you control.

**content**

- Old: NOTE: Consistency is critical. Your business name, address, and phone number (NAP) must be identical across your website, Google Business Profile, and any online directories. Inconsistencies confuse Google's local algorithm and suppress your rankings.
- New: NOTE: Consistency matters. Keep your business name, address, and phone number (NAP) identical across your website, Google Business Profile, and any online directories. Google notes that [businesses with complete and accurate info are more likely to show up in local search results](https://support.google.com/business/answer/7091), and conflicting details make that harder.

**content**

- Old: This makes it nearly impossible to rank for location-specific searches.
- New: This makes it much harder to rank for location-specific searches.

**content**

- Old: - Add your full address to the footer on every page
- New: - Add your full address to the footer on every page (if customers visit you in person)

**content**

- Old: - Add LocalBusiness schema markup to your homepage
- New: - Add LocalBusiness structured data if you have a physical location or a defined service area

**content**

- Old: Reviews are one of the most significant ranking factors in local search — and one of the most neglected by businesses. The businesses that consistently rank highest for competitive local searches typically have significantly more reviews than their competitors, with a high average rating.
- New: Reviews are one of the signals that can influence local search — and one of the most neglected by businesses. According to Google, [more reviews and positive ratings can help your business's local ranking](https://support.google.com/business/answer/7091).

**content**

- Old: KEY INSIGHT: A business with 45 reviews averaging 4.7 stars will consistently outrank a competitor with 8 reviews averaging 5.0 stars. Volume signals activity and trust in ways that a small number of perfect ratings cannot.
- New: KEY INSIGHT: Review volume and recency matter alongside your average rating. A steady stream of genuine reviews shows an active, trusted business in a way a handful of perfect ratings can't — but reviews are one factor among many, and no number of reviews guarantees a position. As Google puts it, there's no way to request or pay for a better local ranking.

**content**

- Old: A dozen high-quality, relevant links from reputable local sources will move the needle more than hundreds of irrelevant links.
- New: A dozen high-quality, relevant links from reputable local sources can do more for your visibility than hundreds of irrelevant links.

**content**

- Old: Beyond service pages, content marketing is a powerful local SEO driver.
- New: Beyond service pages, content marketing can support local SEO.

**content**

- Old: This type of content does two things: it ranks for searches your service pages can't target, and it builds authority that boosts all of your other pages.
- New: This type of content can do two things: rank for searches your service pages don't target, and build topical authority that supports the rest of your site.

**content**

- Old: > "The businesses that dominate local search in five years are the ones publishing consistent, helpful content today." — Graphxify Team
- New: > "The businesses that lead local search in five years are likely to be the ones publishing consistent, helpful content today." — Graphxify Team

**content**

- Old: Local SEO is not instant. Expect meaningful movement in 3–6 months for competitive queries, and compounding returns over 12–18 months. But unlike paid ads, those returns don't stop when you stop paying.
- New: Local SEO is not instant. Results vary based on competition, site history, market conditions and implementation, and competitive searches usually take longer to move. Unlike paid ads, though, the groundwork keeps working after you stop spending.

**content**

- Old: These three steps take less than two hours and will produce measurable results within 30–60 days.
- New: These three steps can be done in an afternoon. How quickly they affect your visibility depends on your competition, your site's history, and how consistently you keep them up.

**content**

- Old: Local SEO only works if the website it points to converts visitors into leads.
- New: Local SEO pays off most when the website it points to converts visitors into leads.

**content**

- Old: ## Need a Website That Ranks and Converts?
- New: ## Need a Website Built for Search and Conversion?

**content**

- Old: Graphxify builds websites for businesses worldwide that are technically optimized for search from day one — fast, mobile-first, and structured for Google. We also offer [full digital strategy services](/services) including SEO foundation setup, content planning, and Google Business Profile optimization. [Start the conversation with our team.](/contact)
- New: Graphxify designs and builds websites for businesses worldwide with a strong technical foundation for search — fast, mobile-first, and structured so search engines can understand your services. Explore our [web design](/services/web-design) and [web development](/services/web-development) services, or [start the conversation with our team.](/contact)

### mobile-first-website-small-businesses

**excerpt**

- Old: More than 70% of web traffic now comes from mobile devices. If your website wasn't designed for mobile first, you're losing customers before they even read your first sentence.
- New: For many businesses, most visitors now arrive on a phone. If your website wasn't designed mobile-first, you may be losing customers before they read your first sentence.

**content**

- Old: According to recent data, over 70% of people browse the internet primarily on their smartphones. For local business searches, that number climbs even higher — queries like "restaurant near me," "web designer near me," or "best dentist in my area."
- New: For many businesses, most visitors now arrive on a phone — your own analytics will show your exact split. Local searches such as "restaurant near me," "web designer near me," or "best dentist in my area" are often made on the go.

**content**

- Old: - Cleaner layouts that convert better at every screen size
- New: - Cleaner layouts that tend to work better at every screen size

**content**

- Old: - Higher Google rankings (Google's index is mobile-first — your mobile performance is your SEO performance)
- New: - A stronger foundation for search (Google uses the mobile version of your site for indexing and ranking)

**content**

- Old: Since 2021, Google has used mobile-first indexing for all websites. This means Google crawls and ranks your website based on the mobile version — not the desktop version. Core Web Vitals — Google's performance metrics — are measured on mobile.
- New: Google uses [mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing): it uses the mobile version of a site's content, crawled with its smartphone agent, for indexing and ranking. In practice, the mobile version of your site is the one Google evaluates. Core Web Vitals — Google's user-experience metrics — are reported separately for mobile and desktop.

**content**

- Old: The three scores that matter:
- New: The three Core Web Vitals and Google's "good" thresholds:

**content**

- Old: KEY INSIGHT: A 1-second improvement in mobile page load time can increase conversion rates by up to 27%. For a business generating $500k/year from its website, that's a measurable return on a design investment.
- New: KEY INSIGHT: Faster pages mean fewer visitors give up before your content appears. Track your own conversion rate before and after performance work — that's the figure that matters for your business.

**content**

- Old: Font sizes below 16px are nearly impossible to read on mobile without zooming. Yet many older business websites still use 12px or 14px body text. This increases bounce rates — especially among older demographics.
- New: Body text smaller than 16px is often hard to read on a phone without zooming. Yet many older business websites still use 12px or 14px body text, which can push visitors — especially older ones — to leave.

**content**

- Old: Apple's Human Interface Guidelines recommend touch targets of at least 44×44 pixels. Many websites have "Contact Us" buttons that are half that size. Every missed tap is a missed inquiry.
- New: Apple's Human Interface Guidelines recommend touch targets of at least 44×44 points. Many websites have "Contact Us" buttons that are much smaller. A missed tap can easily mean a missed inquiry.

**content**

- Old: High-resolution desktop images served on mobile connections destroy load times.
- New: High-resolution desktop images served on mobile connections can slow load times dramatically.

**content**

- Old: 2. **Rebuild it properly** — A mobile-first rebuild using modern frameworks produces dramatically better results. This is the right choice if your website is more than 3–4 years old or was never properly designed for mobile.
- New: 2. **Rebuild it properly** — A mobile-first rebuild on a modern framework usually delivers better long-term results. It's often the better choice if your website is more than 3–4 years old or was never properly designed for mobile.

**content**

- Old: When they land on a slow, hard-to-use mobile site, they leave — and go to a competitor
- New: When they land on a slow, hard-to-use mobile site, they often leave — and go to a competitor

### custom-web-development-vs-wordpress

**excerpt**

- Old: WordPress powers 43% of the web.
- New: WordPress is the web's most widely used CMS.

**content**

- Old: it has evolved into the world's most popular content management system, powering approximately 43% of all websites.
- New: it has evolved into the world's most widely used content management system.

**content**

- Old: - Your budget for development is under $10,000 and you need to launch quickly
- New: - Your development budget is limited and you need to launch quickly

**content**

- Old: WordPress becomes a liability when:
- New: WordPress can become a liability when:

**content**

- Old: A default WordPress installation is slow. With an average theme, several plugins, and unoptimized images, it's common to see Time to First Byte (TTFB) values of 800ms–2 seconds. Modern performance standards expect under 200ms. Achieving competitive Core Web Vitals scores on WordPress requires significant optimization work
- New: WordPress sites can easily become slow. With an average theme, several plugins, and unoptimized images, slow server response times (Time to First Byte, or TTFB) are common. Google's web.dev guidance says [most sites should aim for a TTFB of 0.8 seconds or less](https://web.dev/articles/ttfb). Achieving competitive Core Web Vitals scores on WordPress often requires significant optimization work

**content**

- Old: WordPress is the most attacked platform on the web, not because it's uniquely insecure, but because it's the most popular target. Sites running outdated plugins or themes are constantly being exploited. Maintaining a secure WordPress site requires ongoing vigilance: plugin updates (sometimes breaking), security scanning, and at minimum monthly maintenance.
- New: WordPress is one of the most frequently targeted platforms on the web — not because it's uniquely insecure, but because it's so widely used. Sites running outdated plugins or themes are a common target. Keeping a WordPress site secure takes ongoing attention: plugin updates (sometimes breaking), security scanning, and regular maintenance.

**content**

- Old: WordPress fights you. Every custom feature requires bending the platform to do something it wasn't designed for, producing technical debt that compounds over time.
- New: WordPress can work against you. Custom features often mean bending the platform to do something it wasn't designed for, producing technical debt that compounds over time.

**content**

- Old: Much of the content in WordPress lives in a proprietary database format tied to the WordPress ecosystem. Migrating away from WordPress later is painful and expensive.
- New: Much of your content ends up structured around WordPress's own database schema, themes and plugins (shortcodes, page-builder markup), which can make migrating away later time-consuming and costly.

**content**

- Old: Custom development — building on modern frameworks like Next.js, with a proper headless CMS — is the right choice when:
- New: Custom development — building on modern frameworks like Next.js, with a proper headless CMS — is often the better choice when:

**content**

- Old: can achieve Lighthouse performance scores of 95+ consistently, is significantly more secure by default, and is built specifically for your business logic
- New: can be engineered for high Lighthouse performance scores, has a smaller attack surface than a plugin-heavy install, and is built specifically for your business logic

**content**

- Old: KEY INSIGHT: The total cost of ownership often favors custom development over a 4–5 year horizon. WordPress sites accumulate plugin subscription costs ($50–$300/year each), ongoing maintenance fees, and periodic security incident costs. Custom sites cost more upfront but less over time.
- New: KEY INSIGHT: Compare total cost of ownership, not just the initial build. Premium plugins and themes often carry annual licence fees, and maintenance and security work add up over time. A custom site usually costs more upfront; whether it costs less over four or five years depends on your requirements and how the site is maintained.

**content**

- Old: ## Cost Comparison ⏎  ⏎ | | WordPress | Custom Development | ⏎ |---|---|---| ⏎ | Initial Build | $3,000–$12,000 | $10,000–$50,000+ | ⏎ | Annual Maintenance | $1,500–$5,000 | $500–$2,000 | ⏎ | Security Incidents | Frequent risk | Minimal risk | ⏎ | Performance | Requires optimization | Excellent by default | ⏎ | Flexibility | Limited | Unlimited |
- New: ## At a Glance ⏎  ⏎ | | WordPress | Custom Development | ⏎ |---|---|---| ⏎ | Initial Build | Usually lower | Usually higher | ⏎ | Ongoing Maintenance | Regular core, theme and plugin updates | Dependency updates; fewer third-party plugins | ⏎ | Security | Larger attack surface when many plugins are used | Smaller attack surface; still needs maintenance | ⏎ | Performance | Achievable, but often needs optimization work | Can be engineered for performance from the start | ⏎ | Flexibility | Broad via plugins; limited for custom logic | Built around your specific requirements |

### what-makes-a-strong-brand-identity

**content**

- Old: Without the system around it, even a great logo fails to create the consistency
- New: Without the system around it, even a great logo struggles to create the consistency

**content**

- Old: KEY INSIGHT: Research consistently shows that consistent brand presentation can increase revenue by 10–20%. For a service business billing $300k/year, that's $30,000–$60,000 in incremental revenue attributable to brand discipline.
- New: KEY INSIGHT: Consistency compounds. Every time a customer sees the same logo, colours, and tone of voice, recognition gets a little stronger — which is why brand discipline tends to pay off over years, not weeks.

**content**

- Old: Platforms that generate logos via algorithm or run logo contests produce generic, unstrategic marks with no real design thinking behind them
- New: Platforms that generate logos via algorithm or run logo contests tend to produce generic marks with little strategic thinking behind them

**content**

- Old: without documentation, the brand degrades immediately
- New: without documentation, the brand starts to drift quickly

**content**

- Old: Changing your brand every 2–3 years destroys the recognition equity you've built
- New: Changing your brand every few years can erode the recognition you've built

**content**

- Old: A professional [branding agency](/services) will typically run
- New: A professional [branding agency](/services/brand-systems) will typically run

**content**

- Old: is one of the highest-ROI decisions you'll make in your business's lifecycle. To understand how brand quality translates to measurable revenue, see our article
- New: can be one of the most valuable investments you make in your business. To see how brand and website quality connect to leads and revenue, see our article

### professional-website-business-growth

**content**

- Old: You have approximately 3–5 seconds to make a first impression online. In that window, visitors decide whether to stay or leave. A professional, polished design signals credibility instantly. Visual inconsistency, slow loading, or a layout that looks dated signals the opposite — and visitors associate that quality signal with your business quality.
- New: First impressions online form quickly — often within seconds. In that window, visitors decide whether to stay or leave. A professional, polished design signals credibility; visual inconsistency, slow loading, or a layout that looks dated signals the opposite — and visitors tend to associate that impression with the quality of your business.

**content**

- Old: TIP: The single highest-impact change most business websites can make is adding a prominent, specific call to action above the fold — visible without scrolling. "Get a Free Quote" outperforms "Contact Us" by measurable margins.
- New: TIP: One of the highest-impact changes many business websites can make is adding a prominent, specific call to action above the fold — visible without scrolling. Specific, benefit-led labels such as "Get a Free Quote" often perform better than generic ones like "Contact Us" — test both on your own site.

**content**

- Old: Many business owners treat their website as a cost rather than an investment. This framing is a mistake. Consider: ⏎  ⏎ - A service business billing $150/hour that closes 2 additional clients per month from website leads, at an average project value of $5,000, generates $120,000 per year in incremental revenue ⏎ - A $15,000 website investment pays back in approximately 6 weeks at that rate — and continues generating the same leads indefinitely ⏎  ⏎ The math is straightforward. The question isn't whether to invest in a professional website — it's when.
- New: Many business owners treat their website as a cost rather than an investment. Consider an illustrative example (the figures are hypothetical — use your own): ⏎  ⏎ - A service business that closes 2 additional clients per month from website leads, at an average project value of 5,000, would add 120,000 in revenue over a year ⏎ - At that rate, a 15,000 website would pay for itself within a few months — if the site genuinely brings in those leads ⏎  ⏎ Your numbers will differ, but the logic holds: if a better website wins even a few extra clients, it can pay for itself.

**content**

- Old: - **Fast performance** — Sub-2-second load times, especially on mobile
- New: - **Fast performance** — Main content that loads quickly, especially on mobile (Google's "good" threshold for Largest Contentful Paint is 2.5 seconds or less)

**content**

- Old: The businesses in your market that invest in their digital presence consistently out-earn those that don't.
- New: Businesses that treat their website as a growth asset are better placed to win the customers already searching for them.

### how-to-choose-a-web-design-agency

**excerpt**

- Old: Your website is your most valuable sales asset.
- New: Your website is one of your most valuable sales assets.

**content**

- Old: a professional, fast, and trustworthy website is the foundation of every sale, every referral, and every first impression.
- New: a professional, fast, and trustworthy website underpins sales, referrals, and first impressions.

**content**

- Old: will deliver more strategic work than a generalist studio that never studies your context.
- New: is likely to deliver more strategic work than a generalist studio that doesn't take time to study your context.

**content**

- Old: Costs vary widely depending on scope and quality: ⏎  ⏎ - Freelancer: $1,500–$5,000 (limited scope, less strategic thinking) ⏎ - Mid-tier agency: $5,000–$15,000 (solid execution, moderate strategy) ⏎ - Full-service agency: $15,000–$50,000+ (strategy, design, development, CMS, launch support) ⏎  ⏎ For most small and medium businesses, an $8,000–$20,000 investment in a properly built site returns value within the first year if executed well.
- New: Costs vary widely depending on scope, quality, and who does the work: ⏎  ⏎ - Freelancer: usually the lowest cost; scope and strategic input are often more limited ⏎ - Mid-tier agency: moderate cost; solid execution with some strategy ⏎ - Full-service agency: higher cost; strategy, design, development, CMS, and launch support ⏎  ⏎ Ask for a written scope and a fixed quote before comparing prices — price ranges mean little until the page list, features, and content responsibilities are agreed.

## Sources used for new attributions (first-party, checked 2026-09-29)

- Google Business Profile Help — *Tips to improve your local ranking on Google*: https://support.google.com/business/answer/7091 ("More reviews and positive ratings can help your business's local ranking"; "Businesses with complete and accurate info are more likely to show up"; "There's no way to request or pay for a better local ranking on Google").
- Google Search Central — *Mobile site and mobile-first indexing best practices*: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing ("Google uses the mobile version of a site's content, crawled with the smartphone agent, for indexing and ranking.").
- web.dev — *Time to First Byte (TTFB)*: https://web.dev/articles/ttfb ("most sites should strive to have a TTFB of 0.8 seconds or less"; TTFB is not a Core Web Vital).

Statistics without a verifiable source (70% mobile, "up to 27%", "10–20% revenue", "43% of the web", price ranges, "3–5 seconds") were **removed rather than cited**.

## Follow-up — Maven `overview` and `content` (2026-09-29)

Same safeguards (one transaction, keyed by id + `updated_at`, one-row assertion, v3/v4 version snapshots).

| Field | Old | New |
|---|---|---|
| overview | Maven is a contemporary women's fashion brand built around … | Maven is a contemporary fashion brand built around … |
| overview | … without relying on traditional feminine clichés. | … without relying on traditional fashion clichés. |
| content (unrendered) | … for Maven, a minimalist streetwear label built around … | … for Maven, a minimalist fashion label built around … |
| content (unrendered) | the same two overview sentences as above | the same replacements as above |
| content (unrendered) | Women's fashion branding often leans heavily on soft visuals … feels feminine without being delicate, … | Fashion branding often leans heavily on soft visuals … feels elegant without being delicate, … (identical to the already-updated `challenge` field) |

Verified afterwards: no "women", "feminine" or "streetwear" wording remains anywhere in the Maven record. It's still published, and the slug is unchanged. **Project drift check: 0 conflicts.**
