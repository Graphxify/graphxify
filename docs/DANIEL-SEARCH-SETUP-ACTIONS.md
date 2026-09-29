# Search-platform setup: actions for Daniel

These steps need **your** Google or Microsoft login, so nobody else can do them for you. **Never paste passwords, 2FA codes, API keys or access tokens into chat, code or docs.** Nothing below requires that. Everything Claude needs afterwards is a non-secret ID or a screenshot or summary of what you see.

Status key: **TODO** · **DONE** · **OPTIONAL**

---

## 1. Confirm Search Console access to the Domain property

**ACTION:** Confirm you're an **Owner** of the Domain property `graphxify.com`.
**PLATFORM:** Google Search Console
**EXACT STEPS:**
1. Open https://search.google.com/search-console and sign in with the Google account that should own Graphxify's search data.
2. Open the property picker (top left). Look for **`graphxify.com`** with the globe icon. That's the *Domain property*, `sc-domain:graphxify.com`.
3. **If it's listed:** go to **Settings → Users and permissions** and check that your account shows **Owner**. Done.
4. **If it's not listed:** DNS already contains two `google-site-verification` TXT records, so someone has verified this domain before. Either:
   - ask whoever verified it to add you: **Settings → Users and permissions → Add user → Owner**; or
   - click **Add property → Domain → `graphxify.com`**. Google shows a new TXT value. Add it in **Vercel → Domains → graphxify.com → DNS Records → Add → Type TXT, Name `@`**, then click **Verify**. Leave the existing TXT records in place.

**WHY:** a Domain property covers `www`, apex, `http` and `https` in one place, and it's needed for every step below.
**WHAT CLAUDE NEEDS AFTERWARD:** only a note saying "owner confirmed". If you created a new TXT record, say so, so the DNS inventory stays accurate.
**STATUS:** TODO

## 2. Submit the sitemap

**ACTION:** Submit the XML sitemap.
**PLATFORM:** Google Search Console → property `graphxify.com`
**EXACT STEPS:**
1. In the left menu, go to **Indexing → Sitemaps**.
2. Under "Add a new sitemap", enter `https://www.graphxify.com/sitemap.xml` and click **Submit**.
3. Refresh after a few minutes. Status should read **Success**, with **26** discovered pages.

**WHY:** it tells Google which 26 URLs are canonical and when each last changed.
**WHAT CLAUDE NEEDS AFTERWARD:** the status and the discovered-pages count.
**STATUS:** TODO

## 3. Inspect the key pages

**ACTION:** Run URL Inspection on the priority pages and request indexing.
**PLATFORM:** Google Search Console
**EXACT STEPS:** for each URL below, paste it into the search bar at the top, press Enter, then:
1. Note **"URL is on Google"** or **"URL is not on Google"**, and the **Google-selected canonical**.
2. Click **Test live URL**, then **View tested page → HTML**. Confirm the page text is there.
3. If it isn't indexed, click **Request indexing**. There's a daily quota of roughly 10, so spread them over a few days if needed.

- `https://www.graphxify.com/`
- `https://www.graphxify.com/services/web-design`
- `https://www.graphxify.com/services/web-development`
- `https://www.graphxify.com/works`
- `https://www.graphxify.com/works/flyup-line`
- `https://www.graphxify.com/works/maven`
- `https://www.graphxify.com/works/boss-medical-clinic`
- `https://www.graphxify.com/blog/how-to-choose-a-web-design-agency`
- `https://www.graphxify.com/about`
- `https://www.graphxify.com/contact`

**WHY:** it confirms that Google sees the server-rendered content and self-canonicals that production verification found.
**WHAT CLAUDE NEEDS AFTERWARD:** per URL, the indexed status and the Google-selected canonical. A copy-paste or screenshots are fine. This fills [SEARCH-CONSOLE-BASELINE.md](SEARCH-CONSOLE-BASELINE.md).
**STATUS:** TODO

## 4. Record the Search Console baseline

**ACTION:** Capture the starting numbers.
**PLATFORM:** Google Search Console
**EXACT STEPS:**
1. Go to **Performance → Search results**. Set the date range to **Last 3 months**, then **Export → Download CSV**.
2. Go to **Indexing → Pages** and note the **Indexed** and **Not indexed** counts, plus the top "Why pages aren't indexed" reasons.
3. Go to **Experience → Core Web Vitals** and note whether there's enough data.

**WHY:** future changes can only be judged against a real starting point.
**WHAT CLAUDE NEEDS AFTERWARD:** the CSV files, or the totals (clicks, impressions, CTR, position) and the index counts.
**STATUS:** TODO

## 5. Add the site to Bing Webmaster Tools

**ACTION:** Create and verify the Bing site, and submit the sitemap.
**PLATFORM:** Bing Webmaster Tools
**EXACT STEPS:**
1. Open https://www.bing.com/webmasters and sign in with a Microsoft account.
2. Choose **Import your sites from GSC**, and authorise it with the Google account from step 1. It imports `graphxify.com`, **verifies it automatically** and pulls in the sitemap. This is the easiest route.
   - Alternative: **Add site manually** → `https://www.graphxify.com` → choose **CNAME** verification. Add the CNAME Bing shows in **Vercel → Domains → graphxify.com → DNS Records**. It's a DNS value, not a secret, so you can also send it to Claude to add.
3. Go to **Sitemaps → Submit sitemap** → `https://www.graphxify.com/sitemap.xml` (skip this if the import already added it).
4. After Claude's IndexNow submission, open **IndexNow** in the left menu. It should list the submitted URLs within about 24 h.

**WHY:** Bing powers Bing search, Copilot and DuckDuckGo results, and it shows IndexNow receipts.
**WHAT CLAUDE NEEDS AFTERWARD:** "verified", plus a screenshot or count from the IndexNow page.
**STATUS:** TODO

## 6. Decide on analytics consent and update the privacy policy

**ACTION:** Decide whether GA4 needs a consent banner, and update `/privacy`.
**PLATFORM:** Business decision + the website
**EXACT STEPS:**
1. Read the "Privacy and consent" section of [GA4-SETUP.md](GA4-SETUP.md).
2. Decide: **notice only** (update `/privacy`), or **opt-in consent** (needs a consent banner before GA4 goes live, which is a separate code change).
3. Send Claude the privacy wording you approve, or ask Claude to draft it for your review.

**WHY:** GA4 sets cookies. The current policy only describes privacy-friendly analytics.
**WHAT CLAUDE NEEDS AFTERWARD:** your decision (notice or opt-in).
**STATUS:** TODO. Do this **before** step 7 goes live.

## 7. Find or create the GA4 property and get its Measurement ID

**ACTION:** Get the Measurement ID for `www.graphxify.com`. **Don't create a duplicate** if a property already exists.
**PLATFORM:** Google Analytics
**EXACT STEPS:**
1. Open https://analytics.google.com. Click **Admin** (the gear, bottom left), then the **account/property picker** at the top. Look for any existing property for Graphxify.
2. **If one exists:** go to **Admin → Data collection and modification → Data streams**. Open the **Web** stream for `https://www.graphxify.com` (or create a Web stream in that property if there isn't one), and copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. **If none exists:** go to **Admin → Create → Property**. Set the name to `Graphxify`, the reporting time zone to your own, and the currency to CAD. Add a **Web** stream with URL `https://www.graphxify.com` and name `Graphxify website`, then copy the Measurement ID.
4. In the stream, go to **Enhanced measurement** and confirm **Page views → Advanced → "Page changes based on browser history events"** is **on**.
5. Add it to Vercel: **Project → Settings → Environment Variables → Add**. Set the key to `NEXT_PUBLIC_GA_MEASUREMENT_ID`, the value to the `G-` ID, and **Environment: Production only**. Save, then **redeploy**. Alternatively, send the `G-` ID to Claude, since it's public (it appears in the page source), and Claude will add it.

**WHY:** the site code is ready and loads GA4 only when this ID is present.
**WHAT CLAUDE NEEDS AFTERWARD:** the `G-` Measurement ID (it's not a secret) or confirmation that you added it. Claude then verifies there are no duplicate page views and that events arrive in DebugView.
**STATUS:** TODO

## 8. Configure GA4 conversions and reports

**ACTION:** Mark the key event, then add the custom dimensions and the AI channel.
**PLATFORM:** Google Analytics
**EXACT STEPS:** (events appear about 24 h after their first occurrence)
1. Go to **Admin → Data display → Events**. Toggle **Mark as key event** on **`project_inquiry`** only.
2. Go to **Admin → Data display → Custom definitions → Create custom dimension** (scope: Event), once each for `form`, `cta_location`, `cta_text`, `link_location`, `project`, `link_domain`, `ai_referral` and `landing_page`.
3. Create the **Known AI referral traffic** channel group exactly as described in [AI-REFERRAL-MEASUREMENT.md](AI-REFERRAL-MEASUREMENT.md).
4. Go to **Admin → Product links → Search Console links → Link**, and choose the `graphxify.com` property from step 1.

**WHY:** one key event per real inquiry, and attribution you can report on.
**WHAT CLAUDE NEEDS AFTERWARD:** confirmation, or screenshots.
**STATUS:** TODO (after step 7)

## 9. Upload a landscape share image for B.O.S.S. Medical Clinic

**ACTION:** Give the case study a proper 1200×630 social image.
**PLATFORM:** Graphxify dashboard (CMS)
**EXACT STEPS:**
1. Export a real **1200×630 px** image (JPG or PNG, under about 500 KB) from the actual project. **Use only genuine project artwork.**
2. Upload it through the dashboard's media upload for **Works → B.O.S.S. Medical Clinic**, then paste its URL into the **OG image URL** field and fill in **OG image alt text**. Save.

**WHY:** the current share image is the square cover (1254×1254), which social platforms crop to 1.91:1.
**WHAT CLAUDE NEEDS AFTERWARD:** a note once it's saved. Claude will re-fetch it and confirm its size and status.
**STATUS:** OPTIONAL

## 10. Revoke the access tokens shared in chat

**ACTION:** Revoke the GitHub, Vercel and Supabase tokens pasted into this conversation, once the work is finished.
**PLATFORM:** GitHub, Vercel, Supabase
**EXACT STEPS:**
1. **GitHub:** go to **Settings → Developer settings → Personal access tokens → Fine-grained tokens**, find the token and click **Delete**.
2. **Vercel:** go to **Account Settings → Tokens** and delete the token.
3. **Supabase:** go to **Account → Access Tokens** and revoke the token.
4. For future automation, use a GitHub App or Vercel integration, or scoped tokens stored as secrets, rather than pasting tokens into chat.

**WHY:** tokens pasted into a chat transcript should be treated as exposed.
**WHAT CLAUDE NEEDS AFTERWARD:** nothing.
**STATUS:** TODO, as soon as this deployment is verified

## 11. Optional: Speed Insights and Vercel custom events

**ACTION:** Decide whether to turn on real-user performance data.
**PLATFORM:** Vercel
**EXACT STEPS:**
1. **Project → Speed Insights → Enable.** It's currently disabled at the project level. Then add `NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS=true` (Production) and redeploy.
2. Check **Team → Settings → Billing** to confirm your plan includes Web Analytics **custom events**. Otherwise Vercel will show page views but not `contact_form_submit`. GA4 records the events either way.

**WHY:** field Core Web Vitals settle the homepage lab-score variance.
**WHAT CLAUDE NEEDS AFTERWARD:** your decision.
**STATUS:** OPTIONAL
