import { MarketingHeader } from "@/components/marketing/header";
import { MarketingPerformanceEffects } from "@/components/motion/marketing-performance-effects";
import { PageTransition } from "@/components/motion/page-transition";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen noise-overlay">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <MarketingPerformanceEffects />
      <ContentRefreshListener pathPrefixes={["/works", "/blog"]} />
      <MarketingHeader />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
    </div>
  );
}
