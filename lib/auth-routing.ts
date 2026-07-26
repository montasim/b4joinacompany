import "server-only";

import type { Session } from "@/lib/auth";
import { safeAuthNext } from "@/lib/auth-next";

export { safeAuthNext } from "@/lib/auth-next";

export function destinationForSession(
  _session: Session,
  requestedNext: string | string[] | undefined
) {
  return safeAuthNext(requestedNext);
}
