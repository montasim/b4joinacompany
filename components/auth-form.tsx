"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthForm({
  callbackURL = "/saved",
  googleEnabled = false
}: {
  callbackURL?: string;
  googleEnabled?: boolean;
}) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function continueWithGoogle() {
    setPending(true);
    setMessage("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL
      });
      if (result?.error) throw new Error(result.error.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign-in could not start.");
      setPending(false);
      return;
    }

    if (typeof window !== "undefined") {
      window.setTimeout(() => setPending(false), 5000);
    }
  }

  return (
    <div className="grid gap-3.5">
      <Button
        disabled={pending || !googleEnabled}
        type="button"
        onClick={continueWithGoogle}
      >
        {pending ? "Opening Google…" : "Continue with Google"}
      </Button>
      {!googleEnabled && (
        <p className="m-0 text-[11px] leading-relaxed text-coral" role="alert">
          Google sign-in is not configured for this environment.
        </p>
      )}
      {message && <p aria-live="polite" className="m-0 text-[11px] leading-relaxed text-coral">{message}</p>}
    </div>
  );
}
