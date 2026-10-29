import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { media } from "@/lib/brand";
import { getPageContent } from "@/lib/content";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Property Management in Ghana",
    description:
      "Property management services from Ibtikan Ibn Adams Properties Limited.",
    path: "/property-management",
  });

function paragraphs(raw: string) {
  return raw
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function PropertyManagementPage() {
  const scope = await getPageContent("property-management.scope");

  return (
    <>
      <PageHero
        title="Property Management"
        lede="Supporting property owners beyond the sale."
        image={media.bedroom}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Property Management", path: "/property-management" },
        ]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-ivory px-3 py-1 text-xs font-semibold text-muted">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
              Service scope under confirmation
            </div>
            <div className="max-w-3xl space-y-4 leading-relaxed text-ink/85">
              {paragraphs(scope).map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
            <div className="mt-10 max-w-3xl">
              <h3 className="mb-6 font-serif text-2xl text-navy">Frequently asked questions</h3>
              <Faq
                items={[
                  {
                    q: "What property management services do you offer today?",
                    a: "The exact scope is being finalised by the company. The description on this page will be updated once services are confirmed — the best way to stay informed is to enquire.",
                  },
                  {
                    q: "Can you manage my property now?",
                    a: "Send us an enquiry describing your property and what you need. We will respond with what the company can currently take on.",
                  },
                ]}
              />
            </div>
          </div>
          <aside>
            <h2 className="font-serif text-2xl text-navy">Ask about management</h2>
            <p className="mt-2 text-sm text-muted">
              Describe your property and what you need; we will confirm what is
              available.
            </p>
            <div className="mt-6">
              <EnquiryForm
                source="property-management"
                defaultType="general"
                compact
              />
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title="Questions about managing a property?"
        actions={[
          { label: "Enquire Now", href: "/enquire", style: "primary" },
          { label: "Contact Us", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
