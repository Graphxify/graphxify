import type { Metadata } from "next";
import { ReviewForm } from "@/components/marketing/review-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Leave a Review",
  description:
    "Share your experience working with Graphxify. Your testimonial helps us grow and improve.",
  path: "/review",
  image: "/images/about/about-graphxify-visual.png",
  ogTitle: "Leave a Review — Share Your Graphxify Experience",
  ogDescription: "Worked with Graphxify? Share your experience and help other Canadian businesses discover what's possible with great design.",
  ogImageAlt: "Leave a review for Graphxify — web design and branding studio",
  twitterCard: "summary"
});

export default function ReviewPage(): JSX.Element {
  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col justify-center px-4 py-20 sm:px-6">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(0,163,255,0.06) 0%, transparent 70%)"
        }}
      />

      <div className="space-y-2 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-fg/48">
          Client Feedback
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Leave a Review
        </h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-fg/56">
          We'd love to hear about your experience. Your review will be reviewed
          before appearing on our site.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border/12 bg-card/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-md sm:p-7">
        <ReviewForm />
      </div>
    </section>
  );
}
