"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, ShoppingCart, ClipboardList, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Grid2x2, label: "Shop" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/checkout", icon: ClipboardList, label: "Checkout" },
  { href: "/staff", icon: LayoutDashboard, label: "Staff" }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-2xl border border-spruce-100 bg-white/95 p-1 shadow-card backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium transition",
                  active ? "bg-spruce-100 text-spruce-800" : "text-slate-500 hover:text-spruce-700"
                )}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
