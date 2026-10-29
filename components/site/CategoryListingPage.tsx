import type { Crumb } from "./Breadcrumbs";
import { PageHero } from "./PageHero";
import { SectionHeader } from "./SectionHeader";
import {
  CatalogFilters,
  PropertyCatalog,
} from "./PropertyCatalog";
import { Faq } from "./Faq";
import { CtaBand } from "./CtaBand";
import { countProperties, listProperties } from "@/lib/repo";
import type { ReactNode } from "react";

export interface ContentSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export async function CategoryListingPage({
  basePath,
  anchor,
  heroTitle,
  heroLede,
  image,
  crumbs,
  introTitle,
  intro,
  listingTitle,
  category,
  sections,
  faq,
  emptyState,
  extra,
}: {
  basePath: string;
  anchor: "properties" | "custom";
  heroTitle: string;
  heroLede: string;
  image: string;
  crumbs: Crumb[];
  introTitle: string;
  intro: string[];
  listingTitle?: string;
  category: string;
  sections?: ContentSection[];
  faq?: { q: string; a: string }[];
  emptyState: { title: string; text: string; actions: { label: string; href: string }[] };
  extra?: ReactNode;
}) {
  const PAGE_SIZE = 9;
  const results = await listProperties({ category, limit: PAGE_SIZE });
  const total = await countProperties({ category });
  const filters: CatalogFilters = { category, page: 1, sort: "newest" };

  return (
    <>
      <PageHero title={heroTitle} lede={heroLede} image={image} crumbs={crumbs} />

      <section className="section">
        <div className="container-site">
          <SectionHeader eyebrow="Overview" title={introTitle} />
          <div className="max-w-3xl space-y-4 leading-relaxed text-ink/85">
            {intro.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          {anchor === "properties" && (
            <div className="mt-14">
              {listingTitle && <h2 className="mb-8 font-serif text-3xl text-navy">{listingTitle}</h2>}
              <PropertyCatalog
                basePath={basePath}
                results={results}
                total={total}
                filters={filters}
                pageSize={PAGE_SIZE}
                lockCategory={category}
                emptyState={emptyState}
              />
            </div>
          )}
          {extra}
          {sections?.map((s) => (
            <div key={s.title} className="mt-14 max-w-3xl">
              <h3 className="font-serif text-2xl text-navy">{s.title}</h3>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 32)} className="mt-4 leading-relaxed text-ink/85">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b.slice(0, 32)} className="flex items-start gap-3 text-sm text-ink/85">
                      <span aria-hidden="true" className="mt-0.5 text-gold">▪</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {faq && (
            <div className="mt-16">
              <h3 className="mb-6 font-serif text-2xl text-navy">Frequently asked questions</h3>
              <Faq items={faq} />
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Talk to our team."
        text="Verified information, patient guidance and honest answers — in person, by email or by phone."
        actions={[
          { label: "Enquire Now", href: "/enquire", style: "primary" },
          { label: "Contact Us", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
