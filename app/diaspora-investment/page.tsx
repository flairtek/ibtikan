import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EmptyState } from "@/components/site/EmptyState";
import { listProperties } from "@/lib/repo";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Property Investment for the Ghanaian Diaspora",
    description:
      "Explore property opportunities in Ghana from abroad. Ibtikan Ibn Adams Properties Limited supports diaspora buyers with information and enquiry support.",
    path: "/diaspora-investment",
  });

const CHECKLIST = [
  "Verify the seller and the property",
  "Engage your own licensed lawyer for title searches",
  "Inspect the land or property yourself or via someone you trust",
  "Insist on written receipts for every payment",
  "Confirm boundaries and access",
  "Understand what the transaction documents commit you to",
];

export default async function DiasporaInvestmentPage() {
  const listings = await listProperties({ limit: 6 });

  return (
    <>
      <PageHero
        title="Property Investment for the Ghanaian Diaspora"
        lede="Your Ghana Property Journey Starts Here — property opportunities back home, explored carefully, from anywhere in the world."
        image={media.hallway}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Diaspora Investment", path: "/diaspora-investment" },
        ]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Who this is for"
              title="Buying property in Ghana while living abroad"
            />
            <div className="space-y-4 leading-relaxed text-ink/85">
              <p>
                Many Ghanaians abroad want to own property back home — a family
                home, a plot to build on later, or a long-term asset. Distance
                makes careful work matter even more, and that is exactly how we
                approach diaspora enquiries.
              </p>
              <p>
                Start with a conversation. Tell us the property type you want,
                preferred locations, your budget, and the country you are
                contacting from, along with your preferred method of
                communication. Our team then shares verified options that match,
                answers questions directly, and supports you as decisions
                develop.
              </p>
              <p className="rounded-lg border border-line bg-ivory p-4 text-sm">
                <strong>From us, you can expect:</strong> verified property
                information, transparent communication and patient guidance.{" "}
                <strong>From your side:</strong> independent legal due diligence
                by a qualified professional — we always recommend it and can
                work alongside your lawyer.
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-navy">Diaspora buyer due-diligence checklist</h3>
            <ol className="card mt-6 divide-y divide-line">
              {CHECKLIST.map((c, i) => (
                <li key={c} className="flex items-center gap-4 px-6 py-4">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold text-xs font-bold text-gold-600"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink/85">{c}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              This checklist is general educational information, not legal
              advice. Requirements depend on your circumstances — consult a
              qualified Ghanaian lawyer before committing to any purchase.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Current options"
            title="Verified properties available now"
            lede="Listings currently published in the portfolio. New properties are added as verification completes."
          />
          {listings.length === 0 ? (
            <EmptyState
              title="Listings are being verified"
              text="Property inventory is published here as it completes the company's checks. Enquire below and we will respond with the current position."
              actions={[{ label: "Enquire Now", href: "#enquire" }]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="enquire">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl text-navy">Remote enquiry</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Tell us what you are looking for. We reply personally using your
              preferred contact method.
            </p>
            <div className="mt-6">
              <EnquiryForm
                source="diaspora-investment"
                defaultType="diaspora"
                showCountry
              />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl text-navy">Frequently asked questions</h3>
            <div className="mt-5">
              <Faq
                items={[
                  {
                    q: "Can you represent my property purchase legally?",
                    a: "No. We are not a law firm and do not provide legal representation, title verification, escrow or payment processing. Engage your own qualified lawyer for those steps.",
                  },
                  {
                    q: "How do payments work from abroad?",
                    a: "We do not claim remote purchase or international payment processing services. Discuss any transaction directly with our team and complete payment matters under your lawyer's guidance.",
                  },
                  {
                    q: "Can you arrange a viewing while I am in Ghana?",
                    a: "Yes — tell us when you plan to visit and we will arrange viewings that match your trip.",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Your Ghana property journey starts here."
        actions={[
          { label: "Send an Enquiry", href: "#enquire", style: "primary" },
          { label: "Call Our Team", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
