"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

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
