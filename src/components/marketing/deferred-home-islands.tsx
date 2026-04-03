"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

type TestimonialCard = {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string | null;
  rating?: number;
};

type TestimonialMetricCard = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

const TestimonialsSection = dynamic(
  () => import("@/components/marketing/testimonials-section").then((mod) => mod.TestimonialsSection),
  {
    ssr: false,
    loading: () => <div className="h-[18rem] rounded-2xl border border-border/16 bg-card/40" />
  }
);

const LeadForm = dynamic(
  () => import("@/components/marketing/lead-form").then((mod) => mod.LeadForm),
  {
    ssr: false,
    loading: () => <div className="h-48 rounded-2xl border border-border/16 bg-card/40" />
  }
);

function useDeferredMount(rootMargin = "280px 0px") {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shouldRender) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return [ref, shouldRender] as const;
}

export function DeferredTestimonialsSection({
  items,
  metrics,
  showLeadText = false
}: {
  items: TestimonialCard[];
  metrics: TestimonialMetricCard[];
  showLeadText?: boolean;
}): JSX.Element {
  const [ref, shouldRender] = useDeferredMount();

  return (
    <div ref={ref}>
      {shouldRender ? (
        <TestimonialsSection items={items} metrics={metrics} showLeadText={showLeadText} />
      ) : (
        <div className="h-[18rem] rounded-2xl border border-border/16 bg-card/40" />
      )}
    </div>
  );
}

export function DeferredLeadForm(): JSX.Element {
  const [ref, shouldRender] = useDeferredMount();

  return <div ref={ref}>{shouldRender ? <LeadForm /> : <div className="h-48 rounded-2xl border border-border/16 bg-card/40" />}</div>;
}
