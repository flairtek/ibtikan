import { getFiles } from "@/lib/db";

interface RouteCtx {
  params: Promise<{ key: string }>;
}

export async function GET(_request: Request, { params }: RouteCtx) {
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  try {
    const storage = await getFiles();
    const { data: publicUrlData } = storage.from("media").getPublicUrl(decoded);
    return Response.redirect(publicUrlData.publicUrl, 302);
  } catch {
    return new Response("Media unavailable", { status: 503 });
  }
}
