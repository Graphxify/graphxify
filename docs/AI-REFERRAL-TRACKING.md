# Measuring referral traffic from AI assistants

## What exists today

- **Vercel Web Analytics**, mounted in `src/app/layout.tsx` only when `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS=true`, and **Speed Insights** (`NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS=true`). It's cookieless and does SPA route tracking automatically, with one implementation and no duplicate page views.
- **No GA4**, no Google Tag Manager, no consent banner. None was added. A second analytics system would duplicate data and need a consent review.
- **New:** conversion events (see the implementation report): `lead_submitted`, `newsletter_subscribed`, `review_submitted`, via `src/lib/analytics-events.ts`. Custom events require a Vercel plan that includes them.

## Important limits

- Referral data captures **clicks**, not citations or mentions. Many AI answers cite Graphxify without anyone clicking, and those are invisible to analytics.
- Some AI apps (mobile apps, some desktop clients) send **no referrer**, so that traffic lands as "Direct".
- Google AI Overviews / AI Mode clicks arrive as **google.com** organic traffic and can't be separated from regular search in analytics. Use Google Search Console instead.
- Referrer domains change. Review the list below periodically.

## Referrer domains to watch

| Assistant | Referrer host(s) commonly seen |
|---|---|
| ChatGPT | `chatgpt.com`, `chat.openai.com` (legacy). ChatGPT often appends `utm_source=chatgpt.com` to links. |
| Perplexity | `perplexity.ai`, `www.perplexity.ai` |
| Claude | `claude.ai` |
| Microsoft Copilot | `copilot.microsoft.com`, and sometimes `bing.com` |
| Gemini | `gemini.google.com` |
| DeepSeek, Meta AI, etc. | `chat.deepseek.com`, `meta.ai` (low volume) |

## How to measure

### Vercel Web Analytics (current tool)
1. Dashboard → Analytics → **Referrers** panel. Filter or search for the hosts above.
2. Add a **UTM Parameters** view and filter `utm_source=chatgpt.com`.
3. Compare conversions: filter the custom events by referrer to see whether AI-referred visitors submit leads.

### If GA4 is ever added (requires a consent decision first)
- Create a custom channel group "AI Assistants" with the regex `(chatgpt|openai|perplexity|claude|copilot|gemini)\.` on session source, placed **above** "Referral".
- Build an Exploration: channel = AI Assistants, metrics = sessions, key events (`lead_submitted`).

### Search Console / Bing Webmaster Tools (for AI search surfaces)
- **Google Search Console → Performance:** AI Overviews / AI Mode traffic is included in Web search totals. Watch query and page trends; don't expect a separate "AI" filter.
- **Bing Webmaster Tools → AI Performance** (if available in your account): reports on Copilot / Bing AI citations of your pages.

## What not to do

- No fingerprinting, no cross-site identifiers, no scraping of AI answers from the website.
- Don't treat referral counts as the total of AI visibility. Pair them with periodic manual checks of how assistants describe Graphxify (see the external checklist, "AI-query tracking").
