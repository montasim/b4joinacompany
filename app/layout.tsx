import type { Metadata } from "next";
import { RouteFooter } from "@/components/route-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "b4join", template: "%s — b4join" },
  description: "Turn workplace evidence into questions you can verify before joining."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="min-w-80 scroll-smooth" lang="en">
      <body className="flex min-h-screen flex-col bg-mist font-body text-ink antialiased">
        <div className="flex-1">{children}</div>
        <RouteFooter />
      </body>
    </html>
  );
}
