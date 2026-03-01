/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "cajxvhcrfgpyyqohlkfp.supabase.co";

const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_DOMAINS || "")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/**" },
      ...extraImageHosts.map((hostname) => ({ protocol: "https", hostname, pathname: "/**" }))
    ]
  },
  reactStrictMode: true
};

export default nextConfig;
