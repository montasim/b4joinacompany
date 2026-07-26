import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function requirePageSession(next: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/auth/sign-in?next=${encodeURIComponent(next)}`);
  }
  return session;
}
