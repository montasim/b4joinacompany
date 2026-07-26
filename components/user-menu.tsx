"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/utils";

export function SignOutButton({
  className = "",
  children = "Sign out"
}: {
  className?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message);
      router.push("/");
      router.refresh();
    } catch {
      setError("Sign out failed. Try again.");
      setPending(false);
    }
  }

  return (
    <>
      <button
        className={`cursor-pointer border-0 bg-transparent disabled:cursor-wait disabled:opacity-60 ${className}`}
        disabled={pending}
        type="button"
        onClick={signOut}
      >
        {pending ? "Signing out…" : children}
      </button>
      {error && (
        <span className="px-3 pb-2 text-[9px] leading-relaxed text-coral" role="alert">
          {error}
        </span>
      )}
    </>
  );
}

export function UserMenu({
  name,
  workspaceHref = "/saved",
  workspaceLabel = "Private workspace"
}: {
  name?: string | null;
  workspaceHref?: string;
  workspaceLabel?: string;
}) {
  const { data: session } = authClient.useSession();
  const displayName = session?.user?.name ?? name ?? "User";
  const label = initials(displayName);

  return (
    <details className="relative">
      <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line bg-ink text-[10px] font-extrabold text-white marker:hidden" aria-label="Open account menu">{label}</summary>
      <div className="absolute top-[calc(100%+8px)] right-0 z-80 min-w-37.5 overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-xl">
        <Link className="flex min-h-9 w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-bold text-ink-soft no-underline hover:bg-jade-soft hover:text-jade-dark [&_svg]:size-4" href={workspaceHref}><Bookmark />{workspaceLabel}</Link>
        <SignOutButton className="flex min-h-9 w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-bold text-ink-soft hover:bg-jade-soft hover:text-jade-dark [&_svg]:size-4">
          <LogOut />Sign out
        </SignOutButton>
      </div>
    </details>
  );
}
