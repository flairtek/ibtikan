import type { Metadata } from "next";
import { company, media } from "./brand";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibtikanproperties.com";

interface SeoInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogImage?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  noindex,
  ogImage,
}: SeoInput): Metadata {
  const url = `${siteUrl}${path}`;
  // The root layout appends " | Ibtikan Properties" through its title
  // template, so the document title here stays unprefixed (otherwise the
  // brand suffix would appear twice). Open Graph and Twitter use the full
  // branded title because they do not run through the template.
  const brandedTitle =
    title === company.name
      ? `${company.name} — Real Estate Development, Land Sales & Property Investment in Ghana`
      : `${title} | ${company.shortName}`;
  return {
    title: title === company.name ? { absolute: brandedTitle } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: brandedTitle,
      description,
      url,
      siteName: company.name,
      type: "website",
      locale: "en_GH",
      images: ogImage
        ? [{ url: ogImage, alt: title }]
        : [{ url: media.hero, alt: company.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website,
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: "GH",
    },
    slogan: company.motto,
    description:
      "Real estate development, land sales, residential housing, commercial properties and real estate investment opportunities in Ghana.",
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: company.website,
    publisher: { "@type": "Organization", name: company.name },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Armiyaw Abubakar",
    jobTitle: "Chief Executive Officer",
    worksFor: { "@type": "Organization", name: company.name },
    email: company.email,
  };
}

export function realEstateListingJsonLd(
  p: {
    title: string;
    slug: string;
    location: string;
    description: string;
    price: number | null;
    currency: string;
    image?: string | null;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    url: `${siteUrl}/properties/${p.slug}`,
    description: p.description.slice(0, 300),
    address: { "@type": "PostalAddress", addressRegion: p.location },
    ...(p.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: p.currency,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    ...(p.image ? { image: p.image } : {}),
  };
}

export function articleJsonLd(a: {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    ...(a.publishedAt ? { datePublished: a.publishedAt } : {}),
    author: { "@type": "Organization", name: company.name },
    mainEntityOfPage: `${siteUrl}/insights/${a.slug}`,
  };
}
