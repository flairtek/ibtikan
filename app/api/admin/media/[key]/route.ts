import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { getFiles } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });

  const { key } = await params;
  const decoded = decodeURIComponent(key).replace(/^media\//, "");

  const storage = await getFiles();
  const { error } = await storage.from("media").remove([decoded]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
