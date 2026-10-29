import Link from "next/link";
import { listProperties } from "@/lib/repo";
import { money, dateTime } from "@/lib/format";
import { Badge } from "@/components/admin/ui";
import { propertyCategoryLabels } from "@/lib/brand";

export const metadata = { title: "Property management — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminPropertiesPage() {
  const properties = await listProperties({ includeUnpublished: true, limit: 200 });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Property management</h2>
          <p className="mt-1 text-sm text-muted">Create, publish and maintain property listings.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          Add property
        </Link>
      </div>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{p.ref}</td>
                <td className="px-4 py-3 font-semibold text-ink">{p.title}</td>
                <td className="px-4 py-3 text-muted">{propertyCategoryLabels[p.category as keyof typeof propertyCategoryLabels] ?? p.category}</td>
                <td className="px-4 py-3 text-muted">{money(p.price, p.currency, p.transactionType)}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.published ? "published" : "draft"}>{p.published ? "Published" : "Draft"}</Badge>
                  {p.featured && <span className="ml-2 font-semibold text-gold" aria-label="Featured">★</span>}
                </td>
                <td className="px-4 py-3 text-xs text-muted">{dateTime(p.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/properties/${p.id}`} className="font-semibold text-archblue hover:text-gold">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No properties yet — add the first listing once verified inventory is supplied.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
