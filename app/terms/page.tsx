import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { media, company } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Terms & Conditions",
    description: "Terms and conditions for the use of the Ibtikan Ibn Adams Properties Limited website.",
    path: "/terms",
  });

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms & Conditions"
        lede="The terms that govern your use of this website."
        image={media.interior}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms", path: "/terms" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          <div className="prose-articles mx-auto max-w-3xl">
            <div className="mb-10 rounded-lg border border-gold/40 bg-gold-100/60 px-5 py-4 text-sm text-ink/80">
              <strong>Draft for company review.</strong> These terms must be
              reviewed and approved by {company.name} before publication in
              final form.
            </div>

            <h2>1. Acceptable use</h2>
            <p>
              You may use this website to learn about and enquire regarding our
              property services. You agree not to use the website: to send spam
              or automated bulk enquiries; to attempt to access administrative
              areas, databases or other users&apos; data; to scrape or republish
              substantial parts of the content without permission; or in any
              unlawful manner.
            </p>

            <h2>2. Website content and intellectual property</h2>
            <p>
              Unless stated otherwise, the text, layout, branding and design of
              this site belong to {company.name}. Where the site displays
              illustrative photography while the company&apos;s own media is being
              prepared, those images are licensed placeholders and do not depict
              actual company properties. You may view and download content for
              personal, non-commercial use only.
            </p>

            <h2>3. Property information disclaimers</h2>
            <p>
              Property details, prices, sizes and availability are supplied in
              good faith and may change without notice. Nothing on this website
              constitutes professional legal, tax or financial advice, nor a
              warranty of the legal status of any property. Do not rely on this
              website alone in a purchase decision — commission independent,
              qualified professionals. The company makes no guarantee of rental
              income, capital appreciation or investment returns.
            </p>

            <h2>4. Enquiries and communication</h2>
            <p>
              Submitting an enquiry gives the company permission to store it and
              contact you about it, per the Privacy Policy. Please do not send
              documents you consider sensitive through the public forms; we will
              arrange secure channels where needed.
            </p>

            <h2>5. Third-party services</h2>
            <p>
              The website relies on hosting, database, sign-in and email
              providers. Their availability is outside the company&apos;s control and
              subject to their own terms.
            </p>

            <h2>6. Liability</h2>
            <p>
              To the extent permitted by law, the company excludes liability for
              losses arising from reliance on website content, and from
              interruptions or errors in the website&apos;s availability, except
              where such exclusion is not legally permissible.
            </p>

            <h2>7. Governing law</h2>
            <p>
              Use of this website is governed by the laws of the Republic of
              Ghana. The company&apos;s registered office details are available on
              request via {company.email} — they are published here only after
              the company confirms them for display.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Questions about these terms?"
        actions={[
          { label: "Contact Us", href: "/contact", style: "primary" },
          { label: "Privacy Policy", href: "/privacy-policy", style: "outline" },
        ]}
      />
    </>
  );
}
