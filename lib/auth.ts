import "server-only";
import { supabase } from "./supabase";

export interface SessionUser {
  sub: string;
  email?: string;
  name?: string;
}

/** Signed-in visitor from the Supabase session, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    sub: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.user_metadata?.full_name,
  };
}

/* ------------------------------------------------------------------ */
/* Admin authorization                                                 */
/* ------------------------------------------------------------------ */

const AUTH_ERROR = {
  "not-signed-in": "Please sign in first.",
  "not-admin": "This account is not authorized as an administrator.",
} as const;

export class AuthError extends Error {
  code: keyof typeof AUTH_ERROR;
  status: number;
  constructor(code: keyof typeof AUTH_ERROR, status = 403) {
    super(AUTH_ERROR[code]);
    this.code = code;
    this.status = status;
  }
}

export function adminEmailsFromEnv(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));
}

export async function listAdminEmails(): Promise<string[]> {
  const envAdmins = adminEmailsFromEnv();
  const { data } = await supabase.from("admins").select("email");
  const dbAdmins = (data || []).map((r: { email: string }) => r.email?.toLowerCase()).filter(Boolean);
  return Array.from(new Set([...envAdmins, ...dbAdmins]));
}

export async function addAdminEmail(email: string): Promise<void> {
  const trimmed = email.trim().toLowerCase();
  await supabase.from("admins").insert({ email: trimmed, name: trimmed, slug: trimmed, role: "Administrator" });
}

export async function removeAdminEmail(email: string): Promise<void> {
  const trimmed = email.trim().toLowerCase();
  await supabase.from("admins").delete().eq("email", trimmed);
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError("not-signed-in", 401);
  if (!user.email) throw new AuthError("not-admin", 403);

  if (adminEmailsFromEnv().includes(user.email.toLowerCase())) return user;

  const { data, error } = await supabase
    .from("admins")
    .select("email")
    .eq("email", user.email.toLowerCase())
    .single();

  if (error || !data) {
    throw new AuthError("not-admin", 403);
  }
  return user;
}

export async function currentAdmin(): Promise<SessionUser | null> {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}
