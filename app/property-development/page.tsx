import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Property Development in Ghana",
    description:
      "Ibtikan Ibn Adams Properties Limited develops responsible residential and commercial property in Ghana. Learn about our development approach and current projects.",
    path: "/property-development",
  });

export default function PropertyDevelopmentPage() {
  return (
    <>
      <PageHero
        title="Property Development"
        lede="Responsible development is our craft: planning first, communities in mind, quality that lasts."
        image={media.buildingCorner}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Property Development", path: "/property-development" },
        ]}
      />

      <section className="section">
        <div className="container-site grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Our approach"
              title="Development philosophy"
            />
            <p className="leading-relaxed text-ink/85">
              We believe real estate development should go beyond the
              construction of buildings to create communities where individuals
              and families can live, work and prosper. That belief shapes how
              the company approaches each development.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              Our work is organised around three commitments: plan thoroughly
              before building; develop responsibly with the area around us in
              mind; and stand behind what we complete — with clear information,
              honest timelines and lasting relationships.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              The company aspires to contribute modern residential and
              commercial environments to Ghana&apos;s housing needs — and to grow
              that contribution with each project it undertakes.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={media.hallway}
              alt="Contemporary residential architecture (illustrative stock image)"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Portfolio"
            title="Current and planned projects"
            lede="Company development projects live in our portfolio, each with its own verified details."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/projects"
              className="card p-8 transition-colors hover:border-archblue"
            >
              <h3 className="font-serif text-2xl text-navy">View the project portfolio</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Published projects with location, development type, verified status and related properties.
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                Open Projects →
              </p>
            </Link>
            <Link
              href="/enquire?type=project"
              className="card p-8 transition-colors hover:border-archblue"
            >
              <h3 className="font-serif text-2xl text-navy">Enquire about developing with us</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Partners, landowners and investors interested in development projects can start a conversation here.
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                Start an enquiry →
              </p>
            </Link>
          </div>
          <div className="mt-14 max-w-3xl">
            <h3 className="mb-6 font-serif text-2xl text-navy">Frequently asked questions</h3>
            <Faq
              items={[
                {
                  q: "How many projects has the company completed?",
                  a: "Project history is published in the project portfolio as each project's verified information is confirmed. The company does not publish figures that have not been supplied.",
                },
                {
                  q: "Can individuals buy into a development early?",
                  a: "Where a project has an off-plan or early-buyer arrangement, it is described on the project's page. Contact the team for the current status of any development.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's talk about your development goals."
        actions={[
          { label: "Enquire Now", href: "/enquire?type=project", style: "primary" },
          { label: "Contact Us", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
