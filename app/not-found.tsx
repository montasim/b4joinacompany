import type { Metadata } from "next";

import { ErrorPage } from "@/components/error-page";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested address does not match a published b4joinacompany page.",
};

export default function NotFound() {
  return <ErrorPage kind="not-found" />;
}
