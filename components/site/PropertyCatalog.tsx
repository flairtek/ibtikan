import Link from "next/link";
import type { PropertyRecord } from "@/lib/model";
import { PropertyCard } from "./PropertyCard";
import { propertyCategories, propertyCategoryLabels, transactionTypes } from "@/lib/brand";
import { EmptyState } from "./EmptyState";

export interface CatalogFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  transaction?: string;
  availability?: string;
  sort?: string;
  page: number;
}

export function PropertyCatalog({
  basePath,
  results,
  total,
  filters,
  pageSize,
  lockCategory,
  emptyState,
}: {
  basePath: string;
  results: PropertyRecord[];
  total: number;
  filters: CatalogFilters;
  pageSize: number;
  lockCategory?: string;
  emptyState: { title: string; text: string; actions: { label: string; href: string }[] };
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const qs = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | number | undefined> = {
      category: filters.category,
      location: filters.location,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      transaction: filters.transaction,
      availability: filters.availability,
      sort: filters.sort,
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v !== undefined && v !== "" && !(k === "page" && v === 1)) {
        params.set(k, String(v));
      }
    }
    const s = params.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div>
      <form
        method="get"
        action={basePath}
        role="search"
        aria-label="Filter properties"
        className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6 items-end"
      >
        <div className="lg:col-span-2">
          <label htmlFor="f-location" className="label">
            Location
          </label>
          <input
            id="f-location"
            name="location"
            type="search"
            defaultValue={filters.location ?? ""}
            placeholder="Town, area or region"
            className="input"
          />
        </div>
        {!lockCategory ? (
          <div>
            <label htmlFor="f-category" className="label">
              Category
            </label>
            <select id="f-category" name="category" defaultValue={filters.category ?? ""} className="input">
              <option value="">All categories</option>
              {propertyCategories.map((c) => (
                <option key={c} value={c}>
                  {propertyCategoryLabels[c]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div>
          <label htmlFor="f-transaction" className="label">
            Sale or rental
          </label>
          <select id="f-transaction" name="transaction" defaultValue={filters.transaction ?? ""} className="input">
            <option value="">Any</option>
            {transactionTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:grid sm:grid-cols-2 sm:gap-2">
          <div>
            <label htmlFor="f-min" className="label">
              Min price (GH₵)
            </label>
            <input id="f-min" name="minPrice" type="number" min="0" defaultValue={filters.minPrice ?? ""} className="input" />
          </div>
          <div>
            <label htmlFor="f-max" className="label">
              Max price (GH₵)
            </label>
            <input id="f-max" name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice ?? ""} className="input" />
          </div>
        </div>
        <div>
          <label htmlFor="f-availability" className="label">
            Availability
          </label>
          <select id="f-availability" name="availability" defaultValue={filters.availability ?? ""} className="input">
            <option value="">Any</option>
            <option value="available">Available</option>
            <option value="coming-soon">Coming soon</option>
            <option value="reserved">Reserved</option>
            <option value="under-construction">Under construction</option>
          </select>
        </div>
        <div>
          <label htmlFor="f-sort" className="label">
            Sort by
          </label>
          <select id="f-sort" name="sort" defaultValue={filters.sort ?? "newest"} className="input">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
          <button type="submit" className="btn-navy flex-1 !py-2.5 text-xs">
            Apply filters
          </button>
          <Link href={basePath} className="btn-outline-navy !py-2.5 text-xs">
            Clear
          </Link>
        </div>
      </form>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        Showing {results.length} of {total} {total === 1 ? "property" : "properties"}
        {filters.category ? ` in ${propertyCategoryLabels[filters.category as never] ?? filters.category}` : ""}
        {pages > 1 ? ` — page ${filters.page} of ${pages}` : ""}
      </p>

      {total === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={emptyState.title}
            text={emptyState.text}
            actions={emptyState.actions}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Catalogue pages" className="mt-10 flex items-center justify-center gap-2">
          {filters.page > 1 && (
            <Link rel="prev" href={qs({ page: filters.page - 1 })} className="btn-outline-navy !py-2.5 text-xs">
              Previous
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={qs({ page: n })}
              aria-current={n === filters.page ? "page" : undefined}
              className={`rounded-md border px-3.5 py-2 text-xs font-semibold ${
                n === filters.page
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink hover:border-archblue"
              }`}
            >
              {n}
            </Link>
          ))}
          {filters.page < pages && (
            <Link rel="next" href={qs({ page: filters.page + 1 })} className="btn-outline-navy !py-2.5 text-xs">
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
