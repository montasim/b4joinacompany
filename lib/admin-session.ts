import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type AdminRole = "owner" | "operator";

export async function getAdminContext() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const configuredOwner = (
    process.env.OWNER_EMAIL ?? "montasimmamun@gmail.com"
  ).toLowerCase();
  const storedRole = String(
    (session.user as typeof session.user & { role?: string }).role ?? "user"
  );
  const role: AdminRole | null =
    session.user.email.toLowerCase() === configuredOwner
      ? "owner"
      : storedRole === "operator"
        ? "operator"
        : null;

  return role ? { session, role } : null;
}
