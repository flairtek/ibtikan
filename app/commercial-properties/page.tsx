import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryListingPage } from "@/components/site/CategoryListingPage";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Commercial Properties in Ghana",
    description:
      "Commercial property opportunities in Ghana from Ibtikan Ibn Adams Properties Limited — office, retail and mixed-use spaces.",
    path: "/commercial-properties",
  });

export default function CommercialPropertiesPage() {
  return (
    <CategoryListingPage
      basePath="/commercial-properties"
      anchor="properties"
      category="commercial"
      heroTitle="Commercial Properties"
      heroLede="Office, retail and mixed-use opportunities for businesses and investors."
      image={media.towers}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Commercial Properties", path: "/commercial-properties" },
      ]}
      introTitle="Space to build a business"
      intro={[
        "Well-located commercial property supports enterprise — shops, offices, mixed-use development and income-producing assets.",
        "Commercial opportunities are included in our portfolio when the company can stand behind each detail: location, dimensions, condition and permitted use. This page lists what is currently available.",
      ]}
      listingTitle="Commercial listings"
      faq={[
        {
          q: "Do you lease commercial space as well as sell?",
          a: "Each listing states whether it is for sale or rental. Enquire about any specific space and we will confirm the terms available.",
        },
        {
          q: "Can you advise on commercial investment?",
          a: "We present the verified property facts and answer questions about our developments. For tax, legal or financial advice on a commercial purchase, please consult qualified professionals.",
        },
      ]}
      emptyState={{
        title: "Commercial listings are being prepared",
        text: "Commercial properties are published here as their information is verified. If you are looking for a specific kind of space, enquire and we will tell you what we can offer.",
        actions: [
          { label: "Enquire Now", href: "/enquire?type=property" },
          { label: "Contact Us", href: "/contact" },
        ],
      }}
    />
  );
}
