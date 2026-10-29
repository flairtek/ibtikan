import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { setSetting, getSetting } from "@/lib/repo";
import { addAdminEmail, removeAdminEmail } from "@/lib/auth";

export async function GET(request: Request) {
  const guard = await guardAdminMutation(new Request(request.url, { headers: request.headers }));
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  const notificationEmail = await getSetting<string>(
    "site.notificationEmail",
    "info@ibtikanproperties.com"
  );
  return NextResponse.json({ notificationEmail });
}

export async function PUT(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });

  const body = (await request.json().catch(() => null)) as {
    notificationEmail?: string;
    addAdmin?: string[];
    removeAdmin?: string[];
  } | null;
  if (!body) return NextResponse.json({ error: "Invalid body." }, { status: 400 });

  if (body.notificationEmail !== undefined) {
    const email = body.notificationEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Notification email is not a valid email address." },
        { status: 400 }
      );
    }
    await setSetting("site.notificationEmail", email);
  }
  for (const email of body.addAdmin ?? []) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      await addAdminEmail(email);
    }
  }
  for (const email of body.removeAdmin ?? []) {
    await removeAdminEmail(email);
  }
  return NextResponse.json({ ok: true });
}
