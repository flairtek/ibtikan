import { CONTENT_KEYS, getPageContent } from "@/lib/content";
import ContentEditor from "@/components/admin/ContentEditor";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { listArticles } from "@/lib/repo";

export const metadata = { title: "Pages & articles — Ibtikan Ibn Adams Properties", robots: { index: false, follow: false } };

export default async function AdminPagesPage() {
  type Block = { label: string; description: string; defaults: string; current: string };
  const keys: [string, Block][] = await Promise.all(
    Object.entries(CONTENT_KEYS).map(async ([key, def]) => [key, { ...def, current: await getPageContent(key) }])
  );
  const articles = await listArticles(false);

  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy">Pages & articles</h2>
      <p className="mt-1 text-sm text-muted">
        Edit the introductory copy on selected public pages, and manage Insight articles and drafts.
      </p>
      <div className="mt-6">
        <ContentEditor keys={keys} />
      </div>
      <div className="mt-12">
        <h3 className="font-serif text-xl text-navy">Insight articles</h3>
        <p className="mt-1 text-sm text-muted">
          Drafts stay hidden from the public site until they are published. Articles must be factual, original and reviewed by the company.
        </p>
        <div className="mt-6">
          <ArticleEditor articles={articles} />
        </div>
      </div>
    </div>
  );
}
