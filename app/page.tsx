import Image from "next/image";
import Link from "next/link";
import {
  media,
  propertyCategoryLabels,
  company,
} from "@/lib/brand";
import {
  listProperties,
  listProjects,
} from "@/lib/repo";
import { getPageContent } from "@/lib/content";
import {
  CategoryCard,
} from "@/components/site/CategoryCard";
import { PropertyCard } from "@/components/site/PropertyCard";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyState } from "@/components/site/EmptyState";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CtaBand } from "@/components/site/CtaBand";

// 
const CATEGORY_CARDS = [
  {
    label: propertyCategoryLabels.land,
    href: "/land-sales",
    image: media.openLand,
    blurb: "Verified plots across Ghana's growth corridors",
  },
  {
    label: propertyCategoryLabels.residential,
    href: "/residential-properties",
    image: media.houseLawn,
    blurb: "Homes for families and first-time buyers",
  },
  {
    label: propertyCategoryLabels.luxury,
    href: "/luxury-homes",
    image: media.hero,
    blurb: "Eco-lodges and architect-designed homes",
  },
  {
    label: propertyCategoryLabels.commercial,
    href: "/commercial-properties",
    image: media.towers,
    blurb: "Office, retail and mixed-use opportunities",
  },
  {
    label: propertyCategoryLabels["gated-community"],
    href: "/gated-communities",
    image: media.housePool,
    blurb: "Planned, secure neighbourhood living",
  },
  {
    label: "Investment Opportunities",
    href: "/investment-opportunities",
    image: media.skylineDusk,
    blurb: "Property-backed investment conversations",
  },
] as const;

const COMMITMENTS = [
  {
    title: "Integrity",
    text: "We hold ourselves to honest, transparent dealings at every step of a transaction.",
  },
  {
    title: "Professionalism",
    text: "Clear communication, careful documentation and respectful service.",
  },
  {
    title: "Customer satisfaction",
    text: "We listen first, then work to meet each customer's goals.",
  },
  {
    title: "Responsible development",
    text: "Planning developments that contribute value to their surroundings.",
  },
  {
    title: "Long-term relationships",
    text: "We aim to serve customers across decades, not single transactions.",
  },
  {
    title: "Well-planned communities",
    text: "Places where individuals and families can live, work and prosper.",
  },
] as const;

function paragraphs(raw: string) {
  return raw
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function HomePage() {
  const intro = paragraphs(await getPageContent("home.intro"));
  const [featured, projects] = await Promise.all([
    listProperties({ featured: true, limit: 6 }),
    listProjects({ limit: 3 }),
  ]);

  return (
    <>
      {/* Section 2: Hero */}
      <section className="relative isolate overflow-hidden bg-navy">
        <Image
          src={media.hero}
          alt="Modern luxury residential architecture with warm lighting at dusk, showcasing clean design and expansive glass windows."
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-archblue/60"
        />
        <div className="container-site relative flex min-h-[32rem] flex-col items-start justify-center py-24 sm:min-h-[38rem]">
          <p className="eyebrow">{company.motto}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Building Better Communities for a Brighter Tomorrow.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Ibtikan Ibn Adams Properties Limited brings people, places and
            possibilities together through property development, land sales,
            residential housing, commercial properties and real estate
            investment opportunities in Ghana.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/properties" className="btn-primary">
              Explore Properties
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Company introduction */}
      <section className="section">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={media.aboutBuilding}
              alt="Contemporary building facade (illustrative stock image)"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeader eyebrow="People • Places • Possibilities" title="Property. Purpose. Possibility." />
            {intro.map((p) => (
              <p key={p.slice(0, 24)} className="mb-4 leading-relaxed text-ink/85">
                {p}
              </p>
            ))}
            <Link href="/about" className="btn-outline-navy mt-2">
              Discover Our Company
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Property categories */}
      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Find your fit"
            title="Property Categories"
            lede="From verified land to planned communities — explore the pathways to property ownership that we support."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORY_CARDS.map((c) => (
              <CategoryCard
                key={c.href}
                label={c.label}
                href={c.href}
                image={c.image}
                blurb={c.blurb}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Featured properties */}
      <section className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Portfolio"
              title="Featured Properties"
              lede="Verified listings currently featured by the company."
            />
            <Link href="/properties" className="btn-outline-navy mb-10">
              View all properties
            </Link>
          </div>
          {featured.length === 0 ? (
            <EmptyState
              title="Featured listings are being prepared"
              text="The company publishes its property inventory here once each listing has been verified. In the meantime, tell us what you are looking for and our team will respond directly."
              actions={[
                { label: "Enquire Now", href: "/enquire" },
                { label: "Explore Categories", href: "/properties" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Why choose us */}
      <section className="section bg-ivory">
        <div className="container-site">
          <SectionHeader
            eyebrow="Our commitments"
            title="Why Choose Ibtikan Properties"
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMMITMENTS.map((c) => (
              <div key={c.title} className="card p-7">
                <div
                  aria-hidden="true"
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-gold-100"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-navy">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Featured projects */}
      <section className="section">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Developments"
              title="Featured Projects"
              lede="Company development projects with published, verified information."
            />
            <Link href="/projects" className="btn-outline-navy mb-10">
              All projects
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState
              title="Projects will be published here"
              text="Development projects are published to this portfolio after their information has been verified by the company. Enquiries about current and upcoming developments are welcome."
              actions={[
                { label: "Enquire About Projects", href: "/enquire?type=project" },
                { label: "Property Development", href: "/property-development" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((pr) => (
                <ProjectCard key={pr.id} project={pr} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 8: CEO introduction */}
      <section className="section relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gold"
        />
        <div className="container-site grid items-center gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex aspect-[3/4] max-w-sm items-center justify-center rounded-xl border border-white/10 bg-archblue/40">
              <div className="text-center">
                <span className="font-serif text-6xl text-gold">AA</span>
                <p className="mt-3 text-[0.7rem] uppercase tracking-[0.25em] text-white/50">
                  Chief Executive Officer
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <SectionHeader
              eyebrow="Leadership"
              title="Leadership with Vision. Development with Purpose."
              light
            />
            <p className="max-w-2xl leading-relaxed text-white/80">
              {company.ceo} leads Ibtikan Ibn Adams Properties Limited with a
              vision to position the company as a competitive real estate
              development company recognised for quality, innovation and
              customer-focused service — contributing to housing and community
              development across Ghana.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/about/ceo" className="btn-primary">
                Read the CEO Profile
              </Link>
              <Link href="/about/leadership" className="btn-outline">
                Meet the Leadership
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Diaspora investment */}
      <section className="section bg-ivory">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <SectionHeader
              eyebrow="For the diaspora"
              title="Your Ghana Property Journey Starts Here."
            />
            <p className="mb-4 leading-relaxed text-ink/85">
              Living outside Ghana does not have to keep you from owning
              property back home. We support prospective buyers and investors in
              the Ghanaian diaspora with clear information, patient guidance and
              honest answers about land, residential and investment
              opportunities.
            </p>
            <p className="mb-6 leading-relaxed text-ink/85">
              Start with a conversation — tell us your property type,
              preferred locations and budget, and we will advise you on the
              verified options we can offer.
            </p>
            <Link href="/diaspora-investment" className="btn-primary">
              Diaspora Investment
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={media.skylineDusk}
                alt="City skyline at dusk (illustrative stock image)"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <CtaBand
        title="Let's Find the Right Property Opportunity."
        text="Explore the current portfolio or send us an enquiry — our team responds personally."
        actions={[
          { label: "Explore Properties", href: "/properties", style: "primary" },
          { label: "Enquire Now", href: "/enquire", style: "outline" },
        ]}
      />

      {/* Section 11: Footer — rendered in app/layout.tsx */}
    </>
  );
}
