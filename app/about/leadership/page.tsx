import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { company, media } from "@/lib/brand";


export const generateMetadata = () =>
  buildMetadata({
    title: "Leadership",
    description: `Leadership of ${company.name} — led by Chief Executive Officer ${company.ceo}.`,
    path: "/about/leadership",
  });

const PRINCIPLES = [
  {
    title: "Transparent transactions",
    text: "Business conducted with openness: clear documentation, honest information and no hidden surprises.",
  },
  {
    title: "Long-term relationships",
    text: "Customers, investors and partners are served for the long term, not a single deal.",
  },
  {
    title: "Well-planned communities",
    text: "Developments planned to contribute lasting value to their surroundings.",
  },
  {
    title: "Continuous learning",
    text: "A culture of professional development and improvement at every level of the company.",
  },
] as const;

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        title="Leadership"
        lede="The team responsible for the company's strategic direction, growth and values."
        image={media.buildingCorner}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Leadership", path: "/about/leadership" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="eyebrow mb-3">Chief Executive Officer</h2>
            <h3 className="font-serif text-3xl text-navy">{company.ceo}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted">
              Chief Executive Officer, {company.name}
            </p>
          </div>

          <div className="card mx-auto mt-10 grid max-w-3xl gap-0 overflow-hidden sm:grid-cols-5">
            <div className="flex items-center justify-center bg-navy p-10 sm:col-span-2">
              <div className="text-center">
                <span className="font-serif text-5xl text-gold">AA</span>
                <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
                  Portrait pending company approval
                </p>
              </div>
            </div>
            <div className="p-8 sm:col-span-3">
              <p className="leading-relaxed text-muted">
                {company.ceo} provides leadership and strategic direction for the
                company&apos;s business development, corporate growth and long-term
                vision. He is committed to building a real estate company that
                emphasises integrity, professionalism, customer satisfaction and
                sustainable property development.
              </p>
              <Link href="/about/ceo" className="btn-navy mt-6">
                Read the complete CEO biography
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <h3 className="mb-8 text-center font-serif text-3xl text-navy">
              Corporate leadership principles
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <div key={p.title} className="card p-6">
                  <h4 className="font-serif text-lg text-navy">{p.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Speak with our team."
        text="Enquiries about the company, its leadership and its plans are always welcome."
        actions={[
          { label: "Contact Us", href: "/contact", style: "primary" },
          { label: "Explore Properties", href: "/properties", style: "outline" },
        ]}
      />
    </>
  );
}
