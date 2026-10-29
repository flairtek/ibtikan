import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { updateTeamMember, createTeamMember, listTeamMembers } from "@/lib/repo";

const SLUG_RE = /^[a-z0-9-]{2,60}$/;

interface TeamBody {
  id?: number;
  slug?: string;
  name?: string;
  role?: string;
  summary?: string;
  bio?: {
    intro?: string;
    education?: { school: string; stage: string }[];
    leadership?: { title: string; text: string }[];
    philosophy?: string;
    vision?: string;
    commitment?: string;
  };
  portrait?: string | null;
  published?: boolean;
  sort?: number;
}

export async function PUT(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = await request.json().catch(() => null) as TeamBody | null;
  if (!body?.id || !Number.isInteger(body.id))
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  const input = validateTeamBody(body);
  if ("error" in input)
    return NextResponse.json({ error: input.error }, { status: 400 });

  const existing = await listTeamMembers();
  if (!existing.some((m) => m.id === body.id))
    return NextResponse.json({ error: "Member not found." }, { status: 404 });

  await updateTeamMember(body.id, input.value);
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const body = await request.json().catch(() => null) as TeamBody | null;
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  const input = validateTeamBody(body);
  if ("error" in input)
    return NextResponse.json({ error: input.error }, { status: 400 });
  try {
    const id = await createTeamMember(input.value);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "A member with this slug already exists." },
      { status: 409 }
    );
  }
}

function validateTeamBody(
  body: TeamBody
): { value: Parameters<typeof updateTeamMember>[1] } | { error: string } {
  if (!body.name || body.name.trim().length < 2)
    return { error: "Name is required." };
  if (!body.slug || !SLUG_RE.test(body.slug))
    return { error: "Slug must be lowercase letters, numbers and dashes." };
  return {
    value: {
      slug: body.slug,
      name: body.name.trim(),
      role: (body.role ?? "").trim() || "Team Member",
      summary: (body.summary ?? "").slice(0, 1000),
      bio: body.bio ?? {},
      portrait: body.portrait || null,
      published: !!body.published,
      sort: Number(body.sort ?? 0) || 0,
    },
  };
}
