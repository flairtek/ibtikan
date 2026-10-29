import Link from "next/link";
import { listEnquiries } from "@/lib/repo";
import EnquiryRow from "@/components/admin/EnquiryRow";
import { enquiryStatuses } from "@/lib/brand";
import { dateTime } from "@/lib/format";

export const metadata = { title: "Enquiry management — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status: statusParam } = await searchParams;
  const status = enquiryStatuses.find((s) => s === statusParam);
  const enquiries = await listEnquiries(status);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Enquiry management</h2>
          <p className="mt-1 text-sm text-muted">Every enquiry is private — only authorised administrators can read this inbox.</p>
        </div>
        <nav aria-label="Status filter" className="flex flex-wrap gap-2">
          <Link href="/admin/enquiries" className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${!status ? "border-gold bg-gold-100 text-navy" : "border-line text-muted hover:text-navy"}`}>
            All
          </Link>
          {enquiryStatuses.map((s) => (
            <Link
              key={s}
              href={`/admin/enquiries?status=${encodeURIComponent(s)}`}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${status === s ? "border-gold bg-gold-100 text-navy" : "border-line text-muted hover:text-navy"}`}
            >
              {s}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-6 grid gap-4">
        {enquiries.map((enq) => (
          <article key={enq.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {enq.type} · {dateTime(enq.createdAt)} · {enq.source === "api" ? "website form" : enq.source}
                </p>
                <h3 className="mt-1 font-serif text-lg font-bold text-navy">{enq.name}</h3>
              </div>
              {enq.propertyRef && (
                <span className="rounded-md bg-ivory px-3 py-1 text-xs font-semibold text-navy">Property: {enq.propertyRef}</span>
              )}
            </div>
            <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
              <p><strong className="font-semibold text-navy">Email:</strong>{" "}<a className="text-archblue hover:text-gold" href={`mailto:${enq.email}`}>{enq.email}</a></p>
              {enq.phone && (
                <p><strong className="font-semibold text-navy">Phone:</strong>{" "}<a className="text-archblue hover:text-gold" href={`tel:${enq.phone.replace(/[^+\d]/g, "")}`}>{enq.phone}</a></p>
              )}
              <p><strong className="font-semibold text-navy">Preferred contact:</strong> {enq.preferredContact}</p>
              {enq.country && <p><strong className="font-semibold text-navy">Country:</strong> {enq.country}</p>}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-ink">{enq.message}</p>
            <div className="mt-4 flex justify-end">
              <EnquiryRow id={enq.id} status={enq.status as (typeof enquiryStatuses)[number]} />
            </div>
          </article>
        ))}
        {enquiries.length === 0 && (
          <p className="card p-10 text-center text-muted">No enquiries in this view yet.</p>
        )}
      </div>
    </div>
  );
}
