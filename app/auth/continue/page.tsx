import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { destinationForSession } from "@/lib/auth-routing";

export default async function AuthContinuePage({
  searchParams
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    const next = Array.isArray(params.next) ? params.next[0] : params.next;
    const target = new URLSearchParams();
    if (next) target.set("next", next);
    target.set("error", "Google sign-in did not complete. Try again.");
    redirect(`/auth/sign-in?${target.toString()}`);
  }

  redirect(destinationForSession(session, params.next));
}
