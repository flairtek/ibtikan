import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryListingPage } from "@/components/site/CategoryListingPage";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Residential Properties in Ghana",
    description:
      "Residential properties for sale and rent in Ghana from Ibtikan Ibn Adams Properties Limited — homes for families, first-time buyers and investors.",
    path: "/residential-properties",
  });

export default function ResidentialPropertiesPage() {
  return (
    <CategoryListingPage
      basePath="/residential-properties"
      anchor="properties"
      category="residential"
      heroTitle="Residential Properties"
      heroLede="Homes for families, first-time buyers and long-term owners across Ghana."
      image={media.houseLawn}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Residential Properties", path: "/residential-properties" },
      ]}
      introTitle="A home is the beginning of everything"
      intro={[
        "Residential property is the most personal asset we help people find — a place where families can put down roots, and where long-term value can be preserved.",
        "Homes published here carry verified information from the company about location, size, features and availability. Each listing links to its own detail page with a dedicated enquiry form.",
      ]}
      listingTitle="Available residential properties"
      sections={[
        {
          title: "What our listings include",
          bullets: [
            "Location and region information",
            "Bedrooms, bathrooms and building area where applicable",
            "Key features and finishes where confirmed",
            "Availability status — available, coming soon, reserved or under construction",
            "Gallery images and a direct enquiry route",
          ],
        },
      ]}
      faq={[
        {
          q: "Do you sell to first-time buyers?",
          a: "Yes. Tell us your goals and budget in an enquiry and our team will present suitable options and the practical steps involved.",
        },
        {
          q: "Can I arrange a viewing?",
          a: "Enquire through any property listing and our team will arrange a mutually convenient site visit.",
        },
        {
          q: "Are payment plans available?",
          a: "Payment arrangements differ per property. Enquire about a specific home and we will confirm what the company can offer.",
        },
      ]}
      emptyState={{
        title: "Residential listings are being prepared",
        text: "Homes are published here as verification completes. Enquire with your preferred location, size and budget and we will respond with the closest options.",
        actions: [
          { label: "Enquire Now", href: "/enquire?type=property" },
          { label: "Contact Us", href: "/contact" },
        ],
      }}
    />
  );
}
