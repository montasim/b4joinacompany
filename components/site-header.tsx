import Link from "next/link";
import { headers } from "next/headers";
import { Menu } from "lucide-react";

import { Brand } from "@/components/brand";
import { SignOutButton, UserMenu } from "@/components/user-menu";
import { resolveAdminRole } from "@/lib/admin-session";
import { auth } from "@/lib/auth";

export async function SiteHeader({
  active = "Research",
  purpose
}: {
  active?: "Research" | "Compare" | "Saved" | "Extension" | "Support" | "Method" | "Admin" | "Sign in";
  mode?: "auto" | "public" | "user" | "admin";
  purpose?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const adminRole = resolveAdminRole(session);
  const resolvedMode = adminRole ? "admin" : session ? "user" : "public";
  const workspaceIsAdmin = resolvedMode === "admin";
  const nav =
    resolvedMode === "admin"
      ? [
          ["Admin", "/admin"],
          ["Research", "/"],
          ["Method", "/method"]
        ]
      : [
          ["Research", "/"],
          ["Compare", "/compare"],
          ["Saved", "/saved"],
          ["Extension", "/extension"],
          ["Support", "/support"]
        ];
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto grid min-h-17 w-[calc(100%_-_40px)] max-w-290 grid-cols-[1fr_auto_1fr] items-center gap-7 max-md:w-[calc(100%_-_28px)] max-md:grid-cols-[1fr_auto] max-sm:min-h-15.5">
          <Brand purpose={purpose ?? (resolvedMode === "admin" ? "Evidence review" : undefined)} />
          <nav className="flex gap-1 max-md:hidden" aria-label="Primary navigation">
            {nav.map(([label, href]) => (
              <Link
                key={`${label}-${href}`}
                className={`rounded-lg px-3 py-2 text-xs font-bold no-underline ${
                  active === label
                    ? "bg-jade-soft text-jade-dark"
                    : "text-muted hover:bg-jade-soft hover:text-jade-dark"
                }`}
                href={href}
              >
                {label === "Admin" ? "Review queue" : label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-self-end gap-2.5">
            <div className="flex items-center gap-2.5 max-md:hidden">
              {resolvedMode === "public" ? (
                <Link
                  className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                  href="/auth/sign-in"
                >
                  Sign in
                </Link>
              ) : (
                <>
                  <Link
                    className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3"
                    href={workspaceIsAdmin ? "/admin" : "/saved"}
                  >
                    {workspaceIsAdmin ? "Admin workspace" : "Private workspace"}
                  </Link>
                  <UserMenu
                    name={session?.user.name}
                    workspaceHref={workspaceIsAdmin ? "/admin" : "/saved"}
                    workspaceLabel={workspaceIsAdmin ? "Review queue" : "Private workspace"}
                  />
                </>
              )}
            </div>
            <details className="group relative hidden max-md:block">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-line bg-white text-ink marker:hidden [&_svg]:size-5"
                aria-label="Open navigation"
              >
                <Menu aria-hidden="true" />
              </summary>
              <div className="absolute top-[calc(100%+10px)] right-0 z-80 w-64 overflow-hidden rounded-xl border border-line-strong bg-white p-2 shadow-panel">
                <nav className="grid" aria-label="Mobile navigation">
                  {nav.map(([label, href]) => (
                    <Link
                      className={`rounded-lg px-3 py-3 text-xs font-bold no-underline ${
                        active === label
                          ? "bg-jade-soft text-jade-dark"
                          : "text-muted hover:bg-jade-soft hover:text-jade-dark"
                      }`}
                      href={href}
                      key={`${label}-${href}-mobile`}
                    >
                      {label === "Admin" ? "Review queue" : label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-2 grid gap-1 border-t border-line pt-2">
                  {resolvedMode === "public" ? (
                    <Link
                      className="rounded-lg px-3 py-3 text-xs font-extrabold text-jade-dark no-underline hover:bg-jade-soft"
                      href="/auth/sign-in"
                    >
                      Sign in with Google
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="rounded-lg px-3 py-3 text-xs font-extrabold text-jade-dark no-underline hover:bg-jade-soft"
                        href={workspaceIsAdmin ? "/admin" : "/saved"}
                      >
                        {workspaceIsAdmin ? "Admin workspace" : "Private workspace"}
                      </Link>
                      <SignOutButton className="rounded-lg px-3 py-3 text-left text-xs font-bold text-muted hover:bg-jade-soft hover:text-jade-dark" />
                    </>
                  )}
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
