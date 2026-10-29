import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { upsertArticle, deleteArticle, validateArticleSlug } from "@/lib/repo";

interface ArticleBody {
  id?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  status?: string;
  action?: "delete";
}


export async function PUT(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = (await request.json().catch(() => null)) as ArticleBody | null;
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  if (body.action === "delete") {
    if (!Number.isInteger(body.id))
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    await deleteArticle(body.id as number);
    return NextResponse.json({ ok: true });
  }

  const slug = (body.slug ?? "").trim();
  const title = (body.title ?? "").trim();
  if (!validateArticleSlug(slug))
    return NextResponse.json(
      { error: "Slug must be lowercase letters, numbers and dashes." },
      { status: 400 }
    );
  if (title.length < 4)
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  const status = body.status === "published" ? "published" : "draft";
  const id = await upsertArticle({
    slug,
    title,
    excerpt: (body.excerpt ?? "").slice(0, 1000),
    body: (body.body ?? "").slice(0, 100000),
    status,
  });
  return NextResponse.json({ ok: true, id });
}
