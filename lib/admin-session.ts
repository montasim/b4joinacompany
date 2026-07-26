import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { resolveAdminRole } from "@/lib/admin-role";

export { resolveAdminRole, type AdminRole } from "@/lib/admin-role";

export async function getAdminContext() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = resolveAdminRole(session);

  return session && role ? { session, role } : null;
}
