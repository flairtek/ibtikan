import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { listArticles, listProjects, listProperties } from "@/lib/repo";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

function page(
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency = "monthly"
): MetadataRoute.Sitemap[number] {
  return { url: `${siteUrl}${path}`, priority, changeFrequency };
}

/** Static public routes. Admin, API and auth routes are intentionally excluded. */
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  page("/", 1.0, "weekly"),
  page("/about", 0.8),
  page("/about/leadership", 0.7),
  page("/about/ceo", 0.8),
  page("/properties", 1.0, "weekly"),
  page("/land-sales", 0.9, "weekly"),
  page("/residential-properties", 0.9, "weekly"),
  page("/commercial-properties", 0.9, "weekly"),
  page("/luxury-homes", 0.9, "weekly"),
  page("/gated-communities", 0.9, "weekly"),
  page("/property-development", 0.8),
  page("/property-management", 0.8),
  page("/investment-opportunities", 0.9),
  page("/diaspora-investment", 0.9),
  page("/projects", 0.9, "weekly"),
  page("/insights", 0.8, "weekly"),
  page("/contact", 0.7),
  page("/enquire", 0.7),
  page("/privacy-policy", 0.3, "yearly"),
  page("/terms", 0.3, "yearly"),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamic: MetadataRoute.Sitemap = [];

  // Published database content only — unpublished records are never listed.
  // If the database is unavailable, the static routes are still returned.
  try {
    const [properties, projects, articles] = await Promise.all([
      listProperties({ limit: 500 }),
      listProjects({ limit: 200 }),
      listArticles(true),
    ]);

    for (const p of properties) {
      dynamic.push({
        url: `${siteUrl}/properties/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        priority: 0.9,
        changeFrequency: "weekly",
      });
    }
    for (const pr of projects) {
      dynamic.push({
        url: `${siteUrl}/projects/${pr.slug}`,
        priority: 0.8,
        changeFrequency: "weekly",
      });
    }
    for (const a of articles) {
      dynamic.push({
        url: `${siteUrl}/insights/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
        priority: 0.6,
        changeFrequency: "monthly",
      });
    }
  } catch {
    // Database not reachable — serve the static route list only.
  }

  return [...STATIC_ROUTES, ...dynamic];
}
