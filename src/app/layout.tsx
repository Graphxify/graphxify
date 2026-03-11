import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/app/providers";
import { MarketingFooter } from "@/components/marketing/footer";
import { ChunkLoadRecovery } from "@/components/runtime/chunk-load-recovery";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Premium Agency Platform",
  description:
    "Graphxify builds enterprise-grade marketing websites and CMS systems with performance, governance, and growth in mind.",
  path: "/"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="app-shell min-h-screen bg-bg text-fg antialiased">

        <Providers>
          <ChunkLoadRecovery />
          {children}
          <MarketingFooter />
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
