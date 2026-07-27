import { SiteFooter } from "@/components/site-footer";
import { SupportKoriWidget } from "@/components/support-kori-widget";
import { generateRootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata = generateRootMetadata();

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
