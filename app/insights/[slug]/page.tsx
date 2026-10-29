import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getArticleBySlug, listArticles } from "@/lib/repo";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";


interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({
      title: "Article not found",
      description: "This article does not exist or is not published.",
      path: `/insights/${slug}`,
      noindex: true,
    });
  }
  return buildMetadata({
    title: article.title,
    description: article.excerpt.slice(0, 160),
    path: `/insights/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = (await listArticles(true))
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: article.title, path: `/insights/${article.slug}` },
  ];

  return (
    <>
      <JsonLd data={[articleJsonLd(article), breadcrumbJsonLd(crumbs)]} />
      <div className="bg-navy py-16">
        <div className="container-site">
          <Breadcrumbs items={crumbs} light />
          {article.publishedAt && (
            <p className="eyebrow">{formatDate(article.publishedAt)}</p>
          )}
          <h1 className="mt-3 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 max-w-2xl text-white/70">{article.excerpt}</p>
          )}
        </div>
      </div>

      <article className="section">
        <div className="container-site">
          <div className="prose-articles mx-auto max-w-3xl">
            {article.body
              .split("\n\n")
              .map((para) =>
                para.startsWith("## ") ? (
                  <h2
                    key={para.slice(0, 24)}
                    className="mt-10 mb-4 font-serif text-2xl text-navy"
                  >
                    {para.replace(/^##\s+/, "")}
                  </h2>
                ) : para.startsWith("### ") ? (
                  <h3
                    key={para.slice(0, 24)}
                    className="mt-8 mb-3 font-serif text-xl text-navy"
                  >
                    {para.replace(/^###\s+/, "")}
                  </h3>
                ) : (
                  <p key={para.slice(0, 24)}>
                    {para.replace(/^-\s+/gm, "• ")}
                  </p>
                )
              )}
          </div>
          <p className="prose-articles mx-auto mt-10 max-w-3xl rounded-lg border border-line bg-ivory p-4 text-xs text-muted">
            This article is general educational information from {`Ibtikan Ibn
            Adams Properties Limited`}, not professional legal, tax or financial
            advice. Property decisions should always be supported by independent,
            qualified professionals.
          </p>
          {related.length > 0 && (
            <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
              {related.map((a) => (
                <Link key={a.id} href={`/insights/${a.slug}`} className="card p-6 hover:border-archblue">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    Keep reading
                  </p>
                  <p className="mt-2 font-serif text-lg text-navy">{a.title}</p>
                </Link>
              ))}
            </div>
          )}
          <p className="mt-12 text-center">
            <Link href="/insights" className="btn-outline-navy">
              ← All insights
            </Link>
          </p>
        </div>
      </article>

      <CtaBand
        title="Questions about property in Ghana?"
        actions={[
          { label: "Contact Us", href: "/contact", style: "primary" },
          { label: "Explore Properties", href: "/properties", style: "outline" },
        ]}
      />
    </>
  );
}
