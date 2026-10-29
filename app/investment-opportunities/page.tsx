import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { EmptyState } from "@/components/site/EmptyState";
import { listProperties } from "@/lib/repo";
import { media } from "@/lib/brand";
import { getPageContent } from "@/lib/content";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Real Estate Investment Opportunities in Ghana",
    description:
      "Property investment opportunities in Ghana from Ibtikan Ibn Adams Properties Limited — land, residential and commercial assets, with due-diligence guidance.",
    path: "/investment-opportunities",
  });

export default async function InvestmentOpportunitiesPage() {
  const listings = await listProperties({ limit: 6 });
  const intro = await getPageContent("investment.opportunities");

  return (
    <>
      <PageHero
        title="Real Estate Investment Opportunities"
        lede="Property-backed opportunities across land, residential and commercial assets in Ghana."
        image={media.skylineDusk}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Investment Opportunities", path: "/investment-opportunities" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          <SectionHeader eyebrow="Overview" title="Property as a long-term asset" />
          <div className="max-w-3xl space-y-4 leading-relaxed text-ink/85">
            <p>{intro}</p>
            <p>
              We present property opportunities as tangible assets: land with a
              location, homes with a market, and developments with an intent.
              Every conversation starts with verified facts about what is
              currently available.
            </p>
            <p className="rounded-lg border border-line bg-ivory p-4 text-sm">
              <strong>Important:</strong> We do not guarantee rental income,
              capital appreciation or returns, and nothing on this site is
              regulated financial or legal advice. Consult qualified
              professionals for advice specific to your circumstances.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Current portfolio"
            title="Investment-relevant properties"
            lede="Listings from the portfolio that commonly interest investors. Availability changes — enquire for the latest position."
          />
          {listings.length === 0 ? (
            <EmptyState
              title="Investment-relevant listings are being prepared"
              text="As listings are verified and published, relevant opportunities are surfaced here. Register your investment interest in the meantime."
              actions={[
                { label: "Register Investment Interest", href: "#enquire" },
                { label: "Explore Properties", href: "/properties" },
              ]}
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

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Guidance"
              title="Property due-diligence guidance"
            />
            <ul className="space-y-3">
              {[
                "Engage a licensed lawyer to verify title and documents independently.",
                "Inspect the property in person, or send a trusted representative.",
                "Confirm any project's exact status, timeline and terms in writing.",
                "Verify the identity of everyone you deal with — our staff will happily confirm genuine company channels.",
                "Compare options before committing; never rush a property decision.",
              ].map((b) => (
                <li key={b.slice(0, 32)} className="flex items-start gap-3 text-sm text-ink/85">
                  <span aria-hidden="true" className="mt-0.5 text-gold">▪</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <h3 className="mb-6 font-serif text-2xl text-navy">Frequently asked questions</h3>
              <Faq
                items={[
                  {
                    q: "What returns can I expect from property investment in Ghana?",
                    a: "No return can be promised. We can share current property information so you and your professional advisers can form your own view.",
                  },
                  {
                    q: "Do you offer property management for investors?",
                    a: "Property management services are being finalised — see our Property Management page for the confirmed scope.",
                  },
                  {
                    q: "Is this financial advice?",
                    a: "No. The company provides property information and marketing. Financial, tax and legal matters require regulated professionals.",
                  },
                ]}
              />
            </div>
          </div>
          <div id="enquire">
            <h2 className="font-serif text-2xl text-navy">Investment enquiry</h2>
            <p className="mt-2 text-sm text-muted">
              Tell us your investment interest and budget. Our team will respond with relevant, verified options.
            </p>
            <div className="mt-6">
              <EnquiryForm source="investment-opportunities" defaultType="invest" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Start with a conversation."
        actions={[
          { label: "Enquire Now", href: "/enquire?type=invest", style: "primary" },
          { label: "Explore Properties", href: "/properties", style: "outline" },
        ]}
      />
    </>
  );
}
