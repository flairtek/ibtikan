import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/repo";
import { ProjectForm } from "@/components/admin/ProjectForm";
import SpeedDial from "@/components/admin/SpeedDial";
import PublishButton from "@/components/admin/PublishButton";

export const metadata = { title: "Edit project — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const project = Number.isInteger(numericId) ? await getProjectById(numericId) : null;
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Edit — {project.title}</h2>
          <p className="mt-1 text-sm text-muted">/{project.slug}</p>
        </div>
        <div className="flex gap-2">
          <PublishButton kind="projects" id={project.id} published={project.published} />
          <SpeedDial kind="projects" id={project.id} slug={project.slug} />
        </div>
      </div>
      <div className="mt-6"><ProjectForm existing={project} /></div>
    </div>
  );
}
