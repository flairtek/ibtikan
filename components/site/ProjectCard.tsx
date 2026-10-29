import Image from "next/image";
import Link from "next/link";
import type { ProjectRecord } from "@/lib/model";

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  "under-construction": "Under construction",
  completed: "Completed",
};

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-navy"
        tabIndex={-1}
        aria-hidden="true"
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-85 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy">
            <span className="font-serif text-2xl text-gold/70">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-gold-600">
            {STATUS_LABELS[project.status] ?? project.status}
          </span>
          {project.location && (
            <span className="text-xs text-muted">{project.location}</span>
          )}
        </div>
        <h3 className="mt-3 font-serif text-xl leading-snug text-navy">
          <Link href={`/projects/${project.slug}`} className="hover:text-archblue">
            {project.title}
          </Link>
        </h3>
        {project.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {project.description}
          </p>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold"
        >
          View project
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
