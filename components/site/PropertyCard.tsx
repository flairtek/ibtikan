import Image from "next/image";
import Link from "next/link";
import type { PropertyRecord } from "@/lib/model";
import { formatPrice } from "@/lib/format";
import { propertyCategoryLabels } from "@/lib/brand";

const AVAILABILITY_LABELS: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  "under-construction": "Under construction",
  "coming-soon": "Coming soon",
};

export function availabilityLabel(v: string) {
  return AVAILABILITY_LABELS[v] ?? v;
}

export function PropertyCard({ property }: { property: PropertyRecord }) {
  const preview = property.features.slice(0, 3);
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg focus-within:shadow-lg">
      <Link
        href={`/properties/${property.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        tabIndex={-1}
        aria-hidden="true"
      >
        {property.coverImage ? (
          <Image
            src={property.coverImage}
            alt={`Cover image for ${property.title} (illustrative)`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy">
            <span className="font-serif text-2xl text-gold/70">
              {property.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-gold-600">
            {propertyCategoryLabels[property.category as never] ?? property.category}
          </span>
          <span
            className={`px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide ${
              property.availability === "available"
                ? "bg-sage/10 text-sage"
                : property.availability === "sold"
                  ? "bg-line text-muted"
                  : "bg-archblue/10 text-archblue"
            }`}
          >
            {availabilityLabel(property.availability)}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug text-navy">
          <Link href={`/properties/${property.slug}`} className="hover:text-archblue">
            {property.title}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {property.location || "Ghana"}
        </p>
        <p className="mt-3 font-serif text-lg font-semibold text-navy">
          {formatPrice(property.price, property.currency)}
          <span className="ml-1 text-xs font-normal text-muted">
            {property.transactionType === "rent" ? "per term" : ""}
          </span>
        </p>
        {preview.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5 text-xs text-muted">
            {preview.map((f) => (
              <li key={f} className="rounded border border-line px-2 py-1">
                {f}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Link
            href={`/properties/${property.slug}`}
            className="btn-navy flex-1 !px-4 !py-2.5 text-center text-xs"
          >
            View Details
          </Link>
          <Link
            href={`/enquire?property=${encodeURIComponent(property.ref)}&type=property`}
            className="btn-outline-navy flex-1 !px-4 !py-2.5 text-center text-xs"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}
