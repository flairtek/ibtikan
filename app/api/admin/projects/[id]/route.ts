import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { updateProject, deleteProject, setProjectPublished, validateProjectInput } from "@/lib/repo";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Ctx) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
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
  await updateProject(id, {
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
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: Ctx) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  const body = (await request.json().catch(() => ({}))) as { published?: boolean };
  await setProjectPublished(id, !!body.published);
  return NextResponse.json({ ok: true, published: !!body.published });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
