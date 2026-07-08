# Security Remediation — Applied & Pending

Companion to [AUDIT_REPORT.md](AUDIT_REPORT.md). Date: 2026-07-07.

## ✅ Applied to the code (verified: typecheck ✓, lint ✓, production build ✓)

| Finding | Change | File(s) |
|---------|--------|---------|
| **C1** | `/api/:path*` added to middleware matcher so forged `x-cms-*` headers are stripped; `getCurrentProfile()` now reads role/status from the DB instead of trusting the header | `src/proxy.ts`, `src/lib/auth/requireRole.ts` |
| **H1** | Auth callback rejects non-relative `next` (open-redirect fix) | `src/app/auth/callback/route.ts` |
| **H2** | Cron cleanup fails closed when `CRON_SECRET` is unset (503) | `src/app/api/cron/cleanup-logs/route.ts` |
| **H7** | `next` → 16.2.10, `nodemailer` → 9.x, `npm audit fix` for transitive CVEs; 4 High → 0 (2 moderate remain, no non-breaking fix) | `package.json`, `package-lock.json` |
| **H8** | ESLint now lints `.ts/.tsx` via `typescript-eslint` + `@next/eslint-plugin-next` | `eslint.config.mjs`, `package.json` |
| **M1** | `image/svg+xml` removed from public upload allow-list (stored-XSS vector) | `src/app/api/uploads/public/route.ts` |
| **M3** | JSON-LD output escapes `<`/`>`/`&` (breakout XSS fix) | `src/components/seo/json-ld.tsx` |
| **L1** | Baseline security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS) added globally | `next.config.ts` |

Canonical SQL source files were also updated to match the migration below: `supabase/rls.sql`, `supabase/marquee-items.sql`.

## ✅ Applied to PRODUCTION (2026-07-07)

### 1. Database migration — `supabase/migrations/20260707_security_audit_fixes.sql`
**Applied and verified on the live database.** Covers **C2** (self-escalation), **H3** (disabled accounts), **H5** (newsletter PII), **H6** (marquee writes), **M4** (trigger-fn RPC exposure — revoked from `public`), **L5** (search_path). Idempotent and transaction-wrapped.

Post-apply verification (all confirmed against the running DB):
- `prevent_last_admin_change` now guards `role_id`/`permissions`/`disabled_until`.
- `is_admin/is_editor/is_moderator/is_staff` now require `status='active'` and not-timed-out.
- `newsletter_staff_select` → `is_admin() OR is_moderator()`.
- `marquee_items` write policy → `can_access_works()`.
- `search_path` pinned on `normalize_app_role`/`set_updated_at`; `function_search_path_mutable` advisor warnings cleared.
- Trigger functions no longer `EXECUTE`-able by `anon`/`authenticated`.

### 2. Auth configuration (H4 / partial M5) — **applied via Management API**
- **Public signup disabled** (`disable_signup: true`) — admins still create users via the service-role admin API, which is unaffected. (H4 closed.)
- **Password minimum length 6 → 8.**
- **Character classes required** (lowercase + uppercase + digits).

## ⏳ Still pending — blocked by plan/config (cannot be applied via API here)

- **Leaked-password protection (HaveIBeenPwned):** requires a Supabase **Pro plan** — the API returned 402 on the free tier. Enable after upgrading, in Auth settings.
- **CAPTCHA** on auth + public forms: not enabled because it needs an hCaptcha/Turnstile **provider secret**; enabling it without one would break login. Add the provider secret, then enable in the dashboard. This is the intended mitigation for the remaining open public-INSERT policies on `leads`/`newsletter`/`page_views` (which are the public contact/newsletter forms and are otherwise correct).

Dashboard: https://supabase.com/dashboard/project/cajxvhcrfgpyyqohlkfp/auth/policies

**Recommended smoke tests** (the DB changes are tightening):
- A normal editor can still update their own `display_name`/`avatar`/`phone`.
- An admin can still change another user's role (service-role path).
- A logged-in non-admin gets an error if they attempt to set their own `role_id`.

## Not changed (deliberately)
- **M9** (`@types/nodemailer`): left in place — nodemailer does **not** bundle its own types (verified), so removing it would break typechecking.
- **Enforced CSP** (part of L1): omitted because it needs per-app tuning (Next inline scripts, framer-motion). Added as a follow-up note in `next.config.ts`.
- **`PROJECT_FILES_DUMP.txt`** (L6) and other Low items: left for a separate cleanup pass.
- No commits or pushes were made — all changes are in the working tree for your review.
