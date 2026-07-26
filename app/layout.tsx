import type { Metadata } from "next";
import { RouteFooter } from "@/components/route-footer";
import { SupportKoriWidget } from "@/components/support-kori-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "b4join", template: "%s — b4join" },
  description: "Turn workplace evidence into company-specific questions you can verify before joining.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://b4joinacompany.netlify.app"),
  applicationName: "b4join",
  keywords: ["workplace research", "company reviews", "job offer questions", "Bangladesh jobs", "b4join"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "b4join",
    title: "b4join — Verify before you join",
    description: "Turn workplace evidence into company-specific questions you can verify before joining.",
    url: "/"
  },
  twitter: {
    card: "summary",
    title: "b4join — Verify before you join",
    description: "Turn workplace evidence into company-specific questions you can verify before joining."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="min-w-80 scroll-smooth" lang="en">
      <body className="flex min-h-screen flex-col bg-mist font-body text-ink antialiased">
        <div className="flex-1">{children}</div>
        <RouteFooter />
        <SupportKoriWidget />
      </body>
    </html>
  );
}
