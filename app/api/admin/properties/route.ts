import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { createProperty, validatePropertyInput } from "@/lib/repo";

export async function POST(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = await request.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  const errors = validatePropertyInput(body);
  if (errors.length > 0)
    return NextResponse.json({ error: "Validation failed.", fieldErrors: Object.fromEntries(errors.map((e) => [e.field, e.message])) }, { status: 400 });
  try {
    const id = await createProperty({
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
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    const e = String(err);
    if (e.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "A property with this reference or slug already exists." },
        { status: 409 }
      );
    }
    throw err;
  }
}
