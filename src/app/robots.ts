import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Standard crawlers — allow all public pages, block private routes
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",     // CMS admin panel
          "/admin",         // Admin utilities
          "/api",           // API endpoints (not indexable content)
          "/auth",          // Login / auth flow pages
          "/newsletter",    // Internal newsletter routes
          "/reset-password", // Password reset flow
        ],
      },
      {
        // Block GPTBot (OpenAI) from training on site content
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        // Block Google-Extended (Gemini training data)
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
