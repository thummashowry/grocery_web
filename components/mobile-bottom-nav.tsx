"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Grid2x2, ShoppingCart, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/products", icon: Grid2x2, label: "Shop" },
    { href: "/cart", icon: ShoppingCart, label: "Cart" },
    ...(user?.role === "admin" || user?.role === "staff"
      ? [{ href: user.role === "admin" ? "/admin" : "/staff", icon: ShieldCheck, label: user.role === "admin" ? "Admin" : "Staff" }]
      : []),
    {
      href: user ? "#logout" : "/login",
      icon: User,
      label: user ? user.name.split(" ")[0] : "Sign in",
      onClick: user ? () => { logout(); router.push("/"); } : undefined
    }
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-2xl border border-spruce-100 bg-white/95 p-1 shadow-card backdrop-blur md:hidden">
      <ul className={`grid gap-1 grid-cols-${navItems.length}`} style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((item) => {
          const active =
            item.href !== "#logout" &&
            (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
          const Icon = item.icon;

          const content = (
            <>
              {user && item.label !== "Sign in" && item.icon === User ? (
                <span className="mb-1 grid h-4 w-4 place-items-center rounded-full bg-spruce-600 text-[9px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <Icon className="mb-1 h-4 w-4" />
              )}
              <span className="max-w-[48px] truncate">{item.label}</span>
            </>
          );

          return (
            <li key={item.href}>
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className={cn(
                    "flex w-full flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium transition",
                    "text-slate-500 hover:text-spruce-700"
                  )}
                >
                  {content}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[11px] font-medium transition",
                    active ? "bg-spruce-100 text-spruce-800" : "text-slate-500 hover:text-spruce-700"
                  )}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
