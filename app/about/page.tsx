
import Link from "next/link";

import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { getPageContent } from "@/lib/content";
import { company, media } from "@/lib/brand";


export const generateMetadata = () =>
  buildMetadata({
    title: "About Us",
    description:
      "About Ibtikan Ibn Adams Properties Limited — a Ghana-focused real estate company dedicated to responsible property development, land sales, residential housing and commercial properties.",
    path: "/about",
  });

const VALUES = [
  {
    title: "Integrity",
    text: "Honest, transparent dealings — you always know where you stand.",
  },
  {
    title: "Professionalism",
    text: "Careful documentation, clear communication and consistent follow-through.",
  },
  {
    title: "Customer focus",
    text: "Service built around each customer's goals and circumstances.",
  },
  {
    title: "Responsibility",
    text: "Development that respects planning, safety and community value.",
  },
  {
    title: "Long-term relationships",
    text: "Partnerships with customers, investors and communities that last.",
  },
  {
    title: "Confidence",
    text: "Clear information and patient guidance at every stage.",
  },
] as const;

function paragraphs(raw: string) {
  return raw
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function AboutPage() {
  const intro = paragraphs(await getPageContent("about.intro"));
  return (
    <>
      <PageHero
        title="About Us"
        lede={company.motto}
        image={media.aboutBuilding}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ]}
      />

      <section className="section">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1 relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={media.buildingLight}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeader
              eyebrow="Who we are"
              title="About Ibtikan Ibn Adams Properties Limited"
            />
            {intro.map((p) => (
              <p key={p.slice(0, 24)} className="mb-4 leading-relaxed text-ink/85">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Purpose and focus"
            title="Purpose, Vision and Values"
            align="center"
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            <div className="card p-7">
              <h3 className="eyebrow mb-2">Corporate Motto</h3>
              <p className="font-serif text-2xl text-navy">{company.motto}</p>
              <p className="mt-3 text-sm text-muted">
                People, places and possibilities guide every opportunity we present.
              </p>
            </div>
            <div className="card p-7">
              <h3 className="eyebrow mb-2">Corporate Vision</h3>
              <p className="font-serif text-2xl text-navy">{company.vision}.</p>
              <p className="mt-3 text-sm text-muted">
                Communities built for a brighter tomorrow across Ghana.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <h3 className="font-serif text-lg text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Property and development services"
              title="What We Focus On"
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Real estate development",
                "Land sales",
                "Residential housing",
                "Luxury homes",
                "Commercial properties",
                "Property management",
                "Gated communities",
                "Investment opportunities",
                "Diaspora property enquiries",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/85">
                  <span aria-hidden="true" className="mt-1 text-gold">▪</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8">
            <h3 className="font-serif text-2xl text-navy">
              Customer and investor focus
            </h3>
            <p className="mt-4 leading-relaxed text-muted">
              We serve first-time buyers, families, commercial investors and the
              Ghanaian diaspora. Our approach is the same for each: understand
              the goal, present verified options, and support the decision with
              honest, patient guidance.
            </p>
            <h3 className="mt-8 font-serif text-2xl text-navy">Leadership</h3>
            <p className="mt-4 leading-relaxed text-muted">
              The company is led by Chief Executive Officer {company.ceo},
              whose leadership priorities emphasise transparency, responsible
              transactions and well-planned residential communities.
            </p>
            <Link href="/about/ceo" className="btn-outline-navy mt-6">
              Read the CEO Profile
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to explore what we can build together?"
        text="Discover the property portfolio or start a conversation with our team."
        actions={[
          { label: "Explore Properties", href: "/properties", style: "primary" },
          { label: "Contact Us", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
