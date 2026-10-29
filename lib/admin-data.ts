import "server-only";
import { getSetting } from "./repo";
import { listAdminEmails } from "./auth";

export { getSetting };

export async function listAdmins(): Promise<string[]> {
  const emails = await listAdminEmails();
  return [...new Set(emails)].sort();
}
