# Graphxify — Full Security & Quality Audit

**Date:** 2026-07-07
**Scope:** Application code (214 TS/TSX files, Next.js 16 + Supabase), all 26 SQL migration files, the **live** Supabase project (`cajxvhcrfgpyyqohlkfp`), dependencies, and configuration.
**Method:** Four parallel review passes (security, database/RLS, quality/config, live-infrastructure) plus direct verification of the two Critical findings against the running database and source.

---

## Verdict

The codebase is, on the whole, **well-engineered**: strict TypeScript with no `any`/`@ts-ignore`, disciplined error handling, zod validation on public inputs, a real role/permission model, audit logging, rate limiting, and RLS enabled on every table. The service-role key is server-only and never shipped to the client.

But there are **two confirmed Critical authorization flaws**, either of which lets a low-privilege user become an admin / exfiltrate data. These should be fixed before anything else. There is also a cluster of High issues around auth configuration, an unauthenticated destructive endpoint, and known-vulnerable dependencies.

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 8 |
| 🟡 Medium | 9 |
| ⚪ Low / Info | 8 |

---

## 🔴 CRITICAL

### C1 — API routes trust a client-supplied role header (privilege escalation) — *verified in code*
**Files:** `src/lib/auth/requireRole.ts:100-155`, `src/proxy.ts:161-172`, all `src/app/api/dashboard/**/route.ts`

`getCurrentProfile()` has a fast path that reads the caller's role straight from the `x-cms-role` request header. It verifies *identity* (`getUser().id === x-cms-uid`) but takes the **role from the header with no database lookup** (`role: normalizeRole(fwdRole)` at line 145).

This is only safe because the middleware strips and re-sets those headers from the validated DB role — but the middleware `matcher` (`proxy.ts:172`) covers `/dashboard`, `/admin`, and `/auth/callback` and **does not include `/api`**. So on API routes the header is never sanitized.

**Impact:** Any logged-in editor can call `/api/dashboard/*` with headers `x-cms-uid: <their own id>` + `x-cms-role: admin`. `getUser()` matches their own session and the code hands back `role: admin`. This defeats `requireApiPermission()` on every dashboard API route — confirmed consumers include `subscriptions/export` (dumps the full subscriber/PII list), and delete/restore on `posts`, `works`, `testimonials`, `testimonial-metrics`.

**Fix (either, ideally both):**
1. Add `"/api/:path*"` to the middleware `matcher` so inbound `x-cms-*` headers are stripped everywhere.
2. Make the API auth path authoritative from the DB — read `role` from `profiles` rather than trusting the header. (`src/app/api/test-email/route.ts:20-28` already does this correctly and is a good template.)

### C2 — Any authenticated user can self-promote to `admin` via `profiles.role_id` — *verified on live DB*
**Files:** `rls.sql:185-263`, `schema.sql:514-549`; live triggers `profiles_prevent_last_admin_change`, `profiles_sync_role_columns`

The self-update RLS policy (`profiles_update_self_or_admin`) allows a user to update their own profile row with **no column restriction** (`with check: auth.uid() = id`). The intended guard, `prevent_last_admin_change`, only inspects the `role`/`status` **text** columns — never `role_id` or `permissions` — and (confirmed on the live DB) only does anything when `old.role = 'admin'`, i.e. it exists solely to stop demoting the last admin. It does nothing for a normal user.

Meanwhile `sync_profile_role_columns` rewrites `role` from `role_id`. The two BEFORE triggers fire in **alphabetical order**, so `prevent_last_admin_change` (sees unchanged `role`, passes) runs *before* `sync_role_columns` (promotes the row). I confirmed the trigger order, the guard's function body, and the unrestricted `with_check` directly against the running database.

**Impact:** A regular editor updates only their own `role_id` (and/or `permissions` jsonb) and becomes `admin`. This is exploitable through the public PostgREST API with just an authenticated session.

**Fix:** Revoke column-level UPDATE on `role_id`/`permissions`/`disabled_until` from `authenticated` and route all role changes through an admin-only `SECURITY DEFINER` RPC. As defense-in-depth, extend `prevent_last_admin_change` to block non-admins from changing `role_id`/`permissions` and to fire on INSERT as well (the self-insert path is also unguarded).

---

## 🟠 HIGH

### H1 — Open redirect in the auth callback
`src/app/auth/callback/route.ts:18,24` — `next` param is used unvalidated in `NextResponse.redirect(new URL(next, request.url))`, so `?next=https://evil.com` redirects a freshly-authenticated user off-site. The sibling `auth/complete/page.tsx:10` validates correctly (`startsWith("/")`). **Fix:** require `next.startsWith("/") && !next.startsWith("//")`.

### H2 — Cron cleanup endpoint fails open, destroys audit trail
`src/app/api/cron/cleanup-logs/route.ts:20-23` — the auth check is `if (CRON_SECRET && authHeader !== ...)`. If `CRON_SECRET` is unset the guard is skipped entirely, and the endpoint (exposed as `GET`/`DELETE`) uses the service-role client to hard-delete `audit_logs`, `post_versions`, `work_versions`. `CRON_SECRET` isn't in `env.ts`. **Fix:** fail closed — refuse to run if the secret is missing; require the bearer token unconditionally; prefer POST.

### H3 — Disabled / timed-out accounts keep full database access
`rls.sql:16-66` — `is_admin()`/`is_editor()`/`is_staff()` etc. check only `role`, never `status='active'`, `disabled_until`, or `force_logout_at`. The entire account-disable / timeout / force-logout feature is **unenforced at the DB layer** — a disabled admin still passes `is_admin()`. **Fix:** add `and status='active' and (disabled_until is null or disabled_until < now())` to each helper.

### H4 — Public signup auto-provisions an `editor` with write access — *confirmed live*
`schema.sql:551-581` (`handle_new_user` defaults new users to `editor`) + live auth config shows **`disable_signup: false`**. Editors can insert posts/works and upload media, so **anyone who registers gains CMS write + storage-upload rights**. **Fix:** disable public signup (invite-only) or default self-signups to a no-privilege role; grant `editor` only on admin approval.

### H5 — Editors can read the entire newsletter subscriber PII list
`rls.sql:481-484` / `newsletter.sql:56-59` — `newsletter_staff_select` uses `is_admin() OR is_staff()`, and `is_staff()` includes `editor`, whose role grants no subscriber access. Leads are correctly gated to admin/moderator by contrast. **Fix:** change to `is_admin() OR is_moderator()`.

### H6 — Any authenticated user can write homepage marquee content
`marquee-items.sql:36-39` — `marquee_items_auth_write` is `FOR ALL USING (auth.role() = 'authenticated')` with no role gate and no `WITH CHECK`, so any logged-in user can insert/update/delete homepage marquee items. **Fix:** gate writes with `is_admin()`/`can_access_works()`.

### H7 — Known-vulnerable dependencies (4 High)
`npm audit`: **5 vulnerabilities (4 high, 1 moderate)**. Most serious:
- **`next`** — HTTP request smuggling, null-origin Server-Actions CSRF bypass, multiple DoS, SSRF via WebSocket upgrades, cache poisoning. Fixed in a newer 16.x patch (lockfile is behind).
- **`nodemailer` v8** — SMTP command injection via CRLF / `envelope.size`, TLS cert validation bypass. Patch available.
- `lodash`, `ws`, `picomatch`, `flatted`, `postcss`, `brace-expansion` (transitive). **Fix:** `npm update` / bump `next` and `nodemailer` to patched versions and re-audit.

### H8 — ESLint lints none of the application code
`eslint.config.mjs` + `package.json` — the config matches only `**/*.{js,cjs,mjs}` with empty rules, and the lint script excludes `.ts`/`.tsx`. All 214 TS/React files are unlinted, and the `eslint-disable @next/next/*` comments in the code are no-ops (the plugin isn't loaded). CI also never runs lint. **Fix:** add `typescript-eslint` + `eslint-config-next`, include `**/*.{ts,tsx}`, add a CI lint step.

---

## 🟡 MEDIUM

- **M1 — Unauthenticated public uploads allow SVG into the shared `media` bucket.** `src/app/api/uploads/public/route.ts` writes with the service-role client into the CMS `media` bucket and allows `image/svg+xml` (stored XSS on the storage origin); content-type is client-supplied. The authenticated route correctly restricts to `image/*`. **Fix:** dedicated isolated bucket, drop/sanitize SVG, validate magic bytes, force `Content-Disposition: attachment`.
- **M2 — Rate limiting is bypassable and fails open.** `src/lib/rate-limit.ts` keys on the client-controllable `x-forwarded-for` first hop and falls back to a per-instance in-memory Map on Redis error; the login limiter also fails open on exception (`admin/actions.ts:150-158`), enabling brute-force. **Fix:** trusted-hop IP, fail closed for auth, ensure Upstash is set in prod.
- **M3 — Stored XSS via JSON-LD.** `src/components/seo/json-ld.tsx` injects `JSON.stringify(data)` via `dangerouslySetInnerHTML` without escaping `</script>`. CMS content (blog title/author) reaches this, so a lower-trust author can break out and run script on public pages. **Fix:** escape `<`/`>`/`&` to `<` etc.
- **M4 — 42 SECURITY DEFINER helper functions are `EXECUTE`-able by `anon`/`authenticated`** via `/rest/v1/rpc/*` (live security advisor). Includes `is_admin()`, `handle_new_user()`, `prevent_last_admin_change()`. Low direct impact (they read the caller's own context) but should not be publicly callable. **Fix:** `REVOKE EXECUTE ... FROM anon, authenticated` on internal helpers.
- **M5 — Weak auth policy — *confirmed live*.** Password min length **6**, no complexity requirement, **leaked-password protection off**, **CAPTCHA off**. Combined with open public INSERT on `leads`/`newsletter`/`page_views` this is a real spam/abuse and weak-credential vector. **Fix:** raise min length to 8-12, enable HaveIBeenPwned check + CAPTCHA.
- **M6 — Env vars silently degrade instead of failing.** `src/lib/env.ts` returns empty-string fallbacks and only `console.warn`s for missing critical keys (anon key, service role), so a misconfigured deploy boots in a broken "degraded" state. Production URL/ref are hardcoded as fallbacks in three files. **Fix:** validate with zod at startup; throw for required server vars.
- **M7 — Conflicting `can_edit_posts` definitions.** `rls.sql:100-110` vs `posts-edit-permissions.sql:4-35` diverge; the latter drops the published-content guard and lets editors edit null-author posts. Whichever file runs last wins. **Fix:** single authoritative definition, keep the publish guard.
- **M8 — Migration hygiene / schema drift.** `handle_new_user`, `sync_profile_role_columns`, the `app_roles` seed, and the `profiles` column block are redefined across 5 files with conflicting values (`app_roles.sort_order` seeded `0/1/2` in schema.sql vs `1/2/3` in app-roles.sql), run-order-dependent, with a destructive `drop table app_roles` path. **Fix:** consolidate into one ordered, idempotent, timestamped migration chain.
- **M9 — `@types/nodemailer` v6 paired with `nodemailer` v8** — mismatched types for the email layer. **Fix:** remove `@types/nodemailer` (v7+ ships its own types).

---

## ⚪ LOW / Informational

- **L1 — No security response headers.** `next.config.ts` sets only `X-Robots-Tag`; no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. A CSP would blunt M1/M3. **Fix:** add a global header set.
- **L2 — Performance: 8 unindexed foreign keys** (`posts.author_id`, `works.author_id`, `audit_logs.actor_id`, `profiles.role_id`, etc.) and **status columns used in RLS on every read are unindexed** (live perf advisor). **Fix:** btree/partial indexes on FK + `status` columns.
- **L3 — Performance: 31 "multiple permissive policies" + 7 `auth_rls_initplan` warnings** (live perf advisor) — duplicate/overlapping RLS policies and `auth.*()` calls re-evaluated per row. **Fix:** consolidate policies; wrap `auth.uid()` as `(select auth.uid())`.
- **L4 — `public.media` bucket allows listing all files** (live security advisor) and is public. Acceptable for public assets; confirm no private files land there. **Fix:** drop the broad `SELECT` list policy.
- **L5 — 2 functions with mutable `search_path`** (`normalize_app_role`, `set_updated_at`) — live advisor. **Fix:** `set search_path = public`.
- **L6 — `PROJECT_FILES_DUMP.txt` (173 KB) committed** — a stale full-source snapshot; contains the *publishable* (public, RLS-protected) key only, no real secrets. It's bloat that will drift. **Fix:** delete and gitignore.
- **L7 — No tests of any kind.** No runner/config/tests; untested auth, rate-limit, and service logic. **Fix:** add Vitest for lib/service logic at minimum.
- **L8 — Redundant `testimonial_metrics` SELECT policies** (`using(true)` public read makes the staff policy dead code) and large 1,000+ line files (`content-form.tsx`, `users/actions.ts`). Maintainability, not defects.

---

## What was checked and found solid

- RLS enabled on **all 14 tables**; anonymous role has **no** read access to `profiles`, `leads`, `newsletter_subscribers`, or `audit_logs` — **no anon PII leak**.
- Dashboard/admin **server actions** (user management, settings) are correctly gated with `requireRole(["admin"])`, enforce "cannot remove the last admin", and run under middleware-covered paths — C1 does *not* affect them (it's specific to `/api` routes).
- Public endpoints (`leads`, `reviews`, `newsletter`) use zod validation, rate limiting, token-based unsubscribe, and the parameterized query builder — no raw SQL concatenation found.
- Service-role key is `server-only`, never sent to the client. No hardcoded real secrets committed (`.env` is gitignored; dump contains only the public key).
- All SECURITY DEFINER functions set `search_path = public` (except the two in L5).
- TypeScript strict mode, no `any`/`@ts-ignore`, error boundaries present, disciplined logging.

---

## Recommended fix order

1. **C1 + C2** — the two privilege-escalation paths. Nothing else matters until these are closed.
2. **H2** (fail-closed cron), **H4/M5** (lock down signup + password policy), **H7** (bump `next`/`nodemailer`).
3. **H1, H3, H5, H6** — the remaining authz gaps.
4. **H8 + M-series** — linting, env validation, upload hardening, JSON-LD escaping, migration consolidation.
5. **L-series** — headers, indexes, policy cleanup, repo hygiene, tests.
