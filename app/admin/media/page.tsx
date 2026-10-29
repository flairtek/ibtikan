import { getFiles } from "@/lib/db";
import MediaManager from "@/components/admin/MediaManager";

export const metadata = { title: "Media library — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminMediaPage() {
  let items: { key: string; size: number; uploadedAt: string }[] = [];
  try {
    const storage = await getFiles();
    const { data } = await storage.from("media").list();
    items = (data || [])
      .filter((o) => o.name && !o.name.startsWith("."))
      .map((o) => ({
        key: o.name,
        size: o.metadata?.size || 0,
        uploadedAt: o.created_at || new Date().toISOString(),
      }))
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  } catch {
    items = [];
  }

  return (
    <div className="max-w-4xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Media library</h2>
      <p className="mt-1 text-sm text-muted">
        Company photography and approved portraits. Copy an item&apos;s URL and paste it into any cover-image or portrait field.
      </p>
      <div className="mt-6">
        <MediaManager initialItems={items} />
      </div>
    </div>
  );
}
