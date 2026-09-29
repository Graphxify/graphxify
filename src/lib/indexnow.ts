import "server-only";

import { after } from "next/server";
import { siteConfig } from "@/lib/constants";
import { logger } from "@/lib/logger";

/**
 * IndexNow (https://www.indexnow.org) — tells participating search engines
 * (Bing, Yandex, Seznam, Naver, …) that specific URLs were created, meaningfully
 * updated or deleted. Google does not use IndexNow.
 *
 * Inert until configured. Requires:
 *   INDEXNOW_KEY  8–128 chars of [a-zA-Z0-9-]. Served at /indexnow-key.txt.
 * Only submits from the production deployment (VERCEL_ENV=production) unless
 * INDEXNOW_FORCE=true, so local dev and preview deployments never ping.
 * See docs/INDEXNOW-SETUP.md.
 */

const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;
const MAX_URLS_PER_REQUEST = 10_000;

export function getIndexNowKey(): string | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && KEY_PATTERN.test(key) ? key : null;
}

export const INDEXNOW_KEY_PATH = "/indexnow-key.txt";

function isSubmissionEnabled(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.INDEXNOW_FORCE === "true";
}

/** Absolute, same-host URLs only (IndexNow rejects URLs for other hosts). */
function normalizeUrls(pathsOrUrls: string[]): string[] {
  const site = new URL(siteConfig.url);
  const urls = new Set<string>();
  for (const value of pathsOrUrls) {
    try {
      const url = new URL(value, `${siteConfig.url}/`);
      if (url.host === site.host) {
        url.hash = "";
        urls.add(url.toString());
      }
    } catch {
      // ignore malformed input
    }
  }
  return Array.from(urls);
}

/**
 * Submits URLs to IndexNow. Never throws: failures are logged and swallowed so
 * a search-engine outage can never break a CMS save.
 */
export async function submitToIndexNow(pathsOrUrls: string[]): Promise<{ submitted: number; skipped?: string }> {
  const key = getIndexNowKey();
  if (!key) return { submitted: 0, skipped: "INDEXNOW_KEY not configured" };
  if (!isSubmissionEnabled()) return { submitted: 0, skipped: "not a production deployment" };

  const urlList = normalizeUrls(pathsOrUrls).slice(0, MAX_URLS_PER_REQUEST);
  if (urlList.length === 0) return { submitted: 0, skipped: "no eligible URLs" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteConfig.url).host,
        key,
        keyLocation: `${siteConfig.url}${INDEXNOW_KEY_PATH}`,
        urlList
      }),
      signal: controller.signal
    });
    // 200 = accepted, 202 = accepted / key validation pending.
    if (response.status !== 200 && response.status !== 202) {
      logger.error("IndexNow submission rejected", { status: response.status, count: urlList.length });
      return { submitted: 0, skipped: `HTTP ${response.status}` };
    }
    return { submitted: urlList.length };
  } catch (error) {
    logger.error("IndexNow submission failed", { reason: error instanceof Error ? error.message : String(error) });
    return { submitted: 0, skipped: "request failed" };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Schedules a submission to run after the response is sent (so CMS saves stay
 * fast). Falls back to a detached promise outside a request scope.
 */
export function queueIndexNowSubmission(pathsOrUrls: string[]): void {
  if (!getIndexNowKey()) return;
  const task = () => submitToIndexNow(pathsOrUrls).then(() => undefined);
  try {
    after(task);
  } catch {
    void task();
  }
}
