import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import { auth } from "@/lib/auth";
import { destinationForSession, safeAuthNext } from "@/lib/auth-routing";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(destinationForSession(session, params.next));

  const next = safeAuthNext(params.next);
  const callbackURL = `/auth/continue?next=${encodeURIComponent(next)}`;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  return <AuthShell callbackURL={callbackURL} error={error} />;
}
