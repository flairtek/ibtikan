"use client";

import Link from "next/link";
import { company } from "@/lib/brand";
import { Logo } from "./Logo";

function year() {
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-5 text-sm leading-relaxed">
            A Ghana-focused real estate company dedicated to responsible
            property development, land sales, residential housing, commercial
            properties and investment opportunities.
          </p>
          <p className="mt-4 text-sm font-semibold text-gold">{company.motto}</p>
          <p className="mt-1 text-sm italic text-white/70">{company.vision}.</p>
        </div>

        <nav aria-label="Company">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["About Us", "/about"],
              ["Leadership", "/about/leadership"],
              ["CEO Profile", "/about/ceo"],
              ["Projects", "/projects"],
              ["Insights", "/insights"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Properties and services">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Properties &amp; Services
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {([
              ["All Properties", "/properties"],
              ["Land for Sale", "/land-sales"],
              ["Residential Properties", "/residential-properties"],
              ["Luxury Homes", "/luxury-homes"],
              ["Commercial Properties", "/commercial-properties"],
              ["Gated Communities", "/gated-communities"],
              ["Property Development", "/property-development"],
              ["Property Management", "/property-management"],
              ["Investment Opportunities", "/investment-opportunities"],
              ["Diaspora Investment", "/diaspora-investment"],
            ] as [string, string][]).map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-white">
                {company.email}
              </a>
            </li>
            <li>
              <a href={company.phoneHref} className="hover:text-white">
                {company.phoneDisplay}
              </a>
            </li>
            <li>{company.location}</li>
          </ul>
          <Link href="/enquire" className="btn-primary mt-6 w-full sm:w-auto">
            Enquire Now
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>
            © {year()} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
