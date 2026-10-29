import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import {
  updateProperty,
  deleteProperty,
  setPropertyPublished,
  validatePropertyInput,
} from "@/lib/repo";

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
  const errors = validatePropertyInput(body);
  if (errors.length > 0)
    return NextResponse.json(
      {
        error: "Validation failed.",
        fieldErrors: Object.fromEntries(
          errors.map((e) => [e.field, e.message])
        ),
      },
      { status: 400 }
    );

  try {
    await updateProperty(id, {
      ref: body.ref,
      slug: body.slug,
      title: body.title,
      category: body.category,
      transactionType: body.transactionType,
      description: body.description ?? "",
      location: body.location ?? "",
      region: body.region ?? "",
      price: body.price == null || body.price === "" ? null : Number(body.price),
      currency: body.currency || "GHS",
      landArea: body.landArea || null,
      buildingArea: body.buildingArea || null,
      bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
      bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      availability: body.availability || "available",
      featured: !!body.featured,
      published: !!body.published,
      coverImage: body.coverImage || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Update failed — check that the reference and slug are unique." },
      { status: 409 }
    );
  }
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
  await setPropertyPublished(id, !!body.published);
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
  await deleteProperty(id);
  return NextResponse.json({ ok: true });
}
