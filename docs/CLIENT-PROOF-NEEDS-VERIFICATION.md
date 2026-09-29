# Client proof: verification status

> **2026-09-29:** "Manger" → "Manager" applied in production (testimonial `094ff68d…`). All 8 testimonials remain published, and all 10 marquee logos are unchanged. The `marquee_items` table has no link field, so no invalid case-study links exist.


Last updated 2026-09-29. Personal names are deliberately not repeated here; items are identified by CMS id and role.

**No Review, AggregateRating or testimonial schema exists, and none was added.** Testimonials remain normal website content.

## RESOLVED — confirmed by Daniel (2026-09-29)

### Testimonials: all 8 published testimonials are real and approved for use

| # | CMS id | Displayed role / company | Status | Notes |
|---|---|---|---|---|
| 1 | `…0101` | Founder, FlyUp Line | **Confirmed** | — |
| 2 | `…0102` | Founder, Luka Hair Salon | **Confirmed** | — |
| 3 | `…0103` | Founder, King Medical Arts Pharmacy | **Confirmed** | — |
| 4 | `…0104` | Founder, Maven Brand | **Confirmed** | Company shown as "Maven Brand" (kept as entered) |
| 5 | `02dee615…` | Creative Director | **Confirmed** | No company on record. None was added. |
| 6 | `601641b2…` | Brand Owner | **Confirmed** | No company on record. None was added. |
| 7 | `d709ffd8…` | Lead Product Partner | **Confirmed** | No company on record. (The earlier note that this role string matches the old demo seed is superseded by Daniel's confirmation.) |
| 8 | `094ff68d…` | Manger → **Manager** | **Confirmed** | Unambiguous typo. The correction is in `supabase/drafts/confirmed-facts-2026-09-29.sql` §6; the site shows "Manger" until that runs. |

Only confirmed information is displayed. Missing companies or project links were **not** invented.

### Client logos: all 10 marquee logos represent real Graphxify work

| Logo | Case study on site | Status |
|---|---|---|
| FlyUp Line | Yes | **Confirmed** |
| Maven | Yes | **Confirmed** |
| Pharmacy on King | Yes | **Confirmed** |
| King Medical Arts Pharmacy | Yes | **Confirmed** |
| MBM Interior & Exterior | No | **Confirmed real client/project** (work may not be publicly live) |
| Beity Eats | No | **Confirmed** (same) |
| Kaffecino | No | **Confirmed** (same) |
| Branza | No | **Confirmed** (same) |
| Echoshell | No | **Confirmed** (same) |
| Pick Click | No | **Confirmed** (same) |

A project doesn't need a public case study to be legitimate. The logos stay. No case studies, URLs or outcomes were invented for them.

## STILL REQUIRES ACTION (optional, not errors)

- [ ] Run SQL §6 to correct "Manger" → "Manager".
- [ ] If Daniel wants: add company names to testimonials 5–8, and approved project details for the six logo-only clients.
- [ ] Per-client permission to *name* them in future case studies or press, if that's ever planned beyond the existing logo use.

## History

On 2026-09-29 (QC pass), none of these could be verified from the repository alone. Testimonials 1–4 had been inserted by `supabase/seed.sql`, and 5–8 were created within about 3 minutes with no company. Daniel has since confirmed all of them.
