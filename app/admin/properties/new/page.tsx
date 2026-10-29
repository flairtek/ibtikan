import { PropertyForm } from "@/components/admin/PropertyForm";

export const metadata = { title: "Add property — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default function NewPropertyPage() {
  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Add property</h2>
      <p className="mt-1 text-sm text-muted">
        Enter verified listing information only. New properties start as drafts until you publish them.
      </p>
      <div className="mt-6">
        <PropertyForm />
      </div>
    </div>
  );
}
