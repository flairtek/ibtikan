import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "Add project — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Add project</h2>
      <p className="mt-1 text-sm text-muted">Enter verified development information only.</p>
      <div className="mt-6"><ProjectForm /></div>
    </div>
  );
}
