import "server-only";
import { auth } from "@/lib/auth";

/** Treat authentication as an optional enhancement on public pages. */
export async function optionalSession(requestHeaders: Headers) {
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch {
    return null;
  }
}

export async function sessionFrom(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function workspaceActor(request: Request) {
  const session = await sessionFrom(request);
  return session ? { userId: session.user.id, kind: "web" as const } : null;
}
