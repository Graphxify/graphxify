# AI & search crawler access: production verification

> **QC update (2026-09-29, pre-deployment pass):** parts of this document were superseded by [SEO-AI-SEARCH-QC-REPORT.md](SEO-AI-SEARCH-QC-REPORT.md). Where they differ, the QC report is authoritative.

**Goal:** confirm that legitimate search and retrieval crawlers can fetch public Graphxify pages, **without** weakening protection against spoofed bots. robots.txt only expresses a policy. A WAF, firewall, bot-protection feature, rate limit or middleware can still silently block a crawler that robots.txt allows.

## Current policy (`src/app/robots.ts`)

| User agent | Operator | Purpose | Policy | Honors robots.txt |
|---|---|---|---|---|
| `Googlebot` (via `*`) | Google | Search, including AI Overviews / AI Mode | Allowed (private paths blocked) | Yes |
| `Bingbot` (via `*`) | Microsoft | Bing search, Copilot grounding | Allowed | Yes |
| `OAI-SearchBot` | OpenAI | ChatGPT search results | **Allowed (explicit)** | Yes |
| `ChatGPT-User` | OpenAI | User-initiated fetches in ChatGPT. OpenAI: "not used to determine whether content may appear in Search" (that's OAI-SearchBot). | Allowed (explicit) | "robots.txt rules may not apply" |
| `Claude-SearchBot` | Anthropic | Search indexing for Claude | **Allowed (explicit)** | Yes |
| `Claude-User` | Anthropic | User-initiated fetches in Claude | Allowed (explicit) | Yes (per Anthropic) |
| `PerplexityBot` | Perplexity | Perplexity search indexing | **Allowed (explicit)** | Yes |
| `Perplexity-User` | Perplexity | User-initiated fetches. Listed in Perplexity's first-party doc (docs.perplexity.ai/guides/bots), re-checked 2026-09-29. | Allowed (explicit) | "generally ignores robots.txt" |
| `GPTBot` | OpenAI | Model **training** | **Blocked** (existing policy, unchanged) | Yes |
| `Google-Extended` | Google | Gemini **training/grounding** control token, with no separate crawler. Google: it "does not impact a site's inclusion in Google Search nor is it used as a ranking signal". | **Blocked** (existing policy, unchanged) | Yes |
| `ClaudeBot` | Anthropic | Model **training** | Not addressed. Falls under `*` (allowed). Add a group if you want to opt out. | Yes |

Private paths blocked for everyone: `/dashboard /admin /api /auth /newsletter /reset-password`.

**Sources** (re-check periodically, since vendors add agents):
- OpenAI: https://developers.openai.com/api/docs/bots
- Anthropic: https://support.claude.com/en/articles/8896518
- Perplexity: https://docs.perplexity.ai/guides/bots
- Google: https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
- Bing: https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0

## Verification checklist (production)

### 1. robots.txt is live and correct
```bash
curl -s https://www.graphxify.com/robots.txt
```
Expect the `*` group, one group listing the six search/retrieval agents, the GPTBot and Google-Extended blocks, and the `Sitemap:` line.

### 2. Server returns 200 to each user agent (no challenge page)
```bash
for ua in "Googlebot/2.1" "bingbot/2.0" "OAI-SearchBot/1.0" "ChatGPT-User/1.0" "Claude-SearchBot" "Claude-User" "PerplexityBot/1.0" "Perplexity-User/1.0"; do
  printf "%-22s " "$ua"
  curl -s -o /dev/null -w "%{http_code} %{size_download}B\n" -A "Mozilla/5.0 (compatible; $ua)" https://www.graphxify.com/services
done
```
Each should print `200` with a normal page size. A 403 or 429, or a tiny body (a challenge page), means something upstream is blocking. *Checked 2026-09-29: `/` returned 200 for Googlebot, OAI-SearchBot, Claude-SearchBot, PerplexityBot and GPTBot UAs.*

> Spoofing a UA from your own machine only proves there's no **UA-based** block. Real crawlers come from their operators' IP ranges, which can be treated differently. That's why step 5 matters.

### 3. Content is in the initial HTML (no JavaScript needed)
```bash
curl -s https://www.graphxify.com/services/web-design | grep -c '<h1'           # expect 1
curl -s https://www.graphxify.com/services/web-design | grep -c 'hidden id="S:' # expect 0
```
The second check guards against the streaming regression fixed in this pass (finding K1).

### 4. Vercel
- **Firewall / Attack Challenge Mode:** if it's ever enabled, verified crawlers from Google and Bing are allowed by Vercel, but other AI crawlers may be challenged. Check Project → Firewall for rules or "Bot Protection" settings.
- **Bot management rules** (managed rulesets that block "AI bots"): make sure they don't include the *search* agents above. Blocking training bots is a policy choice; blocking search bots removes Graphxify from those products.
- **Deployment Protection** must apply to Preview only, never Production.
- Check **Observability → Logs** filtered by user agent for 4xx/5xx responses to the agents above.

### 5. Cloudflare or another CDN (if ever placed in front of Vercel)
- Security → Bots: "Block AI Scrapers and Crawlers" / "AI Crawl Control" can block search agents as well as training agents. Configure it per agent.
- Keep "Verified Bots" allowed, and review Security Events for challenged requests from the agents above.

### 6. Verify identity rather than trusting the user agent
- **Googlebot / Bingbot:** reverse DNS then forward DNS (`*.googlebot.com` / `*.google.com`; `*.search.msn.com`), or Google's published JSON IP ranges.
- **OpenAI:** `https://openai.com/searchbot.json`, `https://openai.com/chatgpt-user.json`, `https://openai.com/gptbot.json`
- **Anthropic:** `https://claude.com/crawling/bots.json`
- **Perplexity:** `https://www.perplexity.com/perplexitybot.json`, `https://www.perplexity.com/perplexity-user.json`

If you add firewall allow-rules, allow by **verified IP range**, not by user-agent string. UA strings are trivially spoofed. **Never** disable rate limiting or security headers to "help" crawlers.

### 7. Middleware
`src/proxy.ts` runs only on `/dashboard`, `/admin`, `/auth/callback` and `/api`, so it can't affect public pages. Re-check this if the matcher is ever widened.

## Re-verify after

- Any change to `robots.ts`, `next.config.ts` headers or redirects, or `proxy.ts`
- Enabling any Vercel or Cloudflare bot or firewall feature
- Every few months (vendors add or rename agents)
