import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "cajxvhcrfgpyyqohlkfp.supabase.co";

const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

// Private routes that should never be indexed by search engines.
// The X-Robots-Tag header is the server-authoritative way to enforce this —
// it works even when crawlers ignore <meta> tags or the robots.txt disallow.
const NOINDEX_PATHS = [
  "/dashboard/:path*",
  "/admin/:path*",
  "/api/:path*",
  "/auth/:path*",
  "/newsletter/:path*",
  "/reset-password/:path*",
];

const NOINDEX_HEADER = {
  key: "X-Robots-Tag",
  value: "noindex, nofollow, noarchive",
};

// Blog posts originally published for a Canada-only audience. The copy was
// rewritten for a worldwide audience but the slugs still read "-canada", which
// contradicted the positioning. Slugs were migrated in Supabase; these pairs
// keep the old URLs alive as permanent redirects.
const LEGACY_BLOG_SLUG_REDIRECTS: ReadonlyArray<readonly [string, string]> = [
  ["how-to-choose-web-design-agency-canada", "how-to-choose-a-web-design-agency"],
  ["mobile-first-website-canadian-small-businesses-2026", "mobile-first-website-small-businesses"],
  ["brand-identity-canadian-businesses", "what-makes-a-strong-brand-identity"],
  ["custom-web-development-vs-wordpress-canada", "custom-web-development-vs-wordpress"],
  ["professional-website-business-growth-canada", "professional-website-business-growth"],
  ["local-seo-canadian-businesses-getting-found-google", "local-seo-getting-found-on-google"],
];

// Baseline hardening headers applied to every response. These are safe defaults
// that do not affect rendering. A Content-Security-Policy is deliberately left
// out here because it needs per-app tuning (Next inline scripts, framer-motion,
// analytics) — add it separately once the allowed sources are enumerated.
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...NOINDEX_PATHS.map((source) => ({
        source,
        headers: [NOINDEX_HEADER],
      })),
    ];
  },
  async redirects() {
    return [
      // Duplicate homepage variant indexed by Google
      { source: "/index", destination: "/", permanent: true },
      // Old singular path → correct plural
      { source: "/work", destination: "/works", permanent: true },
      // Legacy flat project URLs → correct /works/[slug] structure
      { source: "/flyupline", destination: "/works/flyup-line", permanent: true },
      { source: "/mbmdesigns", destination: "/works", permanent: true },
      // Legacy case-study path. `legacySlugToCanonicalSlug` in
      // project-card-content.ts maps this alias internally, but the /works/[slug]
      // route now returns a real 404 for unknown slugs, so the alias needs an
      // actual redirect to stay reachable.
      { source: "/works/boss-raam-pharmacy", destination: "/works/boss-medical-clinic", permanent: true },
      // /pricing was published briefly and indexed; the page has since been
      // removed along with all published figures. Redirect rather than 404.
      { source: "/pricing", destination: "/services", permanent: true },
      // Canada-legacy blog slugs → global slugs. The posts were rewritten to a
      // worldwide audience but their URLs still said Canada; these 301s preserve
      // whatever ranking history the old URLs earned. Do not remove.
      ...LEGACY_BLOG_SLUG_REDIRECTS.map(([from, to]) => ({
        source: `/blog/${from}`,
        destination: `/blog/${to}`,
        permanent: true,
      })),
    ];
  },
  images: {
    qualities: [75],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    localPatterns: [
      {
        pathname: "/**"
      }
    ],
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/**" },
      ...extraImageHosts.map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" }))
    ]
  },
  reactStrictMode: true,
  experimental: {
    // Next.js 15 sets staleTimes.dynamic = 0 by default, which means dynamically-
    // rendered pages are never cached client-side. Set to 30s so the Router Cache
    // holds RSC payloads after first navigation, making back/forward and repeat
    // visits to the same page instant within a 30-second window.
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    // Tree-shake barrel exports — eliminates unused icons/components from bundle
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "@radix-ui/react-slot",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
    ],
  },
};

export default nextConfig;
