export type AdminRole = "owner" | "operator";

type RoleIdentity = {
  user: {
    email: string;
    role?: string | null;
  };
};

export function resolveAdminRole(
  session: RoleIdentity | null,
  configuredOwner = process.env.OWNER_EMAIL
): AdminRole | null {
  if (!session) return null;

  const ownerEmail = configuredOwner?.trim().toLowerCase();
  const email = session.user.email.trim().toLowerCase();

  if (ownerEmail && email === ownerEmail) return "owner";
  return session.user.role === "operator" ? "operator" : null;
}
