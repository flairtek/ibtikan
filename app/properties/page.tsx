import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { PropertyCatalog } from "@/components/site/PropertyCatalog";
import { listProperties, countProperties } from "@/lib/repo";
import { media } from "@/lib/brand";


const PAGE_SIZE = 9;

export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Properties for Sale in Ghana",
    description:
      "Browse verified properties from Ibtikan Ibn Adams Properties Limited — land, residential homes, luxury houses and commercial properties in Ghana.",
    path: "/properties",
  });

type SearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const category = first(sp.category);
  const location = first(sp.location) || undefined;
  const minPriceRaw = first(sp.minPrice);
  const maxPriceRaw = first(sp.maxPrice);
  const transaction = first(sp.transaction);
  const availability = first(sp.availability);
  const sortRaw = first(sp.sort);
  const pageRaw = first(sp.page);

  const filters = {
    category,
    location,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    transaction,
    availability,
    sort: (sortRaw === "price-asc" || sortRaw === "price-desc" ? sortRaw : "newest") as "newest" | "price-asc" | "price-desc",
    page: Math.max(1, Number(pageRaw ?? "1") || 1),
  };

  const results = await listProperties({
    category,
    location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    transaction,
    availability,
    sort: filters.sort,
    limit: PAGE_SIZE,
    offset: (filters.page - 1) * PAGE_SIZE,
  });
  const total = await countProperties({ category, location, minPrice: filters.minPrice, maxPrice: filters.maxPrice, transaction, availability });

  return (
    <>
      <PageHero
        title="All Properties"
        lede="Verified properties from Ibtikan Ibn Adams Properties Limited. Every listing is published after the company completes its checks."
        image={media.buildingCorner}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Properties", path: "/properties" },
        ]}
      />
      <section className="section">
        <div className="container-site">
          <PropertyCatalog
            basePath="/properties"
            results={results}
            total={total}
            filters={filters}
            pageSize={PAGE_SIZE}
            emptyState={{
              title: "No properties match these filters yet",
              text: "The company publishes listings only after verification, so our portfolio is updated continuously. Adjust your filters, or enquire and we will tell you what is coming up.",
              actions: [
                { label: "Enquire Now", href: "/enquire" },
                { label: "Contact Us", href: "/contact" },
              ],
            }}
          />
        </div>
      </section>
    </>
  );
}
