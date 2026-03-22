import { MarketingHeader } from "@/components/marketing/header";
import { MarketingPerformanceEffects } from "@/components/motion/marketing-performance-effects";
import { PageTransition } from "@/components/motion/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { getCurrentProfile } from "@/lib/auth/requireRole";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile().catch(() => null);
  const cmsHref = profile ? "/dashboard" : null;

  return (
    <div className="relative min-h-screen noise-overlay">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <MarketingPerformanceEffects />
      <MarketingHeader cmsHref={cmsHref} />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
    </div>
  );
}
