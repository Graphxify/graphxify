# Adding GA4 later (not installed)

**Current state:** the site uses **Vercel Web Analytics** (and Speed Insights), mounted in `src/app/layout.tsx` behind `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` / `NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS`. It's cookieless, tracks SPA route changes automatically, and conversion events go through `src/lib/analytics-events.ts`.

**GA4 was deliberately not added:** there's no Measurement ID, and GA4 sets cookies, which requires a consent decision (Canada's PIPEDA / Québec Law 25, GDPR for EU visitors). Only add it when both exist.

## 1. Prerequisites (Daniel)

- [ ] Create a GA4 property and web data stream for `https://www.graphxify.com`, and copy the **Measurement ID** (`G-XXXXXXXXXX`).
- [ ] Decide on consent: at minimum, Google Consent Mode v2 with a banner for regions that require opt-in. Update `/privacy` (it currently describes privacy-friendly analytics only).
- [ ] Decide whether Vercel Analytics stays. Running both is fine if they're kept separate, but **don't send the same event twice to the same tool**.

## 2. Page views (developer)

1. Install `@next/third-parties` and add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel (Production only).
2. In `src/app/layout.tsx`, next to `<Analytics />`, render `<GoogleAnalytics gaId={id} />` **only when** the ID is set **and** `VERCEL_ENV === "production"`, the same gating pattern as the existing analytics flags. GA4's enhanced measurement tracks App Router navigations (history changes), so **don't** add a manual `page_view` on route change. That would double-count.
3. Don't load GA on `/dashboard`, `/admin` or `/auth`. The root layout wraps those too, so gate on the pathname, or move the tag into `src/app/(marketing)/layout.tsx`.

## 3. Conversions

Extend the **existing** helper rather than adding new call sites. `trackConversion()` is already called on every successful submission, so add GA inside it:

```ts
// src/lib/analytics-events.ts — inside trackConversion(), after the Vercel track()
window.gtag?.("event", event.name, event.properties ?? {});
```

| Event (already fired) | Fired when | Mark as GA4 key event? |
|---|---|---|
| `lead_submitted` (`form: contact_page \| quick_form`) | `/api/leads` returns success | **Yes** (primary conversion) |
| `newsletter_subscribed` (`placement`) | `/api/newsletter` success | Yes (secondary) |
| `review_submitted` | `/api/reviews` success | No |

Never put names, emails or message text in event parameters.

## 4. Primary CTA clicks (not yet tracked)

The main CTAs ("Start a Project" in the header, hero and CTA sections, and the Contact button) are server-rendered `<Link>`s. To track them without duplicating anything:

- Add `data-cta="<placement>"` attributes to those links (for example `header`, `home_hero`, `site_cta`, `service_hero`).
- Add **one** small client listener in the marketing layout that catches clicks on `[data-cta]` and calls `trackConversion({ name: "cta_clicked", properties: { placement } })`. Add `cta_clicked` to the `ConversionEvent` union.
- Treat `email_clicked` / `phone_clicked` (`mailto:` / `tel:` links) the same way with `data-contact="email|phone"`.

GA4's enhanced measurement "outbound clicks" already covers links to client live sites. Don't add a custom event for those.

## 5. AI referral reporting in GA4

- **Admin → Data display → Channel groups:** copy the default group and add a channel **"AI assistants"** *above* "Referral", with the condition: session source matches regex
  `(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|copilot\.microsoft\.com|gemini\.google\.com)$`
  or session source = `chatgpt.com` (ChatGPT appends `utm_source=chatgpt.com`).
- **Explore:** a free-form exploration with the rows *Session source* (filter channel = AI assistants), and the values *Sessions*, *Key events (lead_submitted)*, *Landing page*.
- Caveats (also in [AI-REFERRAL-TRACKING.md](AI-REFERRAL-TRACKING.md)): this captures clicks, not citations. Some apps send no referrer. Google AI Overviews / AI Mode clicks appear as google / organic.

## 6. Verify

- DebugView shows `page_view` once per navigation (not twice).
- Submitting the contact form shows exactly one `lead_submitted`.
- There are no GA requests from `/dashboard`, and none before consent where consent is required.
