import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { MarketingFooter } from "@/components/marketing/footer";
import { ChunkLoadRecovery } from "@/components/runtime/chunk-load-recovery";

import { siteConfig } from "@/lib/constants";

// Site-wide defaults only. Deliberately NO `alternates.canonical` here: a
// canonical set in the root layout is inherited by every route that does not
// override it (404s, dashboard, auth pages), which pointed them all at "/".
// Each public page sets its own self-referencing canonical via buildMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `Web Design & Development Agency | ${siteConfig.name}`,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name
  }
};

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
