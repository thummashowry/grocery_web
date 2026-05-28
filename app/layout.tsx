import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { FloatingCartButton } from "@/components/floating-cart-button";

export const metadata: Metadata = {
  title: "Hybrid Grocer",
  description: "Premium grocery ecommerce for in-store and online delivery ordering"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteHeader />
        <main className="pb-28 md:pb-10">{children}</main>
        <FloatingCartButton />
        <MobileBottomNav />
      </body>
    </html>
  );
}
