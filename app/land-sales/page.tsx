import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CategoryListingPage } from "@/components/site/CategoryListingPage";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Land for Sale in Ghana",
    description:
      "Land for sale in Ghana from Ibtikan Ibn Adams Properties Limited. Explore available plots, sizes and locations, with buyer due-diligence guidance.",
    path: "/land-sales",
  });

export default function LandSalesPage() {
  return (
    <CategoryListingPage
      basePath="/land-sales"
      anchor="properties"
      category="land"
      heroTitle="Land for Sale"
      heroLede="Verified land opportunities across Ghana, presented with the information buyers need."
      image={media.openLand}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Land for Sale", path: "/land-sales" },
      ]}
      introTitle="Buying land in Ghana, the careful way"
      intro={[
        "Land remains one of Ghana's most sought-after property assets — whether you are planning to build a family home, develop housing, or hold investment property.",
        "Ibtikan Ibn Adams Properties Limited offers land opportunities that are published to this page only after the company has completed its own checks and prepared clear information about location and size.",
      ]}
      listingTitle="Available land listings"
      sections={[
        {
          title: "Buyer due-diligence guidance",
          bullets: [
            "Engage a licensed lawyer to conduct an independent search of the land title at the relevant registry and Lands Commission.",
            "Inspect the land site and confirm its boundaries and access.",
            "Confirm the seller's authority to sell, and request and verify all original documents.",
            "Understand which stamps, consents and registration steps apply to your transaction.",
          ],
        },
      ]}
      faq={[
        {
          q: "Do all plots shown here have verified title?",
          a: "Every listing is published after the company's internal review. However, you should always commission your own independent legal search and due diligence before purchase; company information does not replace your lawyer's verification.",
        },
        {
          q: "Can land be purchased in smaller sizes than shown?",
          a: "The size shown on each listing is what is currently available. Ask us directly if you have a specific size or budget in mind and we will advise on the closest match.",
        },
        {
          q: "Can I buy land while living abroad?",
          a: "Yes — see our Diaspora Investment page for how overseas buyers can enquire and what information to verify before committing.",
        },
        {
          q: "Which locations do you cover?",
          a: "Company-offered land is concentrated where it holds genuine, current interest. Where a specific location matters to you, enquire and our team will confirm what is available.",
        },
      ]}
      emptyState={{
        title: "Land listings are being verified",
        text: "Plots are published to this page as soon as their information is confirmed. Send an enquiry to register your interest — location, size and budget — and we will respond with options.",
        actions: [
          { label: "Enquire About Land", href: "/enquire?type=property" },
          { label: "Contact Us", href: "/contact" },
        ],
      }}
    />
  );
}
