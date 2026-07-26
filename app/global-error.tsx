"use client";

import { useEffect } from "react";

import { ErrorPage } from "@/components/error-page";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html className="min-w-80 scroll-smooth" lang="en">
      <body className="flex min-h-screen flex-col bg-mist font-body text-ink antialiased">
        <ErrorPage
          kind="server-error"
          onRetry={unstable_retry ?? reset}
          standalone
        />
      </body>
    </html>
  );
}
