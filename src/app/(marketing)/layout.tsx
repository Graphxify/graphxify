import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingHeader } from "@/components/marketing/header";
import { PageTransition } from "@/components/motion/page-transition";
import { ContentRefreshListener } from "@/components/realtime/content-refresh-listener";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="relative min-h-screen noise-overlay">
      <ScrollProgress />
      <ContentRefreshListener pathPrefixes={["/works", "/blog"]} />
      <MarketingHeader showCms={Boolean(user)} />
      <PageTransition>
        <main className="relative z-10">{children}</main>
      </PageTransition>
      <MarketingFooter />
    </div>
  );
}
