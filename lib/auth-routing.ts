import "server-only";

import type { Session } from "@/lib/auth";
import { resolveAdminRole } from "@/lib/admin-session";
import { safeAuthNext } from "@/lib/auth-next";

export { safeAuthNext } from "@/lib/auth-next";

export function destinationForSession(
  session: Session,
  requestedNext: string | string[] | undefined
) {
  if (resolveAdminRole(session)) return "/admin";
  return safeAuthNext(requestedNext);
}
