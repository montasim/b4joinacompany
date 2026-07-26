import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SupportKoriWidget } from "@/components/support-kori-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "b4joinacompany", template: "%s — b4joinacompany" },
  description: "Turn workplace evidence into company-specific questions you can verify before joining.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://b4joinacompany.netlify.app"),
  applicationName: "b4joinacompany",
  keywords: ["workplace research", "company reviews", "job offer questions", "Bangladesh jobs", "b4joinacompany"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "b4joinacompany",
    title: "b4joinacompany — Verify before you join",
    description: "Turn workplace evidence into company-specific questions you can verify before joining.",
    url: "/"
  },
  twitter: {
    card: "summary",
    title: "b4joinacompany — Verify before you join",
    description: "Turn workplace evidence into company-specific questions you can verify before joining."
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="min-w-80 scroll-smooth" lang="en">
      <body className="flex min-h-screen flex-col bg-mist font-body text-ink antialiased">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <SupportKoriWidget />
      </body>
    </html>
  );
}
