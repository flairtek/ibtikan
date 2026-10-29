import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/repo";
import { PropertyForm } from "@/components/admin/PropertyForm";
import SpeedDial from "@/components/admin/SpeedDial";
import PublishButton from "@/components/admin/PublishButton";

export const metadata = { title: "Edit property — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);
  const property = Number.isInteger(numericId) ? await getPropertyById(numericId) : null;
  if (!property) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Edit — {property.ref}</h2>
          <p className="mt-1 text-sm text-muted">{property.title}</p>
        </div>
        <div className="flex gap-2">
          <PublishButton kind="properties" id={property.id} published={property.published} />
          <SpeedDial kind="properties" id={property.id} slug={property.slug} />
        </div>
      </div>
      <div className="mt-6">
        <PropertyForm existing={property} />
      </div>
    </div>
  );
}
