# Industry page opportunities

## What exists now

- **Architecture:** `src/lib/industries.ts` (data model + publishability gate) and `src/app/(marketing)/industries/[slug]/page.tsx` (template reusing the service-page design: hero, challenges, approach, related case studies, related services, FAQ, CTA, BreadcrumbList schema).
- **Published pages: none.** An entry renders, prerenders and appears in the sitemap only when `published: true` **and** it passes the gate: a real title, description and H1, an intro of at least 60 words, at least 2 challenges, at least 2 approach points and at least 1 case study. Every other `/industries/*` URL is a real 404.
- One **draft** entry (`healthcare`) holds only structural facts: its related projects and services. All copy fields are deliberately empty.

## Rules before publishing any industry page

1. Substantial copy written from **actual** project experience. Not a template with the industry name swapped in.
2. At least one real case study in that industry, ideally 2+.
3. Industry-specific website needs explained concretely (for example, for pharmacies: prescription-refill flows, hours and location clarity, accessibility for older patients).
4. FAQs Daniel can answer from experience.
5. No city lists, no near-duplicates of another industry page, and no pages for industries without proof.

## Candidates, ranked by existing evidence

| # | Industry | Why relevant | Existing supporting projects | Missing proof / content | Proposed URL | Proposed title | Sections | Related services | Related case studies |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Healthcare & pharmacy** | Strongest evidence: **3 of 6 case studies** | Pharmacy On King, King Medical Arts Pharmacy, B.O.S.S. Medical Clinic (all with live sites) | Real outcomes; a client quote; concrete notes on what healthcare sites needed (accessibility, trust, service findability); confirmation there are no regulatory claims to avoid | `/industries/healthcare` | Websites & Branding for Pharmacies and Clinics | What patients look for · Common site problems · How we approach healthcare sites · 3 case studies · Accessibility approach · FAQ · CTA | Web Design, Brand Systems, (CMS Architecture if clients edit content) | pharmacy-on-king, king-medical-art-pharmacy, boss-medical-clinic |
| 2 | Beauty & salons | 1 case study (branding + web) | Luka Hair Salon | A second salon/beauty project; booking-flow specifics; a client quote | `/industries/beauty-salons` | Branding & Websites for Salons and Beauty Businesses | Visual-first design with structure · Booking paths · Case study · FAQ | Brand Systems, Web Design | luka-hair-salon |
| 3 | Travel | 1 case study | FlyUp Line (live) | A second travel project; booking/search UX specifics; outcomes | `/industries/travel` | Website Design for Travel Businesses | Trust signals · Search-to-booking flow · Case study · FAQ | Web Design, Web Development | flyup-line |
| 4 | Fashion / apparel | 1 brand-identity project | Maven | Proof beyond one identity; e-commerce experience if claimed | `/industries/fashion` | Brand Identity for Fashion Labels | Identity systems for apparel · Case study | Brand Systems | maven |
| — | Food & hospitality | Marquee shows Beity Eats and Kaffecino | **No case studies** | Case studies first | — | — | Do not publish | — | — |
| — | Trades / home services | Marquee shows MBM Interior & Exterior (`/mbmdesigns` redirects to /works) | **No case study** | Case study first | — | — | Do not publish | — | — |
| — | Sports, soccer academies, fitness | Mentioned as ambitions | **No evidence in the repo** | Real projects | — | — | Do not publish | — | — |

**Recommendation:** Healthcare is the only industry close to publishable. Write it once Daniel can supply the missing facts. Keep 2–4 on the list until each has a second project. Don't create an `/industries` index until at least two are live.
