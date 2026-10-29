import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { media, company } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Privacy Policy",
    description: "How Ibtikan Ibn Adams Properties Limited handles the information you share through this website.",
    path: "/privacy-policy",
  });

// This legal copy is a draft pending company review before final publication.
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        lede="How we collect, use and protect the information you share with us."
        image={media.hallway}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          <div className="prose-articles mx-auto max-w-3xl">
            <div className="mb-10 rounded-lg border border-gold/40 bg-gold-100/60 px-5 py-4 text-sm text-ink/80">
              <strong>Draft for company review.</strong> This page presents the
              company&apos;s intended privacy practices and must be reviewed and
              approved by {company.name} before publication in its final form.
            </div>

            <h2>1. Who we are</h2>
            <p>
              {company.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the
              website https://www.ibtikanproperties.com from {company.location}.
              Questions about this policy can be sent to {company.email} or
              posted to us in Accra via {company.phoneDisplay}.
            </p>

            <h2>2. Information collected through this website</h2>
            <p>
              Our enquiry and contact forms collect the information you choose to
              provide: your name, email address, telephone number, enquiry type,
              a property reference where relevant, your country of residence (on
              the diaspora page), your preferred contact method, your message,
              and your consent to be contacted.
            </p>
            <p>
              Separately, hosting infrastructure may process standard technical
              records (such as IP address and request logs) for security and
              rate-limiting purposes. We keep such records in hashes or aggregate
              form and do not use them for marketing.
            </p>

            <h2>3. Purposes of collection</h2>
            <ul>
              <li>Responding to your enquiry and managing our relationship with you.</li>
              <li>Matching your stated requirements to verified property information.</li>
              <li>Improving the website and guarding against spam or abuse.</li>
              <li>Meeting legal, accounting or regulatory obligations where they apply.</li>
            </ul>

            <h2>4. Handling of customer enquiries</h2>
            <p>
              Enquiries are stored securely and visible only to authorised
              company staff and administrators. Enquiry content is never
              published or shared publicly. Sign-in to the website&apos;s
              administrative area uses a third-party account service
              (&ldquo;Sign in with Freebuff&rdquo;) which processes standard
              authentication data according to its own terms.
            </p>

            <h2>5. Data retention and security</h2>
            <p>
              We keep enquiry records only as long as useful for the purposes
              above and applicable law; when enquiries are closed, they are
              retained in a reduced record and can be deleted on request. We use
              hosting and access controls, including restricted administrative
              access and rate-limiting of public forms, to protect personal data.
            </p>

            <h2>6. Your rights and choices</h2>
            <p>
              You may ask us to access, correct, or delete the personal data we
              hold about you, object to contact, or withdraw consent — simply
              email {company.email}. We will act on verified requests within a
              reasonable period.
            </p>

            <h2>7. Third-party services</h2>
            <p>
              This website is hosted on managed infrastructure and sends
              administrative email through email-delivery providers. Image
              delivery may pass through content networks. Administrative sign-in
              uses Sign in with Freebuff. These providers process data only to
              deliver their service to us. Our site may embed or link to third
              party pages whose privacy practices are governed by those pages.
            </p>

            <h2>8. Changes to this policy</h2>
            <p>
              We may update this policy as our practices evolve; the current
              version always lives on this page.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Questions about your privacy?"
        text={`Write to ${company.email} — we take every request seriously.`}
        actions={[
          { label: "Contact Us", href: "/contact", style: "primary" },
          { label: "Terms & Conditions", href: "/terms", style: "outline" },
        ]}
      />
    </>
  );
}
