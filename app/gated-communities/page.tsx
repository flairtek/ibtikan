import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryListingPage } from "@/components/site/CategoryListingPage";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Gated Communities in Ghana",
    description:
      "Gated community living in Ghana — planned neighbourhoods from Ibtikan Ibn Adams Properties Limited.",
    path: "/gated-communities",
  });

export default function GatedCommunitiesPage() {
  return (
    <CategoryListingPage
      basePath="/gated-communities"
      anchor="properties"
      category="gated-community"
      heroTitle="Gated Communities"
      heroLede="Neighbourhoods designed around planning, security of tenure information and shared community life."
      image={media.housePool}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Gated Communities", path: "/gated-communities" },
      ]}
      introTitle="Planned neighbourhood living"
      intro={[
        "A well-planned community is more than a collection of houses — it is layout, access, green space and a sense of belonging.",
        "The company's gated-community work focuses on developments planned as a whole. Each published listing or project page describes exactly what is confirmed for that development; we do not imply that a feature exists in a specific community until it has been verified for that community.",
      ]}
      listingTitle="Community properties"
      sections={[
        {
          title: "Community-focused design themes",
          bullets: [
            "Layouts that respect access, drainage and open space",
            "Homes arranged around usable shared areas",
            "Clear documentation of what each community includes",
            "Long-term relationship with homeowners",
          ],
        },
      ]}
      faq={[
        {
          q: "What features does a specific community include?",
          a: "Each listing or project page states exactly what is confirmed. If something is important to you — for example infrastructure or utilities — ask us directly about that development before committing.",
        },
        {
          q: "Can homes in a gated community be customised?",
          a: "Where a development is under way with configurable phases, we can discuss finishes and layouts that the development plan permits. Enquire to explore.",
        },
      ]}
      emptyState={{
        title: "Community properties are being prepared",
        text: "Properties within the company's community developments are published here as they complete verification. Register your interest to hear first.",
        actions: [
          { label: "Enquire Now", href: "/enquire?type=property" },
          { label: "View Projects", href: "/projects" },
        ],
      }}
    />
  );
}
