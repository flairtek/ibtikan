import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { setEnquiryStatus, deleteEnquiry } from "@/lib/repo";

const STATUSES = ["new", "opened", "responded", "closed"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !STATUSES.includes(body.status))
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  await setEnquiryStatus(id, body.status);
  return NextResponse.json({ ok: true, status: body.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  await deleteEnquiry(id);
  return NextResponse.json({ ok: true });
}
