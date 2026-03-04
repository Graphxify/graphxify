import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { MarketingFooter } from "@/components/marketing/footer";
import { ChunkLoadRecovery } from "@/components/runtime/chunk-load-recovery";
import { SmoothScrollDriver } from "@/components/motion/smooth-scroll-driver";
import { buildMetadata } from "@/lib/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = buildMetadata({
  title: "Premium Agency Platform",
  description:
    "Graphxify builds enterprise-grade marketing websites and CMS systems with performance, governance, and growth in mind.",
  path: "/"
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} light`} suppressHydrationWarning>
      <body className="app-shell min-h-screen bg-bg text-fg antialiased">
        <SmoothScrollDriver />
        <Providers>
          <ChunkLoadRecovery />
          {children}
          <MarketingFooter />
        </Providers>
      </body>
    </html>
  );
}
