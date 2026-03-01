import { HomeSections } from "@/components/marketing/home-sections";
import { demoWorks } from "@/lib/demo-content";
import { getPublishedWorks } from "@/db/queries/works";

export default async function HomePage() {
  let works = demoWorks;
  try {
    const dbWorks = await getPublishedWorks();
    if (dbWorks.length > 0) {
      works = dbWorks;
    }
  } catch {
    // Degraded mode fallback.
  }

  return <HomeSections works={works} />;
}
