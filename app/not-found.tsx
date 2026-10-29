import Link from "next/link";
import { company } from "@/lib/brand";

export const metadata = {
  title: `Page not found | ${company.shortName}`,
  robots: { index: false, follow: false },
};

const LINKS = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["All Properties", "/properties"],
  ["Projects", "/projects"],
  ["Insights", "/insights"],
  ["Contact Us", "/contact"],
] as const;

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-site text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mx-auto mt-3 max-w-xl font-serif text-4xl text-navy sm:text-5xl">
          This page has moved or no longer exists.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you requested could not be found. Try the sitemap below, or
          reach out and we will point you the right way.
        </p>
        <nav aria-label="Helpful links">
          <ul className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-3">
            {LINKS.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-archblue hover:text-archblue"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
