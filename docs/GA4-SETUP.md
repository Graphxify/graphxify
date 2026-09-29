# GA4 and event tracking

**Status:** the code is implemented and waiting for a Measurement ID. GA4 loads **only** when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set to a valid `G-…` ID. Until then, no Google script ships. Vercel Web Analytics runs independently (`NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true` in Production).

## How it's wired

| Piece | File | Notes |
|---|---|---|
| GA4 loader | `src/components/analytics/site-analytics.tsx` | Mounted in `src/app/(marketing)/layout.tsx` only. **Never** loaded on `/dashboard`, `/admin` or `/auth`. Uses `next/script` `afterInteractive`. |
| Page views | GA4 `config` + enhanced measurement | The initial `page_view` comes from `config`. App Router navigations are recorded by enhanced measurement ("Page changes based on browser history events", which is on by default). **No manual `page_view` is sent**, so there's no double counting. |
| Vercel page views | `<Analytics />` in `src/app/layout.tsx` | A separate product with separate numbers. It doesn't feed GA4, so there's no cross-tool duplication. |
| Events | `src/lib/analytics-events.ts` | `trackConversion()` / `trackClick()` send each event to Vercel (if enabled) and GA4 (if loaded). Parameters never contain names, emails, phone numbers or message text. |
| Click listener | `site-analytics.tsx` | One delegated `click` listener (capture phase). No per-link code. |
| First-touch attribution | `captureFirstTouch()` | Stores the landing page, `utm_source` / `utm_medium` / `utm_campaign` and the AI-referral label in `sessionStorage` (per tab, cleared when the tab closes). They're attached to lead events so attribution survives in-site navigation. |

## Event catalogue

| Event | Fires when | Parameters | GA4 key event? |
|---|---|---|---|
| `contact_form_submit` | `/api/leads` returns success (contact page **or** quick form). Never on validation errors or failures. | `form` (`contact_page` \| `quick_form`) + first-touch parameters | No |
| `project_inquiry` | Same moment as `contact_form_submit`, **GA4 only** | same | **Yes, the single key event** (one per successful inquiry) |
| `newsletter_subscribed` | `/api/newsletter` success | `placement` | Optional (secondary) |
| `review_submitted` | `/api/reviews` success | none | No |
| `primary_cta_click` | Click on any link to `/contact` from another page | `cta_location` (`<path>#header\|footer\|content`), `cta_text` | No |
| `email_click` | Click on a `mailto:` link | `link_location` | No |
| `phone_click` | Click on a `tel:` link | `link_location` | No |
| `outbound_project_click` | Click on a case study's "Visit Site" button | `project` (canonical slug), `link_domain` | No |

First-touch parameters on lead events are `landing_page`, `utm_source`, `utm_medium`, `utm_campaign` and `ai_referral`. Each is included only when present.

Vercel receives `contact_form_submit` (not `project_inquiry`), so its custom-event counts equal submissions. Custom events on Vercel require a plan that includes them.

## UTM preservation

- GA4 reads UTMs from the landing URL automatically. The first-touch store keeps them for lead events.
- Every legacy redirect in `next.config.ts` is a Next.js `redirects()` rule, and those carry the query string through (for example `/work?utm_source=x` → `/works?utm_source=x`). The apex → www host redirect is Vercel's, and it also preserves the query.
- Don't add UTMs to internal links. That would overwrite the real source in GA4.

## After the Measurement ID exists

1. In GA4, go to **Admin → Data streams → Web → Enhanced measurement** and confirm that **Page views → "Page changes based on browser history events"** is **on**. Leave "Outbound clicks" on. It complements `outbound_project_click`.
2. Go to **Admin → Events** (the events appear within about 24 h of the first occurrence). Mark `project_inquiry` as a **key event**. Don't mark `contact_form_submit` too, or every inquiry would count twice.
3. Under **Admin → Custom definitions**, create event-scoped dimensions for `form`, `cta_location`, `cta_text`, `link_location`, `project`, `link_domain`, `ai_referral`, `landing_page`.
4. Create the "Known AI referral traffic" channel. See [AI-REFERRAL-MEASUREMENT.md](AI-REFERRAL-MEASUREMENT.md).
5. Verify with **Admin → DebugView** (or the Tag Assistant extension):
   - one `page_view` per navigation;
   - clicking a CTA shows `primary_cta_click`;
   - there are no GA requests on `/dashboard`.
   - Don't submit a real inquiry just to test. Wait for a genuine one, or use a clearly marked test and delete the lead afterwards.

## Privacy and consent (decision for Daniel)

GA4 sets first-party cookies (`_ga`, `_ga_*`). The site has **no consent banner**, and `/privacy` currently describes privacy-friendly analytics only. **Before** setting the Measurement ID in Production:

- Update `/privacy` to name Google Analytics, what it collects, and how to opt out.
- Decide whether consent is required for your visitors. Canadian PIPEDA generally allows analytics with notice, but Québec Law 25 and the EU/UK GDPR require opt-in for non-essential cookies. If you need opt-in, add a consent banner with Google Consent Mode v2 (default `analytics_storage: denied`) **before** enabling GA4. That is a separate change.
