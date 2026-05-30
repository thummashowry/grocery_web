"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  Boxes,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/coupons", label: "Promotions", icon: Tag },
  { href: "/admin/employees", label: "Employees", icon: Users },
  { href: "/admin/stock", label: "Stock & Alerts", icon: Boxes }
];

// Pages inside /admin that don't require auth (login page)
const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const isPublic = PUBLIC_ADMIN_PATHS.includes(pathname);

  useEffect(() => {
    if (loading || isPublic) return;
    if (!user) {
      router.replace("/admin/login");
    } else if (user.role !== "admin") {
      // Staff can only see /staff, not admin panel
      router.replace("/staff");
    }
  }, [user, loading, isPublic, router, pathname]);

  // Show nothing while checking auth (prevents flash of protected content)
  if (!isPublic && (loading || !user || user.role !== "admin")) {
    return null;
  }

  // Login page — no sidebar
  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-0 px-4 py-6 sm:flex-row sm:gap-6 sm:px-6">
      {/* Sidebar */}
      <aside className="w-full shrink-0 sm:w-56">
        <div className="rounded-2xl border border-spruce-100 bg-white p-3 shadow-soft sm:sticky sm:top-20">
          <div className="mb-3 flex items-center gap-2 px-2 py-1">
            <ShieldCheck className="h-5 w-5 text-spruce-600" />
            <span className="text-sm font-semibold text-ink">Admin Panel</span>
          </div>
          <nav>
            <ul className="space-y-0.5">
              {adminNav.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                        active
                          ? "bg-spruce-100 text-spruce-800"
                          : "text-slate-600 hover:bg-slate-50 hover:text-spruce-700"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Signed-in user strip */}
          <div className="mt-3 border-t border-spruce-100 pt-3">
            <div className="px-2">
              <p className="text-xs font-semibold text-ink truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); router.push("/admin/login"); }}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
