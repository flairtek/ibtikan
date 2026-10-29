import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  buildMetadata,
  breadcrumbJsonLd,
  realEstateListingJsonLd,
} from "@/lib/seo";
import { getPropertyBySlug, getPropertyImages, listProperties } from "@/lib/repo";
import { formatPrice } from "@/lib/format";
import { propertyCategoryLabels, transactionTypes } from "@/lib/brand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";
import { availabilityLabel } from "@/components/site/PropertyCard";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return buildMetadata({
      title: "Property not found",
      description: "This property listing does not exist or is not published.",
      path: `/properties/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: property.seoTitle ?? `${property.title} — ${property.location || "Ghana"}`,
    description:
      property.seoDescription ??
      `${property.title} in ${property.location || "Ghana"}: ${property.description.slice(0, 140)}`,
    path: `/properties/${property.slug}`,
    ogImage: property.coverImage ?? undefined,
  });
}



export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const images = await getPropertyImages(property.id);
  const gallery = [
    ...(property.coverImage ? [{ id: -1, url: property.coverImage, alt: `Cover image for ${property.title}` }] : []),
    ...images,
  ];

  const related = (await listProperties({ category: property.category, limit: 3 })).filter(
    (p) => p.id !== property.id
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: property.title, path: `/properties/${property.slug}` },
  ];

  const featuresRows: { label: string; display: string | null }[] = [
    { label: "Reference", display: property.ref },
    { label: "Category", display: propertyCategoryLabels[property.category as never] ?? property.category },
    {
      label: "Transaction",
      display: transactionTypes.find((t) => t.value === property.transactionType)?.label ?? property.transactionType,
    },
    { label: "Location", display: property.location || null },
    { label: "Region", display: property.region || null },
    {
      label: "Price",
      display: property.price != null ? formatPrice(property.price, property.currency) : "Price on request",
    },
    { label: "Land area", display: property.landArea },
    { label: "Building area", display: property.buildingArea },
    { label: "Bedrooms", display: property.bedrooms == null ? null : String(property.bedrooms) },
    { label: "Bathrooms", display: property.bathrooms == null ? null : String(property.bathrooms) },
    { label: "Availability", display: availabilityLabel(property.availability) },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          realEstateListingJsonLd(property),
        ]}
      />
      <div className="bg-navy pb-2 pt-6">
        <div className="container-site">
          <Breadcrumbs items={crumbs} light />
          <p className="eyebrow">{propertyCategoryLabels[property.category as never] ?? property.category}</p>
          <h1 className="mt-2 font-serif text-3xl text-white sm:text-4xl">{property.title}</h1>
          <p className="mt-2 text-white/70">
            {property.location || "Ghana"} · Ref. {property.ref}
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PropertyGallery images={gallery} title={property.title} />

            <div className="mt-10">
              <h2 className="font-serif text-2xl text-navy">About this property</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                {property.description
                  .split("\n\n")
                  .filter(Boolean)
                  .map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
              </div>
            </div>

            {property.features.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif text-2xl text-navy">Key features</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/85">
                      <span aria-hidden="true" className="mt-0.5 text-gold">▪</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 rounded-xl border border-line/70 bg-ivory p-5 text-xs leading-relaxed text-muted">
              Information shown is supplied by {`Ibtikan Ibn Adams Properties Limited`} and is
              subject to change. All property matters — including title and legal
              verification — should be confirmed with independent, qualified
              professionals before any purchase.
            </div>
          </div>

          <aside>
            <div className="card sticky top-24 p-6">
              <p className="font-serif text-3xl text-navy">
                {formatPrice(property.price, property.currency)}
              </p>
              <dl className="mt-6 divide-y divide-line">
                {featuresRows
                  .filter((r) => r.display != null && r.display !== "")
                  .map((r) => (
                    <div key={r.label} className="flex items-baseline justify-between gap-3 py-2.5">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {r.label}
                      </dt>
                      <dd className="text-right text-sm text-ink">{r.display}</dd>
                    </div>
                  ))}
              </dl>
              <a
                href="#enquire"
                className="btn-primary mt-6 w-full"
              >
                Enquire About This Property
              </a>
            </div>
          </aside>
        </div>

        <div className="container-site mt-12" id="enquire">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-navy">
                Enquire about this property
              </h2>
              <p className="mt-2 text-sm text-muted">
                Your enquiry is associated with {property.title} (ref. {property.ref}) automatically.
              </p>
              <div className="mt-6">
                <EnquiryForm
                  source={`property:${property.ref}`}
                  defaultType="property"
                  defaultPropertyRef={property.ref}
                  propertyId={property.id}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-ivory">
          <div className="container-site">
            <h2 className="mb-10 font-serif text-3xl text-navy">Related properties</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <p className="mt-8 text-center">
              <Link href="/properties" className="btn-outline-navy">
                View all properties
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
