import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// Private / non-content routes. Mirrors NOINDEX_PATHS in next.config.ts, which
// also sends an X-Robots-Tag: noindex header for these paths.
const PRIVATE_PATHS = [
  "/dashboard", // CMS admin panel
  "/admin", // Admin login utilities
  "/api", // API endpoints (not indexable content)
  "/auth", // Login / auth flow pages
  "/newsletter", // Newsletter unsubscribe flow
  "/reset-password" // Password reset flow
];

// Search and user-retrieval agents that are explicitly welcome on public
// content. Every token is taken from the vendor's own first-party docs,
// re-verified 2026-09-29 (sources in docs/AI-CRAWLER-VERIFICATION.md). A crawler
// that matches a named group ignores the `*` group entirely, so this group
// repeats the private disallows.
//
// This list is deliberately limited to SEARCH / USER-REQUESTED fetchers. Model
// training crawlers are a separate business decision: the two existing training
// opt-outs below (GPTBot, Google-Extended) are preserved unchanged, and no new
// training policy (e.g. for ClaudeBot) is introduced here.
const SEARCH_AND_RETRIEVAL_AGENTS = [
  "OAI-SearchBot", // The crawler that governs ChatGPT search inclusion (developers.openai.com/api/docs/bots)
  "ChatGPT-User", // User-initiated fetches only; OpenAI: not used to decide Search inclusion, robots.txt "may not apply"
  "Claude-SearchBot", // Claude search indexing (support.claude.com/en/articles/8896518)
  "Claude-User", // Claude user-initiated fetches; Anthropic says it honors robots.txt
  "PerplexityBot", // Perplexity search indexing (docs.perplexity.ai/guides/bots)
  "Perplexity-User" // Perplexity user-initiated fetches; same first-party doc, "generally ignores robots.txt"
];

export default function robots(): MetadataRoute.Robots {
  // Vercel preview deployments must never be crawled; next.config.ts also sends
  // a noindex header there. Production (VERCEL_ENV=production) and local builds
  // fall through to the real policy.
  if (process.env.VERCEL_ENV === "preview") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        // Standard crawlers (Googlebot, Bingbot, …) — allow all public pages, block private routes
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS
      },
      {
        userAgent: SEARCH_AND_RETRIEVAL_AGENTS,
        allow: "/",
        disallow: PRIVATE_PATHS
      },
      {
        // Existing policy (unchanged): opt out of OpenAI foundation-model training.
        // Separate from OAI-SearchBot, which governs ChatGPT search.
        userAgent: "GPTBot",
        disallow: "/"
      },
      {
        // Existing policy (unchanged): opt out of Gemini training / grounding.
        // Google: "Google-Extended does not impact a site's inclusion in Google
        // Search nor is it used as a ranking signal in Google Search."
        userAgent: "Google-Extended",
        disallow: "/"
      }
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
