import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { listTeamMembers, updateTeamMember, deleteTeamMember } from "@/lib/repo";
import type { TeamMemberInput } from "@/lib/repo";

interface Ctx {
  params: Promise<{ id: string }>;
}

/** PATCH: edit summary, portrait, publish state or the structured bio of a member. */
export async function PATCH(request: Request, { params }: Ctx) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  const members = await listTeamMembers();
  const member = members.find((m) => m.id === id);
  if (!member) {
    return NextResponse.json({ error: "Member not found." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as
    | (Partial<TeamMemberInput> & { bio?: Record<string, unknown> })
    | null;
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  await updateTeamMember(id, {
    slug: member.slug,
    name: member.name,
    role: member.role,
    summary: typeof body.summary === "string" ? body.summary.slice(0, 2000) : member.summary,
    bio: body.bio && typeof body.bio === "object" ? body.bio : member.bio,
    portrait: body.portrait !== undefined ? body.portrait || null : member.portrait,
    published: typeof body.published === "boolean" ? body.published : member.published,
    sort: member.sort,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id))
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  await deleteTeamMember(id);
  return NextResponse.json({ ok: true });
}
