import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ProjectCard } from "@/components/site/ProjectCard";
import { EmptyState } from "@/components/site/EmptyState";
import { CtaBand } from "@/components/site/CtaBand";
import { listProjects } from "@/lib/repo";
import { media } from "@/lib/brand";


export const generateMetadata = (): Metadata =>
  buildMetadata({
    title: "Projects & Developments in Ghana",
    description:
      "Development projects by Ibtikan Ibn Adams Properties Limited — planned updates on residential and commercial developments in Ghana.",
    path: "/projects",
  });

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <>
      <PageHero
        title="Projects & Developments"
        lede="Company developments published with verified information."
        image={media.buildingLight}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />

      <section className="section">
        <div className="container-site">
          {projects.length === 0 ? (
            <EmptyState
              title="The portfolio grows with each verified project"
              text="Projects appear here with their location, development type, status and related properties once their information has been confirmed. The company develops land, residential and community projects across Ghana — enquiries about current and upcoming developments are welcome."
              actions={[
                { label: "Enquire About Projects", href: "/enquire?type=project" },
                { label: "Property Development", href: "/property-development" },
              ]}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Interested in a project?"
        text="Enquire about current developments or a future opportunity."
        actions={[
          { label: "Enquire Now", href: "/enquire?type=project", style: "primary" },
          { label: "Contact Us", href: "/contact", style: "outline" },
        ]}
      />
    </>
  );
}
