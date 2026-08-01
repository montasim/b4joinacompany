import Link from "next/link";
import { headers } from "next/headers";

import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/user-menu";
import { optionalSession } from "@/lib/session";

type HeaderPage =
  | "Research"
  | "Compare"
  | "Saved"
  | "Extension"
  | "Support"
  | "Method"
  | "Sign in";

export async function SiteHeader({
  active = "Research",
  mode = "auto"
}: {
  active?: HeaderPage;
  mode?: "auto" | "public" | "user";
  purpose?: string;
}) {
  const isAuthenticated =
    mode === "user" ||
    (mode === "auto" && Boolean(await optionalSession(await headers())));
  const nav: Array<[HeaderPage, string, string]> = [
    ["Research", "/", "Research"],
    ["Compare", "/compare", "Compare"],
    ["Saved", "/saved", "Saved"],
    ["Extension", "/extension", "Extension"],
    ["Support", "/support", "Support"]
  ];

  return (
    <>
      <a
        className="fixed top-2 left-2 z-100 -translate-y-[160%] rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white no-underline transition-transform focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="mx-auto grid min-h-16 w-[calc(100%_-_40px)] max-w-280 grid-cols-[1fr_auto_1fr] items-center gap-6 max-md:w-[calc(100%_-_28px)] max-md:grid-cols-[1fr_auto]">
          <Brand />

          <nav className="flex items-center gap-0.5 max-md:hidden" aria-label="Primary navigation">
            {nav.map(([key, href, label]) => (
              <Link
                aria-current={active === key ? "page" : undefined}
                className={`rounded-lg px-3 py-2.25 text-xs font-bold no-underline ${
                  active === key
                    ? "bg-jade-soft text-jade-dark"
                    : "text-muted hover:bg-jade-soft hover:text-jade-dark"
                }`}
                href={href}
                key={key}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-3.5">
            <div className="flex items-center gap-3.5 max-md:hidden">
              {!isAuthenticated ? (
                <Link
                  className="text-xs font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
                  href="/auth/sign-in"
                >
                  Sign in
                </Link>
              ) : (
                <>
                  <Link
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-jade-dark underline decoration-jade/30 underline-offset-3"
                    href="/saved"
                  >
                    Private workspace
                  </Link>
                  <SignOutButton className="inline-flex min-h-9 items-center justify-center rounded-lg border border-line-strong bg-white px-3 py-2 text-[11px] font-extrabold text-ink hover:border-jade hover:text-jade-dark" />
                </>
              )}
            </div>

            <details className="group relative hidden max-md:block">
              <summary
                aria-label="Open navigation"
                className="grid size-10 cursor-pointer list-none place-content-center gap-1 rounded-lg border border-line bg-white text-ink marker:hidden"
              >
                <span className="block h-0.5 w-4 rounded-full bg-current" aria-hidden="true" />
                <span className="block h-0.5 w-4 rounded-full bg-current" aria-hidden="true" />
              </summary>
              <div className="absolute top-[calc(100%+10px)] right-0 z-80 w-[min(290px,calc(100vw-28px))] overflow-hidden rounded-xl border border-line-strong bg-white p-2 shadow-panel">
                <nav className="grid" aria-label="Mobile navigation">
                  {nav.map(([key, href, label]) => (
                    <Link
                      aria-current={active === key ? "page" : undefined}
                      className={`rounded-lg px-3 py-3 text-xs font-bold no-underline ${
                        active === key
                          ? "bg-jade-soft text-jade-dark"
                          : "text-muted hover:bg-jade-soft hover:text-jade-dark"
                      }`}
                      href={href}
                      key={`${key}-mobile`}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-2 grid gap-1 border-t border-line pt-2">
                  {!isAuthenticated ? (
                    <Link
                      className="rounded-lg px-3 py-3 text-xs font-extrabold text-jade-dark no-underline hover:bg-jade-soft"
                      href="/auth/sign-in"
                    >
                      Sign in
                    </Link>
                  ) : (
                    <>
                      <Link
                        className="rounded-lg px-3 py-3 text-xs font-extrabold text-jade-dark no-underline hover:bg-jade-soft"
                        href="/saved"
                      >
                        Private workspace
                      </Link>
                      <SignOutButton className="rounded-lg px-3 py-3 text-left text-xs font-bold text-white hover:bg-jade-dark bg-jade" />
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
