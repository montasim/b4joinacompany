"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";

export function RouteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/auth/")) return null;
  return <SiteFooter />;
}
