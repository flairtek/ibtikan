import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { CategoryListingPage } from "@/components/site/CategoryListingPage";
import { media } from "@/lib/brand";
import Link from "next/link";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Luxury Homes in Ghana",
    description:
      "Luxury homes and premium residential opportunities in Ghana from Ibtikan Ibn Adams Properties Limited.",
    path: "/luxury-homes",
  });

export default function LuxuryHomesPage() {
  return (
    <CategoryListingPage
      basePath="/luxury-homes"
      anchor="properties"
      category="luxury"
      heroTitle="Luxury Homes"
      heroLede="Architectural presence, careful finishes and homes designed to be lived in beautifully."
      image={media.hero}
      crumbs={[
        { name: "Home", path: "/" },
        { name: "Luxury Homes", path: "/luxury-homes" },
      ]}
      introTitle="The premium side of the portfolio"
      intro={[
        "A luxury home is defined by considered design and the quality of its setting — generous proportions, materials that age well, and surroundings chosen with intent.",
        "The homes presented here come from the company's verified premium listings and the relevant developments in our project portfolio. Availability changes; enquire for the current selection.",
      ]}
      listingTitle="Available luxury homes"
      extra={
        <div className="mt-16 grid items-center gap-10 rounded-xl bg-navy p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h3 className="font-serif text-3xl text-white">
              Private property guidance
            </h3>
            <p className="mt-4 leading-relaxed text-white/75">
              Premium property conversations are handled personally and
              discreetly. Tell us what you are looking for — style, location,
              size and budget — and our team will curate options and arrange
              viewings.
            </p>
            <Link href="/enquire?type=property" className="btn-primary mt-6">
              Start a private enquiry
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={media.interior}
              alt="Elegant interior (illustrative stock image)"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      }
      faq={[
        {
          q: "Do you provide property valuation or appraisal services?",
          a: "We can share the asking price and the property details we hold. Independent valuation should be done by a qualified valuer if you need one.",
        },
        {
          q: "Can viewings be arranged from abroad?",
          a: "Yes — diaspora enquiries are welcome. See our Diaspora Investment page for how we work with overseas buyers.",
        },
      ]}
      emptyState={{
        title: "Luxury listings are being prepared",
        text: "Premium homes are published here as their details are verified. Private enquiries are welcome in the meantime.",
        actions: [
          { label: "Start a Private Enquiry", href: "/enquire?type=property" },
          { label: "Contact Us", href: "/contact" },
        ],
      }}
    />
  );
}
