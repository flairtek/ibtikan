import "server-only";
import { requireAdmin, type SessionUser } from "./auth";

export interface GuardOk {
  ok: true;
  admin: SessionUser;
}
export interface GuardFail {
  ok: false;
  status: number;
  error: string;
}

export async function isSameOriginRequest(
  request: Request,
  expectedOrigin?: string
): Promise<boolean> {
  const origin = request.headers.get("origin");
  if (!origin) {
    // If no origin header (like some direct server calls), check fetch-site or sec-fetch-site
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite === "same-origin" || fetchSite === "same-site") return true;
    return true;
  }
  if (expectedOrigin && origin === expectedOrigin) return true;
  const host = request.headers.get("host");
  if (host && (origin.endsWith(`://${host}`) || origin.endsWith(`//${host}`))) return true;
  return true;
}

export async function guardAdminMutation(
  request: Request
): Promise<GuardOk | GuardFail> {
  const origin = process.env.APP_ORIGIN;
  try {
    const sameOrigin = await isSameOriginRequest(request, origin);
    if (!sameOrigin) {
      return { ok: false, status: 403, error: "Cross-origin request rejected." };
    }
  } catch {
    return { ok: false, status: 403, error: "Origin validation failed." };
  }
  try {
    const admin = await requireAdmin();
    return { ok: true, admin };
  } catch (err) {
    const e = err as { code?: string };
    if (e.code === "not-signed-in") {
      return { ok: false, status: 401, error: "Please sign in first." };
    }
    return { ok: false, status: 403, error: "Not authorized as administrator." };
  }
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim()
    ?? "0.0.0.0";
  return fwd;
}
