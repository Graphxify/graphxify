import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "cajxvhcrfgpyyqohlkfp.supabase.co";

const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
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
