import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata, personJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { company, media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "CEO Profile — Mr. Armiyaw Abubakar",
    description: `Complete profile of ${company.ceo}, Chief Executive Officer of ${company.name}: background, education, leadership priorities and vision.`,
    path: "/about/ceo",
  });

const EDUCATION = [
  {
    school: "Mankarigu Primary School",
    stage: "Foundational education",
    text: "Received his foundational education.",
  },
  {
    school: "Tamale Bagabaga Annex Junior High School",
    stage: "Junior high education",
    text: "Continued his academic development.",
  },
  {
    school: "Salaga Senior High School",
    stage: "Senior high education",
    text: "Completed the next stage of his formal education.",
  },
  {
    school: "University of Ghana",
    stage: "Currently pursuing higher education",
    text: "Pursuing higher education while undertaking business leadership responsibilities.",
  },
];

const PRIORITIES = [
  {
    title: "Expanding land sales and development",
    text: "Expanding opportunities in land sales and real estate development.",
  },
  {
    title: "Modern property projects",
    text: "Promoting modern residential and commercial property projects.",
  },
  {
    title: "Responsible transactions",
    text: "Encouraging transparent and responsible property transactions.",
  },
  {
    title: "Lasting relationships",
    text: "Developing long-term relationships with customers, investors and business partners.",
  },
  {
    title: "Well-planned communities",
    text: "Supporting the development of well-planned residential communities.",
  },
  {
    title: "Innovation and sustainability",
    text: "Promoting innovative and sustainable real estate solutions.",
  },
  {
    title: "Corporate reputation",
    text: "Strengthening the company's corporate reputation and market presence.",
  },
];

export default function CeoPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <PageHero
        title={`${company.ceo}`}
        lede={`Profile of the Chief Executive Officer, ${company.name}`}
        image={media.hallway}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "CEO Profile", path: "/about/ceo" },
        ]}
      />

      {/* Title block */}
      <section className="container-site relative -mt-10">
        <div className="card mx-auto max-w-3xl px-8 py-8 text-center shadow-md">
          <p className="eyebrow">Profile of the Chief Executive Officer</p>
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">
            Mr. Armiyaw Abubakar
          </h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Chief Executive Officer (CEO)
          </p>
          <p className="mt-1 text-sm text-muted">{company.name}</p>
        </div>
      </section>

      {/* Personal and professional profile */}
      <section className="section">
        <div className="container-site grid gap-12 lg:grid-cols-5 items-center">
          <div className="lg:col-span-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line shadow-md bg-archblue/5">
              <Image
                src="/Mr_Armiyaw_Abubakar.jpeg"
                alt="Mr. Armiyaw Abubakar, Chief Executive Officer of Ibtikan Ibn Adams Properties Limited"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-serif text-3xl text-navy">
              Personal and Professional Profile
            </h2>
            <p className="mt-5 leading-relaxed text-ink/85">
              Mr. Armiyaw Abubakar is the Chief Executive Officer of Ibtikan Ibn
              Adams Properties Limited, a real estate company focused on
              property development, land sales, residential housing, commercial
              properties, and real estate investment opportunities in Ghana.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              As Chief Executive Officer, Mr. Abubakar provides leadership and
              strategic direction for the company&apos;s business development,
              corporate growth, and long-term vision.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              He is committed to building a real estate company that emphasises
              integrity, professionalism, customer satisfaction, and sustainable
              property development.
            </p>
          </div>
        </div>
      </section>

      {/* Education timeline */}
      <section className="section bg-ivory">
        <div className="container-site">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow mb-3 text-center">Educational Background</p>
            <h2 className="text-center font-serif text-3xl text-navy">
              A journey of continuous learning
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-muted">
              His educational journey reflects his determination to pursue
              academic advancement while undertaking business leadership
              responsibilities.
            </p>
            <ol className="relative mt-12 space-y-10 border-l-2 border-gold/40 pl-6">
              {EDUCATION.map((e, i) => (
                <li key={e.school} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.72rem] mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gold bg-gold text-[0.6rem] font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-serif text-xl text-navy">{e.school}</h3>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {e.stage}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{e.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-center text-xs text-muted">
              No dates, degrees, qualifications or academic honours are listed
              because none have been supplied for publication.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership priorities */}
      <section className="section">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">Leadership at Ibtikan Ibn Adams Properties Limited</p>
            <h2 className="font-serif text-3xl text-navy">
              Leadership priorities
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Under his leadership, Ibtikan Ibn Adams Properties Limited seeks
              to become a respected name in Ghana&apos;s real estate industry.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRIORITIES.map((p) => (
              <div key={p.title} className="card p-6">
                <div
                  aria-hidden="true"
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-gold-100"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg text-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business philosophy */}
      <section className="section relative overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gold" />
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-6">Business Philosophy</p>
            <blockquote className="font-serif text-2xl leading-relaxed text-white sm:text-3xl">
              “Real estate development should go beyond the construction of
              buildings to create communities where individuals and families can
              live, work, and prosper.”
            </blockquote>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/50">
              Editorial summary — not a verbatim quotation
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-4 leading-relaxed text-white/80">
            <p>
              Mr. Abubakar believes that property ownership is an important
              foundation for family security, financial independence, and
              long-term wealth creation.
            </p>
            <p>
              His business philosophy emphasises that real estate development
              should go beyond the construction of buildings to create
              communities where individuals and families can live, work, and
              prosper. He advocates responsible business practices, customer
              confidence, and the development of lasting property assets.
            </p>
          </div>
        </div>
      </section>

      {/* Vision + commitment */}
      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div className="card p-8">
            <p className="eyebrow mb-3">Vision for the Company</p>
            <h2 className="font-serif text-2xl text-navy">
              Competitive. Recognised. Customer-focused.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Mr. Abubakar&apos;s vision is to position Ibtikan Ibn Adams Properties
              Limited as a competitive real estate development company
              recognised for quality, innovation, and customer-focused service.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              He seeks to support the development of modern residential estates,
              commercial properties, and investment opportunities that
              contribute to Ghana&apos;s housing and infrastructure development.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              His long-term ambition is to build a company capable of serving
              clients both within Ghana and across the international Ghanaian
              diaspora.
            </p>
          </div>
          <div className="card p-8">
            <p className="eyebrow mb-3">Commitment to Excellence</p>
            <h2 className="font-serif text-2xl text-navy">
              Continuous development, ethical leadership
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Mr. Armiyaw Abubakar remains committed to continuous professional
              development, ethical leadership, and building an organization that
              creates value for its customers, partners, and communities.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Through Ibtikan Ibn Adams Properties Limited, he aims to
              contribute to a future where responsible property ownership and
              well-planned communities are accessible to more people.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate information panel */}
      <section className="container-site pb-8">
        <div className="card mx-auto max-w-4xl p-8">
          <p className="eyebrow mb-5 text-center">Corporate Information</p>
          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {[
              ["Company", company.name],
              ["Chief Executive Officer", company.ceo],
              ["Website", "www.ibtikanproperties.com"],
              ["Email", company.email],
              ["Corporate Motto", company.motto],
              ["Corporate Vision", `${company.vision}.`],
            ].map(([dt, dd]) => (
              <div key={dt} className="border-b border-line pb-3">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {dt}
                </dt>
                <dd className="mt-1 text-sm text-ink">{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title="Continue exploring."
        text="See the property portfolio the company is building, or start a conversation with the team."
        actions={[
          { label: "Explore Properties", href: "/properties", style: "primary" },
          { label: "Contact Our Team", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
