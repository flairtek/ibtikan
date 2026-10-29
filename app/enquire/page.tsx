import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { media, company } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Enquire",
    description: `Send an enquiry to Ibtikan Ibn Adams Properties Limited — property, investment and diaspora enquiries answered personally.`,
    path: "/enquire",
  });

export default function EnquirePage() {
  return (
    <>
      <PageHero
        title="Make an Enquiry"
        lede="Tell us what you are looking for. Our team responds personally to every enquiry."
        image={media.livingRoom}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Enquire", path: "/enquire" },
        ]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <EnquiryForm source="enquire" />
          </div>
          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-xl text-navy">Prefer to talk?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Call us or write directly — both reach the same team.
              </p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href={company.phoneHref} className="text-archblue underline">
                    {company.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${company.email}`} className="text-archblue underline">
                    {company.email}
                  </a>
                </li>
                <li className="text-muted">{company.location}</li>
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="font-serif text-xl text-navy">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm text-muted">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-semibold text-gold">1.</span>
                  Our team reads your enquiry and matches it to the verified property options we hold.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-semibold text-gold">2.</span>
                  We respond using your preferred contact method.
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="font-semibold text-gold">3.</span>
                  Where useful, we arrange viewings or further information.
                </li>
              </ol>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                Details are stored per our{" "}
                <a href="/privacy-policy" className="underline">
                  Privacy Policy
                </a>{" "}
                and used only to answer your enquiry.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
