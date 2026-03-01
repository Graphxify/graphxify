import { caseStudies, featuredWorks } from "@/lib/marketing-content";
import { journalPosts } from "@/lib/journal-content";

export const demoWorks = featuredWorks.map((item, index) => {
  const matchingCase = caseStudies.find((study) => study.slug === item.slug);
  return {
    id: `w${index + 1}`,
    title: item.title,
    slug: item.slug,
    year: 2024 + index,
    role: "Founder-led delivery",
    services: item.tags,
    excerpt: item.description,
    content: matchingCase?.intro ?? item.description,
    cover_image_url: `/assets/work-${index + 1}.svg`,
    created_at: `2026-0${index + 1}-15`
  };
});

export const demoPosts = journalPosts;
