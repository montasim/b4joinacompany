import Link from "next/link";
import { Bell } from "lucide-react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

export function SiteHeader({
  active = "Research",
  mode = "user",
  purpose
}: {
  active?: "Research" | "Compare" | "Saved" | "Extension" | "Support" | "Admin" | "Sign in";
  mode?: "public" | "user" | "admin";
  purpose?: string;
}) {
  const nav =
    mode === "admin"
      ? [
          ["Admin", "/admin"],
          ["Corrections", "/admin#corrections"],
          ["Snapshots", "/admin#snapshots"],
          ["Providers", "/admin#providers"]
        ]
      : [
          ["Research", "/"],
          ["Compare", "/compare"],
          ["Saved", "/saved"],
          ["Extension", "/extension"],
          ["Support", "/support"]
        ];
  const mobileNav = mode === "admin"
    ? [["Admin", "/admin"], ["Snapshots", "/admin#snapshots"], ["Providers", "/admin#providers"]]
    : [["Research", "/"], ["Compare", "/compare"], ["Saved", "/saved"]];
  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid min-h-17 w-[calc(100%_-_40px)] max-w-290 grid-cols-[1fr_auto_1fr] items-center gap-7 max-sm:min-h-15.5 max-sm:w-[calc(100%_-_28px)] max-sm:grid-cols-[1fr_auto]">
        <Brand purpose={purpose ?? (mode === "admin" ? "Owner console" : undefined)} />
        <nav className="flex gap-1 max-md:hidden" aria-label="Primary navigation">
          {nav.map(([label, href]) => (
            <Link
              key={`${label}-${href}`}
              className={`rounded-lg px-3 py-2 text-xs font-bold no-underline ${
                active === label ? "bg-jade-soft text-jade-dark" : "text-muted hover:bg-jade-soft hover:text-jade-dark"
              }`}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-self-end gap-2">
          {mode === "public" ? (
            <>
              <Link className="text-xs font-extrabold text-jade-dark underline decoration-jade/35 underline-offset-3 max-sm:hidden" href="/auth/sign-in">Sign in</Link>
              <Button className="max-sm:hidden" asChild size="sm"><Link href="/#research">Check a company</Link></Button>
            </>
          ) : mode === "admin" ? (
            <Button asChild size="sm"><Link href="/account">Leave console</Link></Button>
          ) : (
            <>
              <Button className="max-sm:hidden" asChild size="sm"><Link href="/#research">Check a company</Link></Button>
              <Link className="relative grid size-9 place-items-center rounded-lg border border-line bg-white text-ink-soft no-underline after:absolute after:top-1.5 after:right-1.5 after:size-1.5 after:rounded-full after:border-2 after:border-white after:bg-coral max-sm:hidden [&_svg]:size-5" href="/notifications" aria-label="Evidence updates"><Bell /></Link>
              <UserMenu />
            </>
          )}
        </div>
      </div>
    </header>
    <nav className="fixed right-0 bottom-0 left-0 z-60 hidden min-h-16 grid-cols-3 border-t border-line bg-white/95 backdrop-blur-md max-sm:grid" aria-label="Mobile navigation">
      {mobileNav.map(([label, href]) => (
        <Link
          className="grid place-items-center p-2 text-[10px] font-bold text-muted no-underline aria-[current=page]:text-jade-dark"
          key={`${label}-mobile`}
          aria-current={active === label ? "page" : undefined}
          href={href}
        >
          {label}
        </Link>
      ))}
    </nav>
    </>
  );
}
