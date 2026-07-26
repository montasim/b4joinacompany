"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/utils";

export function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const label = session?.user?.name ? initials(session.user.name) : "MM";

  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <details className="relative">
      <summary className="grid size-9 cursor-pointer list-none place-items-center rounded-lg border border-line bg-ink text-[10px] font-extrabold text-white marker:hidden" aria-label="Open account menu">{label}</summary>
      <div className="absolute top-[calc(100%+8px)] right-0 z-80 min-w-37.5 overflow-hidden rounded-lg border border-line bg-white p-1.5 shadow-xl">
        <Link className="flex min-h-9 w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-bold text-ink-soft no-underline hover:bg-jade-soft hover:text-jade-dark [&_svg]:size-4" href="/account"><UserRound />Account</Link>
        <button className="flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[10px] font-bold text-ink-soft hover:bg-jade-soft hover:text-jade-dark [&_svg]:size-4" type="button" onClick={signOut}><LogOut />Sign out</button>
      </div>
    </details>
  );
}
