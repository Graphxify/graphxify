import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { ReviewForm } from "@/components/marketing/review-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Leave a Review",
    description:
      "Share your experience working with Graphxify. Your testimonial helps us grow and improve.",
    path: "/review",
    ogTitle: "Leave a Review — Share Your Graphxify Experience",
    ogDescription: "Worked with Graphxify? Share your experience and help other businesses discover what's possible with great design.",
    ogImageAlt: "Leave a review for Graphxify — web design and branding studio",
    twitterCard: "summary"
  }),
  // Utility page: a bare form with no standalone search value, and it is
  // intentionally absent from the sitemap. Keep it crawlable for clients who
  // receive the link directly, but out of the index.
  robots: { index: false, follow: true }
};

export default function ReviewPage(): JSX.Element {
  return (
    <>
      <PageHero
        label="Client feedback"
        title={
          <>
            Leave a <span className="text-accentB">review</span>
          </>
        }
        lead="We'd love to hear about your experience. Your review will be reviewed before appearing on our site."
        className="md:pb-14"
      />
      <section aria-label="Review form" className="container pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 sm:p-10 md:p-12">
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
