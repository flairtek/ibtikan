import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";
import { listArticles } from "@/lib/repo";
import { formatDate } from "@/lib/format";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Real Estate Insights",
    description:
      "Practical real estate guidance for buyers in Ghana — land purchases, due diligence, buying from abroad and more from Ibtikan Ibn Adams Properties Limited.",
    path: "/insights",
  });

export default async function InsightsPage() {
  const articles = await listArticles(true);

  return (
    <>
      <PageHero
        title="Real Estate Insights"
        lede="Practical, factual guidance to help you make confident property decisions in Ghana."
        image={media.livingRoom}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          {articles.length === 0 ? (
            <EmptyState
              title="Articles are being prepared"
              text="Our insights are written carefully and reviewed before publication, so nothing appears here until it is approved. Property enquiries are always welcome in the meantime."
              actions={[
                { label: "Enquire Now", href: "/enquire" },
                { label: "Explore Properties", href: "/properties" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <article key={a.id} className="card flex flex-col p-7">
                  {a.publishedAt && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      {formatDate(a.publishedAt)}
                    </p>
                  )}
                  <h2 className="mt-3 font-serif text-xl leading-snug text-navy">
                    <Link href={`/insights/${a.slug}`} className="hover:text-archblue">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
                    {a.excerpt}
                  </p>
                  <Link
                    href={`/insights/${a.slug}`}
                    className="mt-auto pt-5 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold"
                  >
                    Read article →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Have a property question?"
        text="Our team answers enquiries directly — no question is too small."
        actions={[
          { label: "Contact Us", href: "/contact", style: "primary" },
          { label: "Explore Properties", href: "/properties", style: "outline" },
        ]}
      />
    </>
  );
}
