import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { MarketingFooter } from "@/components/marketing/footer";
import { ChunkLoadRecovery } from "@/components/runtime/chunk-load-recovery";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Agency",
  description:
    "Graphxify builds enterprise-grade marketing websites and CMS systems with performance, governance, and growth in mind.",
  path: "/"
});

const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";
const enableSpeedInsights = process.env.NEXT_PUBLIC_ENABLE_VERCEL_SPEED_INSIGHTS === "true";
const supabaseAssetOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : null;
  } catch {
    return null;
  }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {supabaseAssetOrigin ? <link rel="preconnect" href={supabaseAssetOrigin} crossOrigin="" /> : null}
        {supabaseAssetOrigin ? <link rel="dns-prefetch" href={supabaseAssetOrigin} /> : null}
      </head>
      <body suppressHydrationWarning className="app-shell min-h-screen bg-bg text-fg antialiased">

        <Providers>
          <ChunkLoadRecovery />
          {children}
          <MarketingFooter />
          {enableAnalytics ? <Analytics /> : null}
          {enableSpeedInsights ? <SpeedInsights /> : null}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border) / 0.18)",
                color: "hsl(var(--fg))"
              }
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
