# Environment variables

**Names only.** No values belong in this file, in Git or in chat. Values live in **Vercel → Project → Settings → Environment Variables**. CI's *public* values live in **GitHub → Settings → Secrets and variables → Actions → Variables**.

**Public** means the value is compiled into browser JavaScript (`NEXT_PUBLIC_*`) or served publicly. **Secret** means server-only; never expose it.

## Vercel (the real build and runtime)

| Name | Public / Secret | Environments | Required | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Prod, Preview, Dev | Yes | Canonical origin (`https://www.graphxify.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Prod, Preview, Dev | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public (RLS-limited) | Prod, Preview, Dev | Yes | Browser/anon Supabase access |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (RLS-limited) | Prod, Preview, Dev | Legacy fallback | Used only if the publishable key is missing |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Prod, Preview, Dev | Yes (server) | CMS writes, lead storage. **Never in CI, never client-side** |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | **Secret** (`SMTP_PASS`) / config | Prod, Preview, Dev | For email | Lead and newsletter notifications |
| `OWNER_NOTIFY_EMAIL` | Config | Prod, Preview, Dev | For email | Inquiry notification recipient |
| `CRON_SECRET` | **Secret** | Prod, Preview, Dev | For cron | Authenticates `/api/cron/*` |
| `INDEXNOW_KEY` | Public once served (keep it out of Git) | **Production only** | For IndexNow | Served at `/indexnow-key.txt`; enables pings |
| `NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS` | Public flag | **Production** | Optional | `true` mounts Vercel Web Analytics (currently set) |
| `NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS` | Public flag | Production | Optional | `true` mounts Speed Insights (not set; the product is disabled at project level) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | **Production only** | Optional | `G-…` ID. GA4 loads only when set (**not set yet**) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | **Secret** (token) | — | Optional | Rate limiting; the app runs in degraded mode without them (not set) |
| `NEWSLETTER_CHECKLIST_URL` | Config | — | Optional | Checklist link in newsletter emails |
| `NEXT_PUBLIC_IMAGE_DOMAINS` | Public | — | Optional | Extra `next/image` hosts |
| `NEXT_PUBLIC_BYPASS_SUPABASE_IMAGE_OPTIMIZATION` | Public flag | — | Optional | Debug switch; leave unset |
| `INDEXNOW_FORCE` | Flag | never in Vercel | Local only | Allows IndexNow outside production (for the manual script) |

Set by Vercel automatically: `VERCEL_ENV`, `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL`.

## GitHub Actions (CI)

CI builds and tests with **public values only**. They're stored as repository **variables**, because they're not secret:

| Name | Type | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Variable | `https://www.graphxify.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | Variable | Same as Vercel |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Variable | Same as Vercel; what it can do is limited by Supabase RLS policies |

There are deliberately **no** GitHub secrets. CI doesn't have `SUPABASE_SERVICE_ROLE_KEY`, SMTP credentials or `CRON_SECRET`, so the server-side write paths (CMS saves, lead storage, email) can't run in CI. The build and tests only read public content, and the contact-form browser test blocks `/api/leads` and never submits. The workflow token is `contents: read`.

## Rules

- Never commit `.env`, `.env.local`, service-account JSON, OAuth tokens or keys. `.gitignore` ignores `.env` and every `.env.*` file except `.env.example`.
- To rotate a secret: set the new value in Vercel, redeploy, then revoke the old one at its source (Supabase, the SMTP provider).
- Changing a `NEXT_PUBLIC_*` value requires a **redeploy**, because it's inlined at build time.
