# AI referral measurement

This doc supersedes the measurement parts of [AI-REFERRAL-TRACKING.md](AI-REFERRAL-TRACKING.md), which was written before GA4 was implemented.

## What "Known AI referral traffic" means

It means visits that **arrive by clicking a link** in an AI assistant **and** can be identified, either:

1. by the **referrer hostname** (for example `chatgpt.com`, `perplexity.ai`), or
2. by a **`utm_source`** that the assistant appends (ChatGPT search adds `utm_source=chatgpt.com`).

The classifier is `src/lib/ai-referrals.ts` (`classifyAiReferral`), and it's unit-tested in `tests/unit/ai-referrals.spec.ts`. The label is attached as the `ai_referral` parameter on lead events (`contact_form_submit`, `project_inquiry`).

## What it does **not** measure

- **Citations without clicks.** Most AI answers that mention Graphxify produce no visit, and analytics can't see them.
- **AI apps that strip the referrer.** Several mobile and desktop apps do this. Those visits land in **Direct**.
- **Google AI Overviews / AI Mode.** These clicks arrive as `google / organic` and can't be separated. Use Search Console, where AI features are included in Web search totals.
- **Bing Copilot answers inside Bing search.** These often appear as `bing / organic`.

Treat the number as a **floor**, never as "total AI visibility".

## Recognised platforms

| Platform | Referrer hosts | `utm_source` values |
|---|---|---|
| ChatGPT | `chatgpt.com`, `chat.openai.com` | `chatgpt.com`, `chatgpt`, `openai` |
| Perplexity | `perplexity.ai` (+ subdomains) | `perplexity`, `perplexity.ai` |
| Claude | `claude.ai` | `claude`, `claude.ai` |
| Gemini | `gemini.google.com`, `bard.google.com` | `gemini` |
| Microsoft Copilot | `copilot.microsoft.com`, `copilot.cloud.microsoft` | `copilot` |
| DeepSeek | `chat.deepseek.com` | `deepseek` |
| Meta AI | `meta.ai` | — |
| Mistral | `chat.mistral.ai` | — |
| Grok | `grok.com` | — |
| You.com / Phind | `you.com`, `phind.com` | — |

Hosts match exactly or as a subdomain (`www.perplexity.ai` matches, `notchatgpt.com` doesn't). Review the list every quarter, because assistants change domains.

## GA4 setup (after the Measurement ID exists)

### Custom channel group
Go to **Admin → Data display → Channel groups → Create new channel group** (copy the default group first so the other channels stay intact).

1. **Add new channel.** Name it `Known AI referral traffic`.
2. Condition: **Session source** *matches regex*:
   ```
   chatgpt\.com|chat\.openai\.com|openai|perplexity|claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.cloud\.microsoft|deepseek|meta\.ai|mistral\.ai|grok\.com|you\.com|phind\.com
   ```
   This is the same pattern as `AI_SOURCE_REGEX` in `src/lib/ai-referrals.ts`.
3. **Reorder** so the channel sits **above "Referral"**. GA4 assigns the first matching channel.
4. Save. The group applies retroactively to reports, though not to data older than the group's creation in some views.

### Exploration
Go to **Explore → Free form.** Use these settings:
- Rows: *Session custom channel group*, *Session source*, *Landing page + query string*.
- Values: *Sessions*, *Engaged sessions*, *Key events*.
- Filter: channel group = Known AI referral traffic.

Also add the event-scoped custom dimension `ai_referral` to see which platform preceded each `project_inquiry`.

## Vercel Web Analytics (already on in Production)

- Go to **Analytics → Referrers** and search the hosts above.
- Use **Analytics → UTM** and filter `utm_source = chatgpt.com`.
- Under **Events**, `contact_form_submit` can be filtered by referrer. This works only if the plan includes custom events.

## Reporting cadence

Monthly: record AI-referral sessions and AI-referred `project_inquiry` counts in the benchmark log (see [SEARCH-AI-MONITORING-BASELINE.md](SEARCH-AI-MONITORING-BASELINE.md)). **Record zero as zero.** Never estimate or model missing data into this log.
