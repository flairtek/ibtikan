import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { getProjectBySlug, listProperties, listProjects } from "@/lib/repo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PropertyCard } from "@/components/site/PropertyCard";


interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  "under-construction": "Under construction",
  completed: "Completed",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return buildMetadata({
      title: "Project not found",
      description: "This project does not exist or is not published.",
      path: `/projects/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: project.seoTitle ?? `${project.title} — Development Project`,
    description: project.seoDescription ?? `${project.title} in ${project.location || "Ghana"}. ${project.description.slice(0, 140)}`,
    path: `/projects/${project.slug}`,
    ogImage: project.coverImage ?? undefined,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const relatedProperties = await listProperties({ limit: 3 });
  const otherProjects = (await listProjects({ limit: 4 })).filter(
    (p) => p.id !== project.id
  );

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: project.title,
            url: `${siteUrl}/projects/${project.slug}`,
            description: project.description.slice(0, 240),
          },
        ]}
      />
      <div className="relative isolate overflow-hidden bg-navy">
        {project.coverImage && (
          <>
            <Image
              src={project.coverImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40"
            />
          </>
        )}
        <div className="container-site relative py-20">
          <Breadcrumbs items={crumbs} light />
          <p className="eyebrow">
            {STATUS_LABELS[project.status] ?? project.status}
            {project.location ? ` · ${project.location}` : ""}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            {project.title}
          </h1>
        </div>
      </div>

      <section className="section">
        <div className="container-site grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-navy">About this project</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
              {project.description
                .split("\n\n")
                .filter(Boolean)
                .map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
            </div>
            {project.features.length > 0 && (
              <>
                <h2 className="mt-10 font-serif text-2xl text-navy">Project features</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink/85">
                      <span aria-hidden="true" className="mt-0.5 text-gold">▪</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside>
            <div className="card sticky top-24 p-6">
              <h3 className="font-serif text-xl text-navy">Project information</h3>
              <dl className="mt-4 divide-y divide-line">
                {[
                  ["Status", STATUS_LABELS[project.status] ?? project.status],
                  ["Development type", project.category],
                  ["Location", project.location || "Ghana"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between py-2.5">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {label}
                    </dt>
                    <dd className="text-right text-sm capitalize text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/enquire?type=project" className="btn-primary mt-6 w-full">
                Enquire About This Project
              </Link>
            </div>
          </aside>
        </div>
        <div className="container-site mt-12">
          <h2 className="font-serif text-2xl text-navy">Enquire about this project</h2>
          <div className="mt-6 max-w-xl">
            <EnquiryForm
              source={`project:${project.slug}`}
              defaultType="project"
              defaultPropertyRef={project.slug}
            />
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container-site">
          {relatedProperties.length > 0 && (
            <>
              <h2 className="mb-10 font-serif text-3xl text-navy">Related properties</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </>
          )}
          {otherProjects.length > 0 && (
            <>
              <h2 className="mb-10 mt-16 font-serif text-3xl text-navy">More projects</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {otherProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="card p-5 hover:border-archblue"
                  >
                    <p className="font-serif text-lg text-navy">{p.title}</p>
                    <p className="mt-1 text-xs text-muted">{p.location}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
