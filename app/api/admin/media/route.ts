import { NextResponse } from "next/server";
import { guardAdminMutation } from "@/lib/guard";
import { getFiles } from "@/lib/db";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MiB
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const guard = await guardAdminMutation(request);
  if (!guard.ok)
    return NextResponse.json({ error: guard.error }, { status: guard.status });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const alt = String(form?.get("alt") ?? "").slice(0, 200);
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file supplied." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, AVIF or GIF images are accepted." },
      { status: 415 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image is larger than 8 MB." },
      { status: 413 }
    );
  }

  const fileName = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const bytes = await file.arrayBuffer();
  const storage = await getFiles();

  const { error } = await storage.from("media").upload(fileName, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrlData } = storage.from("media").getPublicUrl(fileName);

  return NextResponse.json(
    { ok: true, url: publicUrlData.publicUrl, key: fileName, alt },
    { status: 201 }
  );
}
