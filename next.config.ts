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

const nextConfig: NextConfig = {
  async headers() {
    return NOINDEX_PATHS.map((source) => ({
      source,
      headers: [NOINDEX_HEADER],
    }));
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
