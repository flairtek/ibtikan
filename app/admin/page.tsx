import Link from "next/link";
import {
  countProperties,
  countProjects,
  listEnquiries,
  listArticles,
  listProperties,
} from "@/lib/repo";


export default async function AdminDashboardPage() {
  const [allCount, allProperties, projectCount, enquiries, articles] =
    await Promise.all([
      countProperties({ includeUnpublished: true }),
      listProperties({ includeUnpublished: true }),
      countProjects(false),
      listEnquiries(),
      listArticles(false),
    ]);
  const publishedCount = allProperties.filter((p) => p.published).length;

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const cards = [
    {
      label: "Properties",
      value: `${allCount}`,
      sub: `${publishedCount} published`,
      href: "/admin/properties",
    },
    {
      label: "Projects",
      value: `${projectCount}`,
      sub: "all statuses",
      href: "/admin/projects",
    },
    {
      label: "Enquiries",
      value: `${enquiries.length}`,
      sub: `${newEnquiries} awaiting action`,
      href: "/admin/enquiries",
    },
    {
      label: "Articles",
      value: `${articles.length}`,
      sub: `${articles.filter((a) => a.status === "published").length} published · ${
        articles.filter((a) => a.status === "draft").length
      } drafts`,
      href: "/admin/pages",
    },
  ];

  return (
    <div>
      <h2 className="font-serif text-2xl text-navy">Dashboard</h2>
      <p className="mt-2 text-sm text-muted">
        Manage the website content, review enquiries and publish verified
        information.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-line bg-ivory p-6 transition-colors hover:border-archblue"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {c.label}
            </p>
            <p className="mt-2 font-serif text-3xl text-navy">{c.value}</p>
            <p className="mt-1 text-xs text-muted">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-serif text-xl text-navy">Editor&apos;s checklist</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>• Use <strong>Properties</strong> to add verified listings, upload images, and publish them.</li>
          <li>• Review new enquiries in <strong>Enquiries</strong>; update their status as you respond.</li>
          <li>• Refine page copy in <strong>Pages &amp; Articles</strong> — the homepage and About text are editable without a release.</li>
          <li>• Complete the company media in <strong>Media</strong>: logo files and the CEO portrait remain pending company approval.</li>
          <li>• Set the enquiry notification inbox in <strong>Settings</strong> (email sending requires RESEND_API_KEY in Sites → Secrets).</li>
        </ul>
      </div>
    </div>
  );
}
