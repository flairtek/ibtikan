import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { createProject, validateProjectInput } from "@/lib/repo";

export async function POST(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  const errors = validateProjectInput(body);
  if (errors.length > 0)
    return NextResponse.json(
      {
        error: "Validation failed.",
        fieldErrors: Object.fromEntries(errors.map((e) => [e.field, e.message])),
      },
      { status: 400 }
    );
  try {
    const id = await createProject({
      slug: body.slug,
      title: body.title,
      location: body.location ?? "",
      category: body.category || "development",
      status: body.status || "planned",
      description: body.description ?? "",
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      coverImage: body.coverImage || null,
      published: !!body.published,
      sort: Number(body.sort ?? 0) || 0,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "A project with this slug already exists." },
      { status: 409 }
    );
  }
}
