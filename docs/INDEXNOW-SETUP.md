# IndexNow setup

IndexNow lets Graphxify notify participating search engines (Bing, and through the shared protocol Yandex, Seznam, Naver and others) the moment a URL is created, meaningfully updated or deleted. **Google does not use IndexNow.** Google discovers changes through the sitemap and normal crawling.

## What's already built (inert until a key is set)

| Piece | File | Behaviour |
|---|---|---|
| Submission utility | `src/lib/indexnow.ts` | POSTs to `https://api.indexnow.org/indexnow`. Same-host URLs only, 8 s timeout, **never throws** (a CMS save can't fail because of it). It only submits when `VERCEL_ENV=production` (or `INDEXNOW_FORCE=true`), so local dev and preview deploys never ping. |
| Key file | `src/app/indexnow-key.txt/route.ts` | Serves the key at `https://www.graphxify.com/indexnow-key.txt`. Returns **404 until `INDEXNOW_KEY` is set**. It's sent as `keyLocation` with every submission. |
| CMS hook | `src/services/content-service.ts` | After saving a post or work that **is or was published**, it queues the item URL, its index page and any old URL if the slug changed. It runs after the response is sent (`after()`). Deleting a published item submits its URL. |
| Manual script | `scripts/indexnow-submit.mjs` → `npm run indexnow:submit` | For brand-new posts and case studies (see below) and a one-time initial submission. |

**Why new items aren't auto-pinged:** `/blog/[slug]` and `/works/[slug]` use `dynamicParams = false`, so a newly published post returns 404 **until the next deploy**. Pinging a 404 would waste the notification. The flow for new content is therefore **publish → redeploy → submit**.

## What Daniel needs to do (one time)

1. **Generate a key.** Use 8–128 characters, letters, digits and hyphens only. For example, run this locally:
   ```bash
   node -e "console.log(require('crypto').randomUUID().replace(/-/g,''))"
   ```
   The key isn't a secret in the password sense, since it's publicly served, but don't reuse it elsewhere.
2. **Add it to Vercel.** Go to Project → Settings → Environment Variables and add `INDEXNOW_KEY` = the key, scope **Production** only.
3. **Redeploy** production.
4. **Verify the key file:** open `https://www.graphxify.com/indexnow-key.txt`. It must show exactly the key.
5. **Initial submission (once):**
   ```bash
   INDEXNOW_KEY=<key> npm run indexnow:submit -- --sitemap
   ```
   A response of `HTTP 200` or `202` means it was accepted.
6. **Bing Webmaster Tools:** add and verify the site (see DANIEL-EXTERNAL-SEO-CHECKLIST.md), then check **IndexNow** in the left menu to see received URLs.

## Ongoing use

- **Edited an existing published post or case study?** Nothing to do. The CMS pings automatically.
- **Published a new post or case study?** Redeploy, then run:
  ```bash
  INDEXNOW_KEY=<key> npm run indexnow:submit -- /blog/new-slug /blog
  ```
- **Don't** re-run `--sitemap` routinely. IndexNow is for changes, not periodic full resubmission.

## Troubleshooting

| Symptom | Cause |
|---|---|
| `/indexnow-key.txt` is 404 | `INDEXNOW_KEY` is not set for Production, or it's invalid (wrong characters or length). Redeploy after setting it. |
| Script says "Key file … does not serve this key yet" | The deployed key and the local `INDEXNOW_KEY` differ. |
| HTTP 403 | The key file isn't reachable or doesn't match. |
| HTTP 422 | A URL isn't on `www.graphxify.com`, or the host and key don't match. |
| HTTP 429 | Too many requests. Wait and retry. |
| Nothing logged on CMS save | Expected outside production, or when the item was a never-published draft. |
