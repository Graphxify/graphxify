import { MarketingHeader } from "@/components/marketing/header";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { ParallaxGrid } from "@/components/motion/parallax-grid";
import { PageTransition } from "@/components/motion/page-transition";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen noise-overlay">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <ScrollProgress />
      <ParallaxGrid />
      <CursorGlow />
      <ContentRefreshListener pathPrefixes={["/works", "/blog"]} />
      <MarketingHeader showCms={Boolean(user)} />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
    </div>
  );
}
