import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { MarketingFooter } from "@/components/marketing/footer";
import { ChunkLoadRecovery } from "@/components/runtime/chunk-load-recovery";

import { buildMetadata } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = buildMetadata({
  title: "Web Design & Branding Agency",
  description:
    "Graphxify builds enterprise-grade marketing websites and CMS systems with performance, governance, and growth in mind.",
  path: "/"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${poppins.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="app-shell min-h-screen bg-bg text-fg antialiased">

        <Providers>
          <ChunkLoadRecovery />
          {children}
          <MarketingFooter />
          <Analytics />
          <SpeedInsights />
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
