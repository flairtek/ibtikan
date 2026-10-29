import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { media, company } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Contact Us",
    description: `Contact Ibtikan Ibn Adams Properties Limited — email ${company.email}, telephone ${company.phoneDisplay}, ${company.location}.`,
    path: "/contact",
  });

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        lede="We would be glad to hear from you — enquiries are answered personally."
        image={media.bedroom}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            <div className="card p-6">
              <h2 className="font-serif text-2xl text-navy">Get in touch</h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Company
                  </dt>
                  <dd className="mt-1 text-ink">{company.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Email
                  </dt>
                  <dd className="mt-1">
                    <a href={`mailto:${company.email}`} className="text-archblue underline">
                      {company.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Telephone
                  </dt>
                  <dd className="mt-1">
                    <a href={company.phoneHref} className="text-archblue underline">
                      {company.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Location
                  </dt>
                  <dd className="mt-1 text-ink">{company.location}</dd>
                </div>
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                We do not list an office address online — please get in touch and
                we will direct you precisely as needed.
              </p>
            </div>
            <nav aria-label="Related" className="card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
                Explore
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-archblue">
                <li>
                  <Link href="/properties" className="underline">
                    Properties for sale
                  </Link>
                </li>
                <li>
                  <Link href="/investment-opportunities" className="underline">
                    Investment opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/diaspora-investment" className="underline">
                    Diaspora investment
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-navy">Send a message</h2>
            <p className="mt-2 text-sm text-muted">
              All fields marked * are required. Your enquiry is recorded securely
              and never displayed publicly.
            </p>
            <div className="mt-6">
              <EnquiryForm source="contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
