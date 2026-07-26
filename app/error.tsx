"use client";

import { useEffect } from "react";

import { ErrorPage } from "@/components/error-page";

export default function Error({
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
    <ErrorPage
      kind="server-error"
      onRetry={unstable_retry ?? reset}
    />
  );
}
