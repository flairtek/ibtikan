import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { setSetting } from "@/lib/repo";
import { CONTENT_KEYS } from "@/lib/content";

export async function PUT(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = (await request.json().catch(() => null)) as
    | { entries?: Record<string, string> }
    | null;
  if (!body?.entries || typeof body.entries !== "object")
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  for (const [key, value] of Object.entries(body.entries)) {
    if (!(key in CONTENT_KEYS)) {
      return NextResponse.json(
        { error: `Unknown content key: ${key}` },
        { status: 400 }
      );
    }
    if (typeof value !== "string" || value.length > 20000) {
      return NextResponse.json(
        { error: `Value for ${key} is too long or invalid.` },
        { status: 400 }
      );
    }
    await setSetting(`content:${key}`, value);
  }
  return NextResponse.json({ ok: true });
}
