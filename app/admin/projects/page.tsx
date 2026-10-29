import Link from "next/link";
import { listProjects } from "@/lib/repo";
import { Badge } from "@/components/admin/ui";
import { projectStatusLabel } from "@/lib/brand";

export const metadata = { title: "Project management — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminProjectsPage() {
  const projects = await listProjects({ all: true });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Project management</h2>
          <p className="mt-1 text-sm text-muted">Maintain the development portfolio.</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">Add project</Link>
      </div>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 text-muted">{p.location || "—"}</td>
                <td className="px-4 py-3 text-muted">{projectStatusLabel(p.status)}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.published ? "published" : "draft"}>{p.published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projects/${p.id}`} className="font-semibold text-archblue hover:text-gold">Edit</Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No projects yet — portfolio cards appear only after a real development is entered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
