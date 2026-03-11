import { MarketingHeader } from "@/components/marketing/header";
import { DeferredEffects } from "@/components/motion/deferred-effects";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { PageTransition } from "@/components/motion/page-transition";
import { SmoothScrollDriver } from "@/components/motion/smooth-scroll-driver";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen noise-overlay">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <SmoothScrollDriver />
      <ScrollProgress />
      <DeferredEffects />
      <CursorGlow />
      <ContentRefreshListener pathPrefixes={["/works", "/blog"]} />
      <MarketingHeader />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
    </div>
  );
}
